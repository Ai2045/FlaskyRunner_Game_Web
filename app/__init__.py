from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = b'super secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///game.db'
db = SQLAlchemy(app)
socketio = SocketIO(app)

from app.routes import setup_routes
setup_routes(app)