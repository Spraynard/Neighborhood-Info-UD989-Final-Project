import pico
import requests
import json
import re
import string
import time
import sqlite3
import sys
from urllib2 import HTTPError


#Creates database for token storage and security purposes

def deleteTable():
	cursor.execute('''DROP TABLE IF EXISTS api_info''')
	dbConn.commit()

def createTable():
	cursor.execute("CREATE TABLE api_info(grantType text, clientId text, clientSecret text, clientToken text DEFAULT 'NULL')")
	dbConn.commit()

def getToken(update = 0):
	dbConn = sqlite3.connect('apiStorage.db')
	cursor = dbConn.cursor()
	token, grantType, clientId, clientSecret = cursor.execute('''SELECT
					clientToken, grantType, clientId, clientSecret FROM api_info''').fetchone()

	if (token == 'NULL') or (update == 1):
		givenData = {
			"grant_type" : grantType,
			"client_id" : clientId,
			"client_secret" : clientSecret
		}

		apiCall = requests.post('https://api.yelp.com/oauth2/token', data = givenData)
		apiReturn = apiCall.json()
		token = apiReturn['access_token']
		cursor.execute("UPDATE api_info SET clientToken ='" + token + "'")
		dbConn.commit()
		dbConn.close()
	else:
		dbToken = cursor.execute("SELECT clientToken FROM api_info").fetchone()[0]
		dbConn.close()
		return dbToken

def addRegexEscape(string):
	# Summary: "Double quotes need to be escaped to be used in regex. This function escapes them"
	# Parameter: string - String of punctuations in the string.punctuation python lib.
	# Returned: An escaped string for python regex use

	index = string.find('"')
	outputString = string[:index] + "\\" + string[index:]

	return outputString

regexPattern = '[' + addRegexEscape(string.punctuation) + ']'

#THIS FUNCTIONALITY IN THE CODE NEEDS TO BE ADDED TO THE LINTER, APPARENTLY.
def reduce_str(string):
	r = re.compile(regexPattern)

	for c in string:
		match = r.match(c)

		if match:
			char = match.group()

			if char == "_":
				string = string.replace(char, " ")
			else:
				string = string.replace(char, "")

	string = ("-").join(string.split(" "))
	
	return string


def linter(rName = None, rAddress = None):
	# Summary: Removes all punctuation from an address or a name so it is formatted for any Yelp Fusion api call
	# Parameters: rName - Name of the restaurant
	#			rLocation - Address of the restaurant
	# Return: array [formatted(rName), formatted(rAddress)]

	if (rName == None) and (rAddress == None):
		return Exception("D'oh! You forgot to put any parameters in. Lucky for you I'm putting up an exception for that")
	elif not isinstance(rName, str) and not isinstance(rAddress, str):
		return Exception("Both parameters need to be in string form. You're putting in something else.")
	else:
		if not (rName == None) and rAddress == None:

			return reduce_str(rName)

		elif rName == None and not (rAddress == None):

			return reduce_str(rAddress)
		else:

			return [reduce_str(rName), reduce_str(rAddress)]

def buildHeader():
	dbConn = sqlite3.connect('apiStorage.db')
	cursor = dbConn.cursor()
	token = cursor.execute("SELECT clientToken FROM api_info").fetchone()[0]
	header = {"Authorization": 'Bearer ' + token}
	dbConn.close()
	return header

# def areaLookup(name_Lat, location_Lng, searchTerm = None) :
# 	# Summary: Sends a 'get' request to the yelp api, and returns restaurant information about a specific restaurant
# 	#			with a name and location search.
# 	# Parameters: name_Lat - The name of the restaurant we're searching, or the latitude
# 	#
# 	#			location - The location of the place. From the looks of it, this will not take a google latLng object
# 	#						but that has not been tested, or the longitude
# 	#			
# 	#			searchTerm - None by default. When user inputs latitude and longitude, they can use this search term to further
# 	#						locate the restaurant

# 	#Return: Restaurant information all according to Yelp

# 	#Edits: Because the yelp API is not returning information it SHOULD return (given a search term of the business name, a lat, a long, a location still doesn't produce the restaurant I'm looking for)

# 	#	Looks in the db for the records.
# 	areaYelpLookup = None
# 	requestHeader = buildHeader()

