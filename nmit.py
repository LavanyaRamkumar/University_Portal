import random, os, json, datetime, time ,string
from flask import *
import hashlib
from pymongo import *
import string 
import datetime
#import request
import re
from flask_cors import *

app = Flask(__name__)
app.secret_key = 'lava'
cors = CORS(app)

@app.route("/")
def index():
  return "Welcome"


@app.route("/sem/courses/<c_id>", methods = ['GET'])
def cDetails(c_id):
  return (jsonify({ "c_id" : "UE16CS102", "c_name" : "Big Data", "c_anchor" : "es152", "credits" : 24, "sem" : 4  }))

@app.route("/sem/<sem>/courses", methods = ['GET'])
def getSCourses(sem): 
  return (jsonify({"courses":[{ "c_id" : "UE16CS102", "c_name" : "Big Data", "c_anchor" : "es152", "credits" : 24},{ "c_id" : "UE16CS103", "c_name" : "Cloud Computing", "c_anchor" : "es152", "credits" : 24}]}));

@app.route('/sem/courses', methods = ['GET'])
def getTCourses(): 
  return (jsonify({"courses":[{ "c_id" : "UE16CS102", "c_name" : "Big Data", "c_anchor" : "es152", "credits" : 24},{ "c_id" : "UE16CS103", "c_name" : "Cloud Computing", "c_anchor" : "es152", "credits" : 24}]}));

@app.route('/students', methods = ['GET'])
def getTeacherStudents():
  c_id=request.args.get("c_id")
  t_id=request.args.get("t_id")
  if(t_id==None):
    return (jsonify({"students":[{"USN" : "01FB16D888" , "s_name" : "Mike", "section" : "A", "dept" : "CS", "cur_sem"  : 4}, {"USN" : "01FB16D889" , "s_name" : "Michael", "section" : "A", "dept" : "CS", "cur_sem"  : 4}]}));

  return (jsonify({"students":[{"USN" : "01FB16D888" , "s_name" : "Mike", "section" : "A", "dept" : "CS", "cur_sem"  : 4}, {"USN" : "01FB16D889" , "s_name" : "Michael", "section" : "A", "dept" : "CS", "cur_sem"  : 4}]}));

@app.route('/teacher/<t_id>', methods = ['GET'])
def getTeacher(t_id):
  return (jsonify({"t_id" : "es778", "t_name" : "John", "t_designation" : "Associate Prof", "dept" : "CS", "email" : "lavanya.ramkumar99@gmail.com"}))

@app.route('/students/<USN>', methods = ['GET'])
def getStudent(USN):
  return (jsonify({"USN" : "01FB16D888" , "s_name" : "Mike", "section" : "A", "dept" : "CS", "cur_sem"  : 4}))

@app.route('/dept', methods = ['GET'])
def getDept():
  return (jsonify({"dept" : "Computer Science", "pref" : "CS", "HOD" : "es171"}))

@app.route('/courses/UE16CS102', methods = ['GET'])
def getCInfo1():
  return ("Big Data")

@app.route('/courses/UE16CS103', methods = ['GET'])
def getCInfo2():
  return ("Cloud Computing")

#@app.route("/students1")



"""@app.route('/', methods = ['GET'])
def index():
   if 'username' in session:
    username = session['username']
    return username
   else:
    return "login"

@app.route('/login', methods = ['POST'])
def login():
      
      session['username'] = request.form['username']
      return session['username']
   

@app.route('/logout')
def logout():
   # remove the username from the session if it is there
   session.pop('username', None)
   return redirect(url_for('index'))
"""
@app.route('/cookie', methods = ['POST','GET'])
def cookie():
    res = make_response("Setting a cookie")
    res.set_cookie('foo', 'bar', max_age=60*60*24*365*2, path="/")
    return res

"""@app.route('/getcookie')
def getcookie():
   name = request.cookies.get('userID')
   return '<h1>welcome '+name+'</h1>'
"""
if (__name__ == "__main__"):
  port = int(os.environ.get('PORT', 8000))
  app.run(debug=True, host='0.0.0.0', port=port)
