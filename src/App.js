import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8000/api/tasks/')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const addTask = () => {
    if (!title) return;
  
    const apiCall = editingTaskId 
      ? axios.patch(`http://localhost:8000/api/tasks/update/${editingTaskId}/`, { task: title, description }) 
      : axios.post('http://localhost:8000/api/tasks/add/', { task: title, description });
  
    apiCall.then(() => {
      setTitle('');
      setDescription('');
      setEditingTaskId(null); // Reset editing state
      fetchTasks(); // Refresh the task list
    }).catch(error => {
      console.error('Error adding/updating task:', error);
    });
  };
  
  const updateTask = (task) => {
    console.log(task.id )
    setTitle(task.task); // Set the title for editing
    setDescription(task.description); // Set the description for editing
    setEditingTaskId(task.id); // Set the currently editing task ID
  };
  
  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:8000/api/tasks/delete/${taskId}/`)
      .then(() => {
        setTitle('');
        setDescription('');
        fetchTasks(); // Refresh the task list after deletion
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <div className="App">
      <center>
        <h2>To-Do List</h2>
        <input
          className="input-text"
          type="text"
          placeholder="Add task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          className="text-area"
          placeholder="Add description if any.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <input className="add-button" type="button" value={editingTaskId ? "Update" : "Add"} onClick={addTask} />
        <div className="tasks">
          {tasks.map((task) => (
            <div key={task.id}>
              <h3>{task.task}</h3>
              <p>{task.description}</p>
              <input className="delete-btn" type="button" value="Delete" onClick={() => deleteTask(task.id)} />
              <input className="edit-btn" type="button" value="Edit" onClick={() => updateTask(task)}/>
            </div>
          ))}
        </div>
      </center>
    </div>
  );
}

export default App;
