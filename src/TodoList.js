import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('Low'); // Priority State
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const taskProgress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  // Handle adding a new task
  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, priority, completed: false }]);
      setTask('');
      setPriority('Low');
    }
  };

  // Handle delete task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Handle toggle task completion (checkbox functionality)
  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Handle drag-and-drop functionality for reordering tasks
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  // Filter tasks based on the selected filter (all, completed, pending)
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .filter((task) => task.text.toLowerCase().includes(searchTerm.toLowerCase()));

  // Function to return background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'rgba(255, 99, 71, 0.7)'; // Red
      case 'Medium':
        return 'rgba(255, 223, 0, 0.7)'; // Yellow
      case 'Low':
        return 'rgba(144, 238, 144, 0.7)'; // Green
      default:
        return 'white';
    }
  };

  return (
    <div className={`todo-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>To-Do List</h1>

      {/* Dark Mode Toggle */}
      <label className="dark-mode-toggle">
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        Dark Mode
      </label>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${taskProgress}%` }}></div>
      </div>

      {/* Task Input */}
      <div className="todo-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />

        {/* Priority Dropdown */}
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      {/* Task Filter */}
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>

      {/* Task Search */}
      <div className="todo-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Task List with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTasks.map((task, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided) => (
                    <li
                      className={`task-item ${task.completed ? 'completed' : ''}`}
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* Checkbox to toggle completion */}
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(index)}
                      />

                      <span className="task-text">
                        {task.text} - <strong>{task.priority} Priority</strong>
                      </span>

                      <button onClick={() => deleteTask(index)}>Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Conditional Rendering: No tasks */}
      {tasks.length === 0 && <p>No tasks added yet.</p>}
    </div>
  );
};

export default TodoList;
