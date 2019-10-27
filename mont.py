import random, os, json, datetime, time ,string
from flask import *
import hashlib
from pymongo import *
import string 
import datetime
import re
from flask_cors import *
import csv
import requests 
import time
import smtplib 

app = Flask(__name__)
cors = CORS(app)
uri = "uri"
client = MongoClient(uri)
#client = MongoClient(port=27017)
db = client.pes3
app.secret_key = 'key'

@app.route("/teacher")
def index():
	return (render_template("teacher1/menu.html"))

@app.route("/upload_marks")
def upload_marks():
	return (render_template("teacher1/upload_marks.html"))

@app.route("/get_marks")
def get_marks():
	return (render_template("teacher1/get_marks.html"))

@app.route("/get_policy")
def get_policy():
	return (render_template("teacher1/get_policy.html"))

@app.route("/upload_policy")
def upload_policy():
	return (render_template("teacher1/upload_policy.html"))

@app.route("/approve_policy")
def approve_policy():
	return (render_template("teacher1/approve_policy.html"))

@app.route("/student")
def index1():
	return (render_template("student1/menu.html"))

@app.route("/get_internals")
def get_internals():
	return (render_template("student1/get_internals.html"))

@app.route("/get_results")
def get_results():
	r = requests.get("http://127.0.0.1:5000/PES/grading")
	r = (r.text)
	if(r == "GPA"):
		param = "GRADE"
	else:
		param = "PERCENTAGE"
	return (render_template("student1/get_results.html", data = param))


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
					l.append({"USN":i['USN'],"name" : i["name"],type_a : j[type_a]})
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
					del d['veri']
					l.append(d)
		return jsonify({"u" : l})
	else:
		return "None"


@app.route('/PES/course/<c_id>/type/<type_a>', methods = ['GET'])
def getMarks(c_id, type_a):
	USN = request.args.get('USN')
	t_id = request.args.get('t_id')
	#name = 
	data = ""
	if(t_id is not None):
		data = getEnteredMarks(c_id, type_a)
	
	return data

@app.route('/check_res/<USN>')
def check_res(USN):
	user = db.results.find_one({"USN" : USN})
	print(user["course"])
	c = user["course"]
	flag = 0
	for i in c:
		c_id = i["c_id"]
		r = requests.get("http://127.0.0.1:5000/PES/course/"+c_id+"/types")
		r = json.loads(r.text)
		keys = i.keys()
		types = r["types"]
		for j in types:
			if(j not in keys):
				flag = 1
		if(flag == 1):
			break;
	if(flag == 1):
		return "0"
	else:
		return "1"






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
		veri = i["veri"]
		name = i["name"]
		data = {}
		#print(data)
		#data['batch'] = batch
		#data['session'] = session

		data['USN'] = USN
		data["name"] = name
		cou = {}
		cou['c_id'] = c_id
		cou[type_a] = marks
		#cou["name"] = i["name"];
		cou["veri"] = i["veri"];
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
				db.results.update({"USN" : USN, "name" : name} , { "$push" :{"course" : {"c_id":c_id, type_a : marks, 'teacher' : t_id, 'veri' : veri} }, "$set":{"cur_sem" : sem }})
			else:
				st = "course.$."+type_a

				db.results.update({"USN" : USN, "course.c_id" : c_id}, {"$set":{st : marks,"course.$.veri":veri }}, upsert=True )
		
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
	j["t_id"] = t_id

	print(j)
	user = db.policy.find_one({"course" : c_id})
	if(user is None):
		db.policy.insert(j)
	else:
		db.policy.replace_one({ "course" : c_id },j);
	f = requests.get("http://127.0.0.1:8000/dept")
	f = json.loads(f.text)
	hod = ""
	for i in f:
		if(f["dept"] == "Computer Science"):
			hod = f["HOD"]
			break
	r = requests.get("http://127.0.0.1:8000/teacher/"+hod)
	r = json.loads(r.text)
	email = r["email"]
	message = "Request for approval of policy for "+c_id
	# send a notification when dismissed(along with a comment) 
	mail(email,message)

	return "hello"


