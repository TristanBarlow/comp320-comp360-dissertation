#!/usr/bin/python3

from tinydb import TinyDB
import json
from Database import  Database
from tinydb import  Query
from tinydb import  where


#This class handles all of the database interactions
class JsonHandler:

	def __init__(self):
		self.active_db = None
		self.auth     = 0
		self.response = ""
		self.log      = ""

	#TURins into json
	def send_json_response(self,response, raw = False):
		self.response = json.dumps(response)

	#Codes responses into one uniform structure
	def send_response(self, r,):
		self.send_json_response({"response": r})

	#takes incoming post data and decodes it, and tries to hanlde it
	def process_post(self, post_data):

		#Clear log message
		self.log = ""
		self.auth = 0

		try:
			incoming_data = json.loads(post_data)
			self.process_json(incoming_data)

			self.log = "Success: " + self.log
		except Exception as e:
			self.send_response("Failed to process request")
			self.log += "Failed: " + str(e)

	#Takes json data and converts it into the two types
	def process_json(self, json_data):
		if "type" in json_data:

			#Process the data dependent on the message type
			if json_data["type"] in TYPE_DICT:

				#Set this users auth level
				self.set_auth(json_data)

				#call any of the different message types
				TYPE_DICT[json_data["type"]](json_data)
			else:
				raise ValueError( "[Type: " + json_data["type"] + " failed]")

		else:
			raise ValueError("No type field in json data")

	#Processes incoming results sent by participants
	def process_results(self, json_data):

		message = json_data["message"]
		del message['p_Questionaire']['q_Code']

		#get the user maps add them to the maps db
		maps    = message["p_Layouts"]
		map_db  = DATABASE_DICT["maps"]
		map_db.db.insert({message["p_ID"]: maps})

		#delete the messages
		del message["p_Layouts"]

		self.active_db = DATABASE_DICT["real"]

		#If user doesnt have auth switch to test db
		if self.auth <self.active_db.write_auth:
			self.active_db = DATABASE_DICT["test"]

		self.log += " Added Results into " + self.active_db.name

		#Dump the results into the main database
		self.active_db.db.insert({message["p_ID"]: message})

	#Takes a message and sets the active db if there it can
	def set_db(self, message):

		#Set database to the correct one
		if "database" in message:
			self.db_id = message["database"]
			if self.db_id in DATABASE_DICT:
				self.active_db = DATABASE_DICT[self.db_id]

			else:
				self.send_response("Database not found")
				raise ValueError("Database not found")
		else:
			self.send_response("Database field not found")
			raise ValueError("Database field not found")

	#Set the authentication level for the current user
	def set_auth(self, message):
		if "password" in message:
			if message["password"] in PASSWORD_DICT:
				self.auth = PASSWORD_DICT[message["password"]]

				return
		#if no password then auth level = 0
		self.auth = 0

	#Main function that handles all of the requests made by the server
	def process_query(self, json_data):

		message = json_data["message"]

		#Set the active db
		self.set_db(message)

		#Make sure the user has the rights to view that database
		if self.auth < self.active_db.read_auth:
			raise ValueError("Insufficient permissions to view " + self.active_db.name)

		#Look for the command the user is issuing in the command dict
		if "command" in message:
			comm = message["command"]
			if comm in COMMAND_DICT:

				#Call the function with the message payload
				COMMAND_DICT[comm](message["payload"])
			else:
				raise ValueError("Command : " + comm + " does not exist")
		else:
			raise ValueError("No command Field")

	#Increments stats such as visits or queries
	def incr_stat(self, IP, field):
		self.active_db = DATABASE_DICT["stats"]

		stat = Query()

		#Make the query into the database
		try:
			entry = self.active_db.db.search(stat[IP])[0][IP]

			entry[field] = entry[field] + 1

			self.log += "| " + field  + " : " + str(entry[field])

			self.active_db.db.upsert({IP:entry}, stat[IP])
		except:
			self.active_db.db.remove(stat.IP == IP)
			self.active_db.db.insert({IP : {'visits': 0, 'queries': 0}})
			self.incr_stat(IP, field)

	#Gets the current state of the log, and wipes it
	def get_log(self):
		t = self.log
		self.log = ""
		return t

	#this function retrieves the requested fields from the active database
	def process_get_fields(self, payload):

		#Query the database interface class
		response = self.active_db.get_map_fields(payload['fields'], payload['maps'])

		#Form the response
		self.send_json_response(response)

		#Form the log
		self.log += "Request for fields  from database %s [" % self.active_db.name
		for field in payload:
			self.log += field + ", "
		self.log += "]"

	#This function handles the swapping of users to and from databases
	def process_database_swap(self, payload):

		to_database = DATABASE_DICT[payload['to_db']]
		user = self.active_db.get_user(payload['user_id'])

		if user:
			to_database.db.insert({payload['user_id']: user})
			self.active_db.db.remove(where('p_ID') == payload['user_id'])
			self.log += "Successfully moved user: %s from %s database to %s database" % (payload['user_id'], self.active_db.name, payload['to_db'])
			self.send_response('Moved User')
		else:
			self.log += "Failed to move user, user could not be found "
			self.send_response('Could not find user')

	#Internal function that forms the full database send
	def process_view(self ,payload):
		self.send_json_response(self.active_db.db.all())
		self.log += "Viewing Results from " + self.active_db.name

	#Function that is called to wipe a database
	def process_delete(self, payload):

		#Check to make sure the current request has high enough auth level
		if self.auth >= self.active_db.delete_auth:
			self.active_db.db.purge()
			self.log += "Deleted Results from " + self.active_db.name

		else:
			raise ValueError("Insufficient permissions to delete " + self.active_db.name)

	#Interface Function callled to send back the entire active database
	def process_raw_view(self, payload):
		self.process_view(True)


Handler = JsonHandler()

# ----------- Below iare just static dictionaries.
TYPE_DICT = {
				"R" : Handler.process_results,
				"D" : Handler.process_query
			}

STAT_TYPE_DICT = {
					"visit":1
				}

COMMAND_DICT = {
				"view"      : Handler.process_view,
				"rView"     : Handler.process_raw_view,
				"delete"    : Handler.process_delete,
				"get_map_fields": Handler.process_get_fields,
				"database_swap": Handler.process_database_swap,
				}

DATABASE_DICT = {
				"stats" : Database("Stats"       ,"DBReal/stats.json"   , 5, 1, 3, True),
				"real"  : Database("Results"     ,"DBReal/results.json", 5, 1, 0, True),
				"test"  : Database("test"         ,"DBTest/test.json", 3, 0, 0, True),
				"maps"  : Database("Maps"        ,"Maps/maps.json"  , 3, 0, 0, False),
				}

PASSWORD_DICT = {
					"notTheActualPassword1": 1,
					"notTheActualPassword2": 3,
					"notTheActualPassword3": 5,
				}








