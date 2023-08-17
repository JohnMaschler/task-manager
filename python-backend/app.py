from flask import Flask, jsonify, request
from models import db, Task, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'

db.init_app(app)

@app.route('/tasks')
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    task_title = data['task_title']
    description = data.get('description', '')
    due_date = data.get('due_date', None)
    task = Task(task_title=task_title, description=description, due_date=due_date)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@app.route('/tasks/<int:task_id>', methods = ['PUT'])
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get_or_404(task_id)
    task.task_title = data['task_title']
    task.description = data.get('description', '')
    task.due_date = data.get('due_date', None)
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/tasks/<int:task_id>', methods = ['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204


@app.route('/test')
def test():
    return 'This is a test message - it worked'


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)