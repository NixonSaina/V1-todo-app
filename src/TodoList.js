import React, { useState } from 'react';
import './TodoList.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('Low');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const taskProgress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, dueDate, priority, completed: false }]);
      setTask('');
      setDueDate('');
      setPriority('Low');
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .filter((task) => task.text.toLowerCase().includes(searchTerm.toLowerCase()));

  const highPriorityTasks = filteredTasks.filter(task => task.priority === 'High');
  const mediumPriorityTasks = filteredTasks.filter(task => task.priority === 'Medium');
  const lowPriorityTasks = filteredTasks.filter(task => task.priority === 'Low');

  const isPastDue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && !tasks.completed;
  };

  return (
    <div className={`todo-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>To-Do List</h1>

      <label className="dark-mode-toggle">
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        Dark Mode
      </label>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${taskProgress}%` }}></div>
        <span className="progress-percentage">{Math.round(taskProgress)}%</span>
      </div>

      <div className="todo-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>

      <div className="todo-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="task-columns">
        <div className="task-column high-priority">
          <h2>High Priority</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="highTasks">
              {(provided) => (
                <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                  {highPriorityTasks.map((task, index) => (
                    <Draggable key={task.text} draggableId={`high-${index}`} index={index}>
                      {(provided) => (
                        <li
                          className={`task-item ${task.completed ? 'completed' : ''} ${isPastDue(task.dueDate) ? 'past-due' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(tasks.findIndex(t => t.text === task.text))}
                          />
                          <span className="task-text">{task.text} {task.dueDate && `(${task.dueDate})`}</span>
                          <button onClick={() => deleteTask(tasks.findIndex(t => t.text === task.text))}>Delete</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="task-column medium-priority">
          <h2>Medium Priority</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="mediumTasks">
              {(provided) => (
                <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                  {mediumPriorityTasks.map((task, index) => (
                    <Draggable key={task.text} draggableId={`medium-${index}`} index={index}>
                      {(provided) => (
                        <li
                          className={`task-item ${task.completed ? 'completed' : ''} ${isPastDue(task.dueDate) ? 'past-due' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(tasks.findIndex(t => t.text === task.text))}
                          />
                          <span className="task-text">{task.text} {task.dueDate && `(${task.dueDate})`}</span>
                          <button onClick={() => deleteTask(tasks.findIndex(t => t.text === task.text))}>Delete</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="task-column low-priority">
          <h2>Low Priority</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="lowTasks">
              {(provided) => (
                <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                  {lowPriorityTasks.map((task, index) => (
                    <Draggable key={task.text} draggableId={`low-${index}`} index={index}>
                      {(provided) => (
                        <li
                          className={`task-item ${task.completed ? 'completed' : ''} ${isPastDue(task.dueDate) ? 'past-due' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(tasks.findIndex(t => t.text === task.text))}
                          />
                          <span className="task-text">{task.text} {task.dueDate && `(${task.dueDate})`}</span>
                          <button onClick={() => deleteTask(tasks.findIndex(t => t.text === task.text))}>Delete</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {tasks.length === 0 && <p>No tasks added yet.</p>}
    </div>
  );
};

export default TodoList;
