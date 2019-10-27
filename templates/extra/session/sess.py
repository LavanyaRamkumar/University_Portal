from flask import *  
import random, os
app = Flask(__name__)  
app.secret_key = "abc"  
 
@app.route('/')  
def home():  
    res = make_response("<h4>session variable is set, <a href='/get'>Get Variable</a></h4>")  
    session['response']='session#1'  
    return res;  
 
@app.route('/get')  
def getVariable():  
    if 'response' in session:  
        s = session['response'];  
        return render_template('getsession.html',name = s)  
  
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 7000))
    app.run(debug=True, host='0.0.0.0', port=port)  