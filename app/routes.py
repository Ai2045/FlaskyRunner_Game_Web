from flask import render_template
from app import app, db

from app.models.db import Users, Scores

def setup_routes(app):
    @app.route('/')
    @app.route('/login')
    def login():
        return render_template('login.html')