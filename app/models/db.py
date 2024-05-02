from app import db
import datetime

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))

    def __repr__(self):
        return '<User %r>' % self.username
    
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    score = db.Column(db.Integer)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return '<Score %r>' % self.score