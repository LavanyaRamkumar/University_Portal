import random, os, json, datetime, time ,string
from flask import *
import hashlib
from pymongo import *
import string 
import datetime
#import request
import re

app = Flask(__name__)
client = MongoClient(port=27017)
db = client.pes3.results

def getBatch(usn):
	return "2016-20"

def getSession():
	return "Aug-Dec"

def getSem(usn):
	return 1

@app.route('/PES/sem/course/<c_id>/type/<type_a>', methods = ['POST'])
def upload(c_id, type_a):
	print(type_a)
	t_id = request.args.get('t_id')
	print(t_id)
	j = request.get_json()
	u = j['u']
	print("THERE?",u)
	final = []
	for i in u:
		USN = i['USN']
		marks = i['marks']
		print(marks)
		batch = getBatch(USN)
		session = getSession()
		sect = "A"
		sem = getSem(USN)
		course = {}
		course[type_a] = marks
		course['teacher'] = t_id
		ses = {}
		ses['sem'] = sem
		ses[c_id] = course
		sec = {}
		sec[session] = ses
		bat = {}
		bat[USN] = sec
		data = {}
		data[batch] = bat
		#print(data)
		json_data = json.dumps(data)
		value = json.loads(json_data)
		print(json_data)
		db.insert(value)
		"""user = db.find({batch : {$exists:1}})
		if(!user):
			db.insert(value)
		else:
		"""
		final.append(data)
	print(final)
	fin = jsonify({"u" : final})
	print(fin)
	#db.insert()
	return fin

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)