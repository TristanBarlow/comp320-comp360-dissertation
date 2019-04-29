from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from HandleRequest import Handler
import ssl,sys
import datetime

hostName = ""
hostPort = 8080


#This class handles all of the connections and the socket level sending and receiving messages
class MyServer(BaseHTTPRequestHandler):

	#Stops the default logging of the class
	def log_message(self, format, *args):
		pass

	#Sends all of the headers required
	def my_send_headers(self):
		self.send_response(200)
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header("Access-Control-Allow-Headers", "*")
		self.send_header('Access-Control-Allow-Methods', 'GET,POST, OPTIONS')
		self.send_header("Access-Control-Allow-Headers", "Content-Type")
		self.send_header('Content-type', 'text/html')
		self.end_headers()

	#Override the base class and handles the incoming post messages
	def do_POST(self):
		self.my_send_headers()

		content_length = int(self.headers['Content-Length'])  # <--- Gets the size of data
		post_data = self.rfile.read(content_length)  # <--- Gets the data itself

		#Process the incoming message
		Handler.process_post(post_data)

		Handler.incr_stat(self.client_address[0], 'queries')

		#Print the current handler log
		self.print_message(Handler.get_log())

		#Try because sometimes if the user DCs it will error and crash the server
		try:

			#Send message
			self.wfile.write(Handler.response.encode("utf-8"))
			self.send_response(200)
		except Exception as e:
			self.print_message("Failed to send")



	def do_GET(self):
		self.my_send_headers()

		#Any kind of get increment visits
		Handler.incr_stat(self.client_address[0], 'visits')

		#Try because sometimes if the user DCs it will error and crash the server
		try:
			self.print_message(Handler.get_log())
			self.send_response(200)
		except Exception as e:
			self.print_message("Failed to send")

	#Prints a log message with any extra details
	def print_message(self, extra):
		now = datetime.datetime.now()
		print("IP : " + "[" + self.client_address[0] + "] TIME : [" + now.strftime("%Y/%m/%d %H:%M:%S") + "] LOG : [" + extra + "]")

	#Override internal class and force
	def do_OPTIONS(self):
		self.send_response(200, "ok")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header("Access-Control-Allow-Headers", "*")
		self.send_header('Access-Control-Allow-Methods', 'GET,POST, OPTIONS')
		self.send_header("Access-Control-Allow-Headers", "Content-Type")
		self.end_headers()


#runs the server forever, is recursive
def run():
	myServer = HTTPServer((hostName, hostPort), MyServer)

	#If the python function has been called with an arg encrypt the sockets
	if len(sys.argv) > 1:
		# myServer.socket = ssl.wrap_socket (myServer.socket,
		#       certfile = "./server.pem", server_side=True)
		myServer.socket = ssl.wrap_socket(myServer.socket,
		                                  keyfile="/etc/letsencrypt/live/tristanbarlowgriffin.co.uk/privkey.pem",
		                                  certfile="/etc/letsencrypt/live/tristanbarlowgriffin.co.uk/fullchain.pem",
		                                  server_side=True)
	#print start time
	print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

	#run forever
	try:
		myServer.serve_forever()

	except KeyboardInterrupt:
		pass
	except ConnectionResetError:
		myServer.server_close()
		print ("Connection reset error from ip | Restarting" )

		#if error call recursively
		run()


	myServer.server_close()
	print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))

run()



