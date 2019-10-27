import random, os, json, datetime, time ,string
from flask import *
import hashlib
from pymongo import *
import string 
import datetime
#import request
import re
from flask_cors import *
import csv
import requests 
import time

app = Flask(__name__)
cors = CORS(app)
client = MongoClient(port=27017)
db = client.pes3

# {t_id : "sfv", course:[{USN : "eg", ISA1:98, ISA2 :66},{}]}
"""@app.route('/PES/sem/course/<c_id>/type/<type_a>', methods = ['GET'])
def getEnteredMarks(c_id, type_a):  #api 2
	t_id = request.args.get('t_id')
	#db.find({"course.c_id" : c_id, "course.teacher" : t_id})
	user = db.results.aggregate([ {"$match" : {"course.teacher" : t_id }}, {"$project" : {"USN" :1, "course" : {"$filter" : { "input" : "$course", "as": "course", "cond" :{"$and":[ {"$eq" : ["$$course.teacher",t_id]}, {"$eq" :["$$course.c_id",c_id]}] }} }}} ])
	#if(user is not None):
	print(user)
	for i in user:
		print(i['course'])
	return jsonify({'code':400})
"""

def getEnteredMarks(c_id, type_a):  #api 2
	t_id = request.args.get('t_id')
	#db.find({"course.c_id" : c_id, "course.teacher" : t_id})
	#{ "course": { "$elemMatch": { "c_id": c_id, "teacher": t_id } } }
	user = db.results.find({ "course": { "$elemMatch": { "c_id": c_id, "teacher": t_id } } })
	#if(user is not None):
	l=[]
	print(user)
	for i in user:
		print(i['course'])
		for j in i['course']:
			if(j['c_id'] == c_id and j['teacher'] == t_id):
				print("seemme")
				if(type_a in j.keys()):
					l.append({"USN":i['USN'],type_a : j[type_a]})
	data = {"u":l}
	data = jsonify(data)
	print(data)
	return data

@app.route('/PES/sem/<sem>/course/type', methods = ['GET'])
def getStudentMarks(sem): 
	

	l=[]
	USN = request.args.get('USN')
	user = db.results.find_one({"USN" : USN})
	print(type(sem))
	r = requests.get("http://127.0.0.1:8000/sem/"+sem+"/courses?USN="+USN)
	r = json.loads(r.text)
	dic = []
	cou=r["courses"]
	for i in cou:
		dic.append(i['c_id'])
	print(dic)
	if(user is not None):
		courses = user['course']
		for j in dic:
			for i in courses:
				if(i['c_id'] == j):
					print("inside")
					d = i
					#del d['sem']
					del d['teacher']
					l.append(d)
		return jsonify({"u" : l})
	else:
		return "None"


@app.route('/PES/course/<c_id>/type/<type_a>', methods = ['GET'])
def getMarks(c_id, type_a):
	USN = request.args.get('USN')
	t_id = request.args.get('t_id')
	data = ""
	if(t_id is not None):
		data = getEnteredMarks(c_id, type_a)
	
	return data




"""def enterToTeach(t_id,USN,c_id,type_a,marks):
	data = {}
	data['t_id'] = USN
	cou = {}
	cou['c_id'] = c_id
	cou[type_a] = marks
	l.append(cou)
	data['course'] = l
	json_data = json.dumps(data)
	value = json.loads(json_data)
	user = db.teach.find_one({"t_id" : t_id})
	print(user is None)
	if (user is None):
		db.results.insert(value)

"""

@app.route('/PES/course/<c_id>/type/<type_a>', methods = ['POST'])
def uploadMarks(c_id, type_a):   #api 1
	print(type_a)
	t_id = request.args.get('t_id')
	print(t_id)
	j = request.get_json()
	print(j)
	r = requests.get("http://127.0.0.1:8000/sem/courses/"+c_id)
	r = json.loads(r.text)
	u = j['u']
	print("THERE?",u)
	
	final = []
	for i in u:
		l=[]
		USN = i['USN']
		r1 = requests.get("http://127.0.0.1:8000/students/"+USN)
		r1 = json.loads(r1.text)
		sem = r1["cur_sem"]     #get this from api
		marks = i['marks']
		data = {}
		#print(data)
		#data['batch'] = batch
		#data['session'] = session

		data['USN'] = USN
		cou = {}
		cou['c_id'] = c_id
		cou[type_a] = marks
		cou['teacher'] = t_id
		#cou['sem'] = sem
		l.append(cou)
		data['course'] = l
		data['cur_sem'] = sem
		json_data = json.dumps(data)
		value = json.loads(json_data)
		print(json_data)
		user = db.results.find_one({"USN" : USN})
		print(user is None)
		if (user is None):
			db.results.insert(value)
		else:
			u = db.results.find_one({"USN" : USN, "course.c_id" : c_id})
			if( u is None): #change the sem everytime u add a new course
				print("here")
				db.results.update({"USN" : USN} , { "$push" :{"course" : {"c_id":c_id, type_a : marks, 'teacher' : t_id} }, "$set":{"cur_sem" : sem }})
			else:
				st = "course.$."+type_a
				db.results.update({"USN" : USN, "course.c_id" : c_id}, {"$set":{st : marks }}, upsert=True )
		
		#enterToTeach(t_id,USN,c_id,type_a,marks)

		
		
	return jsonify({'code':400})

@app.route('/PES/course/<c_id>/policy', methods = ['GET'])
def getPolicy(c_id):
	t_id = request.args.get('t_id')
	user = db.policy.find_one({"course" : c_id})
	if(user is not None):
		policy = user
		del policy['_id']
		del policy['course']
		print(policy)
		return jsonify({c_id:policy})
	else:
		return "None"	
	