@app.route('/upload.html',methods = ['POST', 'GET'])
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
		iMark =0
		print(csv_dicts)
		for i in csv_dicts:
			iMark+=int(i["iMarks"])
		#print("sum",iMark)
		pol = {}
		pol["internals"] = {}
		print("\n",csv_dicts,"\n")
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
		pol["timestamp"] = int(time.time()*1000)
		eMark=0
		for i in csv_dicts:
			eMark+=int(i["eMarks"])
		totSum = eMark+iMark
		print("tot",totSum)
		if (totSum != 100):
			return (render_template("teacher1/upload_policy.html",data = "Not 100! Modify and Reupload"))
			#return (render_template(,status = "Not 100")
		for i in csv_dicts:
			pol["externals"][i["externals Type"]] = i["eMarks"]
		print(pol)
		print("heyy")
		pol = (json.dumps(pol))
		print(pol)
		print("down there")
		url = 'http://127.0.0.1:5000/PES/course/'+cid+'/policy?t_id=PCS181'
		headers = {'Content-type': 'application/json'}
		response = requests.put(url, data=pol, headers=headers)
		
		#return app.send_static_file('upload_policy.html')
		#return (redirect("file:///home/lavanya/Documents/WISE/Results/menu_r/Teacher/upload_policy.html"))
		#return "success"
		return (render_template("teacher1/upload_policy.html",data = "done"))


@app.route('/PES/course/<c_id>/policy', methods = ['POST'])
def approvePolicy(c_id):   
	db.policy.update({"course" : c_id}, {"$set":{"Approved" : 1 }} )
	# also must send a notification to the anchor teacher
    # so must make sure only anchor teacher gets to upload a policy
	user = db.policy.find_one({"course" : c_id})
	t_id = user["t_id"]
	#db.policy.delete_one({"course" : c_id})
	f = requests.get("http://127.0.0.1:8000/teacher/"+t_id)
	print("\n",f.text,"\n")
	f = json.loads(f.text)
	email = f["email"]
	message = "Your policy for "+c_id+" has been approved."
	# send a notification when dismissed(along with a comment) 
	mail(email,message)
	return "Done"

def mail(email,message):
	"""s = smtplib.SMTP('smtp.gmail.com', 587) 
	s.starttls() 
	s.login("assessments.pes@gmail.com", "assess123") 
	#message = "Heyy lava here"
	s.sendmail("assessments.pes@gmail.com",email, message) 
	s.quit()"""
	

@app.route('/PES/course/<c_id>/policy', methods = ['DELETE'])
def delPolicy(c_id):   
	user = db.policy.find_one({"course" : c_id})
	t_id = user["t_id"]
	db.policy.delete_one({"course" : c_id})
	f = requests.get("http://127.0.0.1:8000/teacher/"+t_id)
	f = json.loads(f.text)
	email = f["email"]
	message = "Your policy for "+c_id+" has been dismissed. Upload a different policy"
	# send a notification when dismissed(along with a comment) 
	mail(email,message)
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

@app.route('/PES1/course/<c_id>/types', methods = ['GET'])
def typesMarks(c_id):  
	user = db.policy.find_one({"course" : c_id})
	if(user is not None):
		del user["_id"]
		print(user)
		return (json.dumps(user))
	else:
		return "None"