# 	#Error Throwing area
# 	if isinstance(location_Lng, str) and searchTerm != None:
# 		raise Exception("If you are inputting a location string (e.g. 'Kalamazoo MI') then do not use a search term")
# 	elif type(name_Lat) != type(location_Lng):
# 		raise Exception("This function only accepts name input of the same type as location input (e.g. str w/ str, int w/ int)")
# 	elif not (isinstance(name_Lat, str) or isinstance(name_Lat, float)) or not (isinstance(location_Lng, str) or isinstance(location_Lng, float)):
# 		raise Exception("You're putting boolean or something else into the name or location areas. Check your code.")
# 	elif not (isinstance(name_Lat, str) or isinstance(name_Lat, float)) and not (isinstance(location_Lng, str) or isinstance(location_Lng, float)):
# 		raise Exception("You're putting booleans or something else in both the name or location inputs. Check your code.")
	
# 	#Meat of the function
# 	# if isinstance(name_Lat, float) and isinstance(location_Lng, float):
# 	# 	name_Lat = str(name_Lat)
# 	# 	location_Lng = str(location_Lng)
# 	# 	if searchTerm == None:
# 	# 		try:
# 	# 			areaYelpLookup = requests.get('https://api.yelp.com/v3/businesses/search?latitude=' + name_Lat + '&longitude=' + location_Lng, headers = requestHeader)
# 	# 		except:
# 	# 			print("Something's Wrong with the api call. Most Likely the token is expired")
# 	# 	else:
# 	# 		searchTerm = linter(searchTerm)
# 	# 		url = 'https://api.yelp.com/v3/businesses/search?term=' + searchTerm + '&latitude=' + name_Lat + '&longitude=' + location_Lng
# 	# 		print url
# 	# 		try:
# 	# 			areaYelpLookup = requests.get('https://api.yelp.com/v3/businesses/search?term=' + searchTerm + '&latitude=' + name_Lat + '&longitude=' + location_Lng, headers = requestHeader)
# 	# 		except:
# 	# 			print()
# 	# 			print("Something's Wrong with the api call. Most Likely the token is expired")
# 	# 	raise Exception("Cannot use lat and long right now, working on it.")
# 	# elif (isinstance(name_Lat, str) and isinstance(location_Lng, str)):
# 	# 	#This portion of the function will not take search term. If we use a location string then the search term
# 	# 	# that is used is the name of the restaurant.

# 	# 	name_Lat, location_Lng = linter(name_Lat, location_Lng)
# 	# 	print location_Lng
# 	# 	try:
# 	# 		areaYelpLookup = requests.get('https://api.yelp.com/v3/businesses/search?location='+location_Lng, headers = requestHeader)
# 	# 	except:
# 	# 		print("Something's Wrong with the api call. Most Likely the token is expired")

# 	return areaYelpLookup

# def is_json(text):
# 	if type(text) == "requests.models.Response":
# 		text = text.text
# 	try:
# 		jsonObj = json.loads(text)
# 	except ValueError, e:
# 		return False
# 	return True

# def addresstoID(yReturn, address):
# #	Summary: Find yelp's restaurant ID for a specific address by matching the two addresses:
# #	Parameter: yReturn - The full return that a Yelp Fusion Search API call is going to give
# #				address - The input address that we are trying to match with our yelp return
# #	Returns: Yelp business information in JSON format.
# 	print "This is the address " + address
# 	if not isinstance(address, str):
# 		raise Exception("The input address needs to be a string")
# 	elif not is_json(yReturn):
# 		raise Exception("The API return must be in json format, not currently in JSON.")
# 	yelpReturn = json.loads(yReturn)
# 	businessList = yelpReturn['businesses']

# 	for i in range(len(businessList)):
# 		businessAddress = businessList[i]['location']['address1']

# 		if address == businessAddress:
# 			return businessList[i]['id']

# 	return Exception("Apparently the address you have put in does not match a Yelp Address...\
# 		Look at your address again please and let me know!!!")

def idLookup(restaurantID):
#	Summary: Sends a get request to Yelp Fusion API to get the only choice that we have.
#	Parameter: restaurantID. The specific Yelp Restaurant ID of a restaurant.
#	Returns: Restaurant information in .json format.

	header = buildHeader()
	
	restaurantInfo = None
	restaurantID = str(restaurantID)
	if not isinstance(restaurantID, str):
		raise Exception("The restaurant ID needs to be a string.")
	try:
		restaurantInfo = requests.get('https://api.yelp.com/v3/businesses/' + restaurantID, headers = header).text
	except:
		print("Something's Wrong with the api call. Most Likely the token is expired")
	return restaurantInfo

## testArea ##
def test1():
	rInfo = {
		"name" : "Steak 'n' Shake",
		"address" : "5371 W. Main",
		"city/state" : "Kalamazoo/MI",
		"coords" : {"lat": 42.298611 , "lng": -85.657182},
	}

	iD = "steak-n-shake-kalamazoo"
	business = idLookup(iD)
	print json.loads(business.text)

# test1()
###
###	REFACTOR DOWN HERE ###