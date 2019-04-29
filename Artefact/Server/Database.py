from tinydb import TinyDB

#This class is a wrapper for the tiny DB databases
class Database:

	def __init__(self,name, loc, d_auth, w_auth, r_auth, can_query):
		self.can_query  = can_query
		self.name        = name
		self.db          = TinyDB(loc)
		self.loc         = loc
		self.delete_auth = d_auth
		self.write_auth  = w_auth
		self.read_auth   = r_auth

	#Gets the tinydb db
	def GetDB(self):
		return self.db

	#Gets the data for a user when given an ID
	def get_user(self, user_id):
		for user in self.db:
			for doc in user:
				user = user[doc]
				if 'p_ID' in user:
					if user['p_ID'] == user_id:
						return user

		return False

	#Creates a dict with all of the data made through the request
	def get_map_fields(self, fields, maps):
		response = {'payload': []}
		is_all = False
		is_experince = False

		#Make a dictionary of users just to make sure we dont get any duplicates
		sampled_users = {}

		#Check for special queries
		if 'all' in maps:
			is_all = True

		#Check for experience in query
		if 'q_Experience'in fields:
			is_experince = True


		for doc in self.db.all():

			#Really annoying hack that has to be done because TinyDB is a bit weird in its document hierarchy
			user =0
			for user in doc:
				user = doc[user]

			if user['p_ID'] in sampled_users:
				continue
			#check they have the map field
			if 'p_Maps' in user:

				field_arr = {}

				if is_experince and 'p_Questionaire' in user:
					field_arr['q_Experience'] = user['p_Questionaire']['q_Experience']

				#loop through the users maps
				for m_map_id in user['p_Maps']:

					#if the map ID is not in the maps skip
					if m_map_id not in maps and  not is_all:
						continue

					m_map = user['p_Maps'][m_map_id]
					#generate an array with each of the request fields
					field_arr[m_map_id] = []
					for field in fields:
						if field in m_map:
							field_arr[m_map_id].append(m_map[field])

				#add the user to the dict to track if we have it
				sampled_users[user['p_ID']] = 1
				response['payload'].append(field_arr)

		return response