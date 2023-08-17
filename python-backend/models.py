from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True) #get the columns and the type for each col
    task_title = db.Column(db.String(64), nullable = False)#must have a title
    description = db.Column(db.String(255))
    due_date = db.Column(db.String(20))
    completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'task_title': self.task_title,
            'description': self.description,
            'due_date': self.due_date,
            'completed': self.completed
        }

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    
    username = db.Column(db.String(20), nullable = False)
    password = db.Column(db.String(128))