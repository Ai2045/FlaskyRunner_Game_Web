from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = b'super secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///game.db'
db = SQLAlchemy(app)


from app.routes import setup_routes
setup_routes(app)