from flask import render_template, request, redirect, url_for, abort, session, jsonify
from app import app, db
from werkzeug.security import generate_password_hash, check_password_hash
import time
from app.models.db import Users, Scores


def setup_routes(app):
    @app.route('/')
    def home():
        if 'username' in session:
            return render_template('home.html', username=session['username'])
        return render_template('home.html', username=None)
    
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
                print(session['username'])
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
            if Users.query.filter_by(username=username).first():
                error["username"] = "Username already exists"
                return render_template('register.html', error=error)
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
            user = Users(username=username, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('login'))
        return render_template('register.html', error=error)
    @app.route('/play_game')
    def play_game():
            if 'username' in session:
                username = session['username']
                print(username)
                return render_template('game.html', username=username)
            message = "Please login to play the game"
            return render_template('login.html', message=message)
    
    @app.route('/play_guest')
    def play_guest():
        guest_id = 'guest_' + str(time.time()) # Create a unique ID for each guest
        session['username'] = guest_id
        return render_template('game.html', username=guest_id)
    
    @app.route('/get_user_name', methods=['GET'])
    def get_user_name():
        if 'username' in session:
            return session['username']
        abort(404)

    @app.route('/get_highest_score', methods=['GET'])
    def get_highest_score():
        print(session['username'])
        if 'username' in session:
            username = session['username']
            
            user_id = Users.query.filter_by(username=username).first().id
            highest_score = Scores.query.filter_by(user_id=user_id).order_by(Scores.score.desc()).first()
            print(highest_score.score)
            if highest_score is None:
                highest_score = 0
            return jsonify({"highest_score": highest_score.score})
        abort(404)

    @app.route('/save_score', methods=['POST'])
    def save_score():
        json_data = request.get_json()  # <-- Aggiungi questa linea
        #check if user is guest
        if session['username'].startswith('guest_'):
            return "Cannot save score for guest user"
        elif 'username' in session:
            score = json_data['score']
            user_id = Users.query.filter_by(username=session['username']).first().id
            saved_score = Scores(user_id=user_id, score=score)
            db.session.add(saved_score)
            db.session.commit()
            return "Score saved"
        abort(404)

    @app.route('/get_ranking_list', methods=['GET'])
    def get_ranking_list():
        user_high_scores = []
        for user in Users.query.all():
            username = user.username
            user_id = Users.query.filter_by(username=username).first().id
            
            highest_score = Scores.query.filter_by(user_id=user_id).order_by(Scores.score.desc()).first()
            if highest_score is not None:
                user_high_scores.append({"username": username, "score": highest_score.score})
        return jsonify(user_high_scores)
        abort(404)

def check_form_empty(username, password):
    if username == "" or password == "":
        return True
    return False


def validate_user(username, password):
    user = Users.query.filter_by(username=username).first()
    print(user.password, password)
    print(check_password_hash(user.password, password))
    if user and check_password_hash(user.password, password):
        return True
    return False

        
