import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {//state variables for managing form inputs and tasks
  const [tasks, setTasks] = useState([]);//array to store tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCompletionStatus, setNewTaskCompletionStatus] = useState('incomplete');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedDueDate, setUpdatedDueDate] = useState('');
  //const [updatedCompletionStatus, setUpdatedCompletionStatus] = useState('');


  useEffect(() => { //fetch tasks from server on component mount
    fetchTasks();
  }, []);

  function fetchTasks() { //function that fetches tasks from the server
    axios.get('/tasks')
      .then(response => {
        console.log('tasks:', response.data);
        setTasks(response.data);//updates the tasks state
      });
  }
  

  function handleCreateTask(event) {//function to handle task creation
    event.preventDefault();
    axios.post('/tasks', { //make post request to create new task
      task_title: newTaskTitle,
      description: newTaskDescription,
      due_date: newTaskDueDate,
      completion_status: newTaskCompletionStatus
    })
      .then(() => { //after it's created, clear the input fields
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
        setNewTaskCompletionStatus('incomplete');
        fetchTasks();
      });
  }

  function handleUpdateTask(taskId){
    const data = {
      task_title: updatedTaskTitle,
      description: updatedDescription,
      due_date: updatedDueDate,
      //completion_status: updatedCompletionStatus,
    };
    axios.put(`/tasks/${taskId}`, data)
      .then(response => {// handle successful response
        console.log(response.data);
        fetchTasks(); // fetch updated list of tasks
        setEditingTaskId(null); // reset editing state
      })
      .catch(error => {// handle error
        console.error(error);
      });
  }
  
  function handleEditClick(taskId) { 
    const task = tasks.find(task => task.id === taskId);// find task by id
    setEditingTaskId(taskId);
    setUpdatedTaskTitle(task.task_title);// pre-populate input fields with current values
    setUpdatedDescription(task.description);
    setUpdatedDueDate(task.due_date);
  }

  function handleCancelClick() {// reset editing state
    setEditingTaskId(null);
  }

  function handleDeleteTask(taskId) {
    axios.delete(`/tasks/${taskId}`)
      .then(() => {
        fetchTasks();
      });
  }
  function handleCompletionStatusChange(taskId, event) {
    const value = event.target.value;    // Get the selected value

  
    
    const taskForm = document.querySelector(`#task-form-${taskId}`);// Get the task form element
  
    if (value === 'complete') { // Check if the selected value is "completed"
      taskForm.style.backgroundColor = 'lightgreen';//change it to green
    } else {
      taskForm.style.backgroundColor = '';//otherwise it's red
    }
  }
  
  



  return (
    <div className = "form-container">
      <form onSubmit={handleCreateTask}>{/* Form to create a new task */}
        <div>
          <label htmlFor="new-task-title">Title:</label>
          <input
            type="text"
            id="new-task-title"
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="new-task-description">Description:</label>
          <textarea
            id="new-task-description"
            value={newTaskDescription}
            onChange={(event) => setNewTaskDescription(event.target.value)}
            rows={5}
          />
        </div>

        <div>
          <label htmlFor="new-task-due-date">Due Date:</label>
          <input
            type="date"
            id="new-task-due-date"
            value={newTaskDueDate}
            onChange={(event) => setNewTaskDueDate(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="new-task-completion-status">Completion Status:</label>
          <select
            id="new-task-completion-status"
            value={newTaskCompletionStatus}
            onChange={(event) => setNewTaskCompletionStatus(event.target.value)}
          >
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
      {/* Display existing tasks */}
      <div className="tasks-container">
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              /* in edit mode - display input fields for updating task */
              <>
                <input type="text" value={updatedTaskTitle} onChange={event => setUpdatedTaskTitle(event.target.value)} />
                <input type="text" value={updatedDescription} onChange={event => setUpdatedDescription(event.target.value)} />
                <input type="text" value={updatedDueDate} onChange={event => setUpdatedDueDate(event.target.value)} />
                <button onClick={() => handleUpdateTask(task.id)}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </>
            ) : (
              <>
                <div id={`task-form-${task.id}`} className={`task ${task.completed ? 'complete' : 'incomplete'}`}>
                <h3>{task.task_title}</h3>
                <p>{task.description}</p>
                <p>Due Date: {task.due_date}</p>
                <select value={task.completion_status} onChange={(event) => handleCompletionStatusChange(task.id, event)} className="second-select">
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              <button onClick={() => handleEditClick(task.id)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default App;
