import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('Low');
  const [today, setToday] = useState(new Date());

  // Handle adding a new task
  const addTask = () => {
    if (task.trim()) {
      const newTask = { text: task, priority, completed: false };
      setTasks([...tasks, newTask]);
      setTask('');
      setPriority('Low');
    }
  };

  // Handle deleting task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Handle toggling task completion
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

  // Get the current month dates (we'll assume a standard 30-day month for now)
  const getDaysInMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysArray = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startOfMonth);
      date.setDate(startOfMonth.getDate() + i);
      daysArray.push(date);
    }
    return daysArray;
  };

  const daysInMonth = getDaysInMonth();
  const todayFormatted = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

  return (
    <div className="outer-container">
      <div className="todo-container">
        <h1>To-Do List</h1>

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

        {/* Calendar Grid for Current Date */}
        <div className="calendar-grid">
          {daysInMonth.map((date) => {
            const dateKey = date.toISOString().split('T')[0];
            const isToday = dateKey === todayFormatted;
            return (
              <div
                key={dateKey}
                className={`calendar-day ${isToday ? 'today' : ''}`}
              >
                <h3>{date.getDate()}</h3>
              </div>
            );
          })}
        </div>

        {/* Task Columns */}
        <div className="task-columns">
          <div className="task-column high-priority">
            <h2>High Priority</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="high-tasks">
                {(provided) => (
                  <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks
                      .filter((task) => task.priority === 'High')
                      .map((task, index) => (
                        <Draggable
                          key={`high-task-${index}`}
                          draggableId={`high-task-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              className={`task-item ${task.completed ? 'completed' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(index)}
                              />
                              <span className="task-text">{task.text}</span>
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
          </div>

          <div className="task-column medium-priority">
            <h2>Medium Priority</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="medium-tasks">
                {(provided) => (
                  <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks
                      .filter((task) => task.priority === 'Medium')
                      .map((task, index) => (
                        <Draggable
                          key={`medium-task-${index}`}
                          draggableId={`medium-task-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              className={`task-item ${task.completed ? 'completed' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(index)}
                              />
                              <span className="task-text">{task.text}</span>
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
          </div>

          <div className="task-column low-priority">
            <h2>Low Priority</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="low-tasks">
                {(provided) => (
                  <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks
                      .filter((task) => task.priority === 'Low')
                      .map((task, index) => (
                        <Draggable
                          key={`low-task-${index}`}
                          draggableId={`low-task-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              className={`task-item ${task.completed ? 'completed' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(index)}
                              />
                              <span className="task-text">{task.text}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