@app.route('/PES/sem/<sem>/course/ESA', methods = ['GET'])
def getResult(sem):
		USN = request.args.get('USN') 
		r1 = requests.get("http://127.0.0.1:5000/check_res/"+USN)
		r1 = r1.text
		if(r1 == "0"):
			print("NoneinESA")
			return "None"
		else:
			print("inside")
			f = requests.get("http://127.0.0.1:5000/PES/grading")
			f = f.text
			
			l=[]
			h = []
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
			per = 0
			le = len(user)
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
									s+=int(u[p])
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
						h.append({i:str(s)})
						per += s
						print(sgpa)
						l.append({i:g})

				print(l)
				if (f == "GPA"):
					return (jsonify({"res":l, "Total" : sgpa/tot_cred}))
				else:
					return (jsonify({"res":h, "Total":per/le }))
			#return "Done"
			else:
				return "None"
	


@app.route('/PES/policy', methods = ['PUT'])
def uploadDefault():   
	#t_id = request.args.get('t_id')
	#print(t_id)
	j = request.get_json()
	j = dict(j)
	#j["course"] = c_id
	#j["Approved"] = 0

	#j = jsonify(j)
	
	db.admin_policy.insert(j)
	

	return "hello"

@app.route("/PES/auto_approval", methods=['POST'])
def auto_approval():
	stand = db.admin_policy.find()
	pol = db.policy.find()
	stand1 = []
	for i in stand:
		stand1.append(i)
	for i in pol:
		for j in stand1:
			if(i["Approved"] == 0 and i["internals"] == j["internals"] and i["externals"] == j["externals"]):
				c_id = i["course"]
				#db.policy.update({"course" : c_id}, {"$set":{"Approved" : 1 }} )
				#print("\n",c_id,"\n")
				#approvePolicy(c_id)
				f = requests.post("http://127.0.0.1:5000/PES/course/"+c_id+"/policy")
	return "done"




@app.route("/PES/upload_default", methods=['POST'])   #AUTOMATICALLY APPROVE IN APPROVE-POLICY PAGE BEFORE DISPLAYING
def upload_route_summary1():
	if request.method == 'POST':
		#cid = request.form["course"]
		#print(cid)
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
		pol["timestamp"] = int(time.time()*1000)
		for i in csv_dicts:
			pol["externals"][i["externals Type"]] = i["eMarks"]
		print(pol)
		pol = (json.dumps(pol))
		print(pol)
		url = 'http://127.0.0.1:5000/PES/policy'
		headers = {'Content-type': 'application/json'}
		response = requests.put(url, data=pol, headers=headers)
		
		#return app.send_static_file('upload_policy.html')
		#return (redirect("file:///home/lavanya/Documents/WISE/Results/menu_r/Teacher/upload_policy.html"))
		return redirect(url_for("upload_default"))

@app.route("/PES/getDefault", methods=['GET'])
def getDefault():

	u={}
	user = db.admin_policy.find()
	#print(json.dumps(user))
	c=0;
	for i in user:
		del i["_id"]
		u[str(c)] = i
		c+=1
	print(len(u))
	return(json.dumps(u))



@app.route("/upload_default", methods=['GET'])
def upload_default():
	return (render_template("admin1/upload_default.html"))

@app.route("/get_default", methods=['GET'])
def get_default():
	
	return (render_template("admin1/get_default.html"))

@app.route("/pol", methods=['GET'])
def pol():
	
	return (render_template("student1/pol.html"))

@app.route("/PES/grading/<g>", methods=['POST']) #grading table
def upload_grading(g):
	x = db.gScheme.delete_many({})
	if g == "percentage":
		db.gScheme.insert({"g":"percentage"})
	else:
		db.gScheme.insert({"g":"GPA"})
	
	return (render_template("admin1/set_grading.html",data = "Set to "+g))


@app.route("/PES/grading", methods=['GET']) #grading table
def get_grading():
	u = db.gScheme.find_one()
	print(u)
	return u['g']

@app.route("/set_grading", methods=['GET'])
def set_grading():
	return (render_template("admin1/set_grading.html"))


@app.route("/admin", methods=['GET'])
def index3():
	return (render_template("admin1/menu.html"))

@app.route("/hod", methods=['GET'])
def index4():
	return (render_template("hod/menu.html"))

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

