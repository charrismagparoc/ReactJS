import React, { useState, useEffect } from 'react';
import './ToDoList.css';

function ToDoList({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // 'all' filter
  });

  // Add a new task
  const addTask = () => {
    if (inputText.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputText,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setInputText('');
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle task completion status
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Start editing a task
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edited task
  const saveEdit = () => {
    if (editText.trim() !== '') {
      setTasks(tasks.map(task => 
        task.id === editingId ? { ...task, text: editText } : task
      ));
      setEditingId(null);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Handle Enter key in input fields
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        addTask();
      } else if (action === 'edit') {
        saveEdit();
      }
    }
  };

  return (
    <div className="todo-container">
      <div className="add-task">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'add')}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              {editingId === task.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    autoFocus
                  />
                  <div className="edit-buttons">
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                    />
                    <span className="task-text">{task.text}</span>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => startEdit(task.id, task.text)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li className="empty-message">
            {filter === 'all' 
              ? 'No tasks yet. Add some!' 
              : filter === 'completed' 
                ? 'No completed tasks yet.'
                : 'No pending tasks.'}
          </li>
        )}
      </ul>
    </div>
  );
}

export default ToDoList;