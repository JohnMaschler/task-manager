from flask import Flask, jsonify, request
from models import db, Task, User

app = Flask(__name__)#create flask app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'

db.init_app(app)#initialize the database

@app.route('/tasks')#route to get all tasks from database
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])#convert to list of dictionaries and jsonify it


@app.route('/tasks', methods=['POST'])#route to create new task in database
def create_task():
    data = request.get_json()
    task_title = data['task_title']#get task information from data
    description = data.get('description', '')
    due_date = data.get('due_date', None)
    #create a new task instance
    task = Task(task_title=task_title, description=description, due_date=due_date)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201#return as JSON response


@app.route('/tasks/<int:task_id>', methods = ['PUT'])#route to update a task in the db
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get_or_404(task_id)#retrieve task with specified id from db
    task.task_title = data['task_title']#update all of the information
    task.description = data.get('description', '')
    task.due_date = data.get('due_date', None)
    db.session.commit()#commit changes
    return jsonify(task.to_dict())#return task as json reponse

@app.route('/tasks/<int:task_id>', methods = ['DELETE'])#route to delete task
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)#delete and commit changes
    db.session.delete(task)
    db.session.commit()
    return '', 204#return empty response


@app.route('/test')
def test():
    return 'This is a test message - it worked'


if __name__ == '__main__':
    with app.app_context():#create the db tables and run app
        db.create_all()
    app.run(debug=True)