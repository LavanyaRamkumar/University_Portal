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

@app.route("/login",methods = ['GET'])
def loo():
	return "ha"

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 6000))
    app.run(debug=True, port=port)