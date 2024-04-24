from flask import render_template, request, redirect, url_for, abort, session
from app import app, db
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.db import Users, Scores


def setup_routes(app):
    @app.route('/')
    def home():
        if 'username' in session:
            return render_template('home.html', username=session['username'])
        return render_template('home.html')
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        error = {"username": None, "password": None}
        if request.method == 'POST':
            user = Users.query.filter_by(username=request.form['username']).first()
            if check_form_empty(request.form['username'], request.form['password']):
                error["username"] = "Username and password cannot be empty"
                return render_template('login.html', error=error)
                
            if validate_user(request.form['username'], request.form['password']):
                session['username'] = request.form['username']
                return redirect(url_for('home'))
            else:
                error["username"] = "Invalid username or password"
        
        return render_template('login.html', error=error)
    
    @app.route('/logout')
    def logout():
        session.pop('username', None)
        return redirect(url_for('home'))
    
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        error = {"username": None, "password": None}
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            if check_form_empty(username, password):
                error["username"] = "Username and password cannot be empty"
                return render_template('register.html', error=error)
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
            user = Users(username=username, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('login'))
        return render_template('register.html', error=error)
    
def check_form_empty(username, password):
    if username == "" or password == "":
        return True
    return False


def validate_user(username, password):
    user = Users.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        return True
    return False
        
