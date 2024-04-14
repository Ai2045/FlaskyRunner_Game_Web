from flask import render_template, request, redirect, url_for, abort, session
from app import app, db

from app.models.db import Users, Scores


def setup_routes(app):
    @app.route('/')
    def index():
        if 'username' in session:
            return render_template('index.html', username=session['username'])
        return render_template('index.html')
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            print(request.form)
            username = request.form['username']
            password = request.form['password']
            user = Users.query.filter_by(username=username).first()
            print(user)
            print(user.username)
            if user is not None and password == user.password:
                session['username'] = user.username
                return redirect(url_for('index'))
            else:
                return abort(401)
        return render_template('login.html')
    
        