@app.route('/PES/course/<c_id>/policy', methods = ['PUT'])
def uploadPolicy(c_id):   
	t_id = request.args.get('t_id')
	print(t_id)
	j = request.get_json()
	j = dict(j)
	j["course"] = c_id
	j["Approved"] = 0

	#j = jsonify(j)
	print(j)
	user = db.policy.find_one({"course" : c_id})
	if(user is None):
		db.policy.insert(j)
	else:
		db.policy.replace_one({ "course" : c_id },j);

	return "hello"


@app.route('/upload.html',methods = ['POST'])
def upload_route_summary():
	if request.method == 'POST':
		cid = request.form["course"]
		print(cid)
        # Create variable for uploaded file
		f = request.files['inter']
		print(f)  
		fstring = f.read()
		fstring=fstring.decode("utf-8")
		#print(f)
		csv_dicts = [{k: v for k, v in row.items()} for row in csv.DictReader(fstring.splitlines(), skipinitialspace=True)]
		"""for row in csv.DictReader(fstring):
			print(row)
"""
		print(csv_dicts)
		pol = {}
		pol["internals"] = {}
		for i in csv_dicts:
			pol["internals"][i["internals Type"]] = i["iMarks"]
		print(pol)

		f = request.files['exter']
		print(f)  
		fstring = f.read()
		fstring=fstring.decode("utf-8")
		#print(f)
		csv_dicts = [{k: v for k, v in row.items()} for row in csv.DictReader(fstring.splitlines(), skipinitialspace=True)]
		"""for row in csv.DictReader(fstring):
			print(row)
"""
		print(csv_dicts)
		pol["externals"] = {}
		pol["timestamp"] = time.time()
		for i in csv_dicts:
			pol["externals"][i["externals Type"]] = i["eMarks"]
		print(pol)
		pol = (json.dumps(pol))
		print(pol)
		url = 'http://127.0.0.1:5000/PES/course/'+cid+'/policy?t_id=PCS181'
		headers = {'Content-type': 'application/json'}
		response = requests.put(url, data=pol, headers=headers)
		
		return (redirect('../Teacher/upload_policy.html'))



@app.route('/PES/course/<c_id>/policy', methods = ['PUT'])
def approvePolicy(c_id):   
	db.policy.update({"course" : c_id}, {"$set":{"Approved" : 1 }} )
	# also must send a notification to the anchor teacher
    # so must make sure only anchor teacher gets to upload a policy
    
	return "Done"

@app.route('/PES/course/<c_id>/policy', methods = ['DELETE'])
def delPolicy(c_id):   
	db.policy.delete_one({"course" : c_id} )
	# send a notification when dismissed (along with a comment) 
	return "Done"

@app.route('/PES/course/policy', methods = ['GET'])
def getPolicies():
	t_id = request.args.get('t_id')
	user = db.policy.find()
	pol = {}
	if(user is not None):
		for i in user:
			j = i
			del j['_id']
			cid = j['course']
			del j['course']
			pol[cid] = j
		print(pol)
		return (jsonify(pol))
	else:
		return "None"
		#print(policy[0])
		
		"""return jsonify({"p":policy})
	else:
		return "None"
	if(user is not None):
		policy = user
		del policy['_id']
		del policy['course']
		print(policy)
		return jsonify({c_id:policy})
	else:
		return "None"
	"""
	return "Done"

@app.route('/PES/course/<c_id>/types', methods = ['GET'])
def typesInCourse(c_id):  
	user = db.policy.find_one({"course" : c_id})
	if(user is not None):
		k=[]
		internals = user["internals"]
		#internals = dict(internals)
		ki=[]
		key = internals.keys()
		ki.extend(key)
		print(ki)
		externals = user["externals"]
		ke = []
		key = externals.keys()
		ke.extend(key)
		print(ke)
		ki.extend(ke)
		return (json.dumps({"types":ki}))
	else:
		return "None"





@app.route('/PES/sem/<sem>/course/ESA', methods = ['GET'])
def getResult(sem): 
	USN = request.args.get('USN')
	l=[]
	flag =0
	r = requests.get("http://127.0.0.1:8000/sem/"+sem+"/courses?USN="+USN)
	r = json.loads(r.text)
	dic = {}
	cou=r["courses"]
	for i in cou:
		dic[i['c_id']] = i['credits']
	print(dic)
	
	courses = dic
	user = db.results.find_one({"USN" : USN})
	tot_cred = sum(courses.values())
	print(tot_cred)
	sgpa = 0
	if(user is not None):
		for i in courses.keys():
			print(i)
			typ = json.loads(typesInCourse(i))["types"]
			print(typ)
			for u in user['course']:
				s = 0
				if(u['c_id'] == i):
					print("matched")
					for p in typ:
						if(p not in u.keys()):
							flag = 1           #marks for that assessment is unavailable
						else:
							s+=u[p]
					break
			
			course_credits = courses[i]
			if(s!=0):
				if(s>=90):
					g = "S"
					gp = 10
				elif(s>=80 and s<90):
					g = "A"
					gp = 9
				elif(s>=70 and s<80):
					g = "B"
					gp = 8
				elif(s>=60 and s<70):
					g = "C"
					gp = 7
				elif(s>=50 and s<60):
					g = "D"
					gp = 6
				elif(s>=40 and s<50):
					g = "E"
					gp = 5
				else:
					g = "F"
					gp = 0
				sgpa +=gp*course_credits
				print(sgpa)
				l.append({i:g})

		print(l)
		return (jsonify({"res":l, "SGPA" : sgpa/tot_cred}))
	#return "Done"
	else:
		return "None"


	

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

