import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const API_URL = 'http://localhost:5000/tasks';

const TodoList = () => {
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [priority, setPriority] = useState('Low');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get(API_URL);
        setTasks(response.data);
    };

    const addTask = async () => {
        if (task.trim()) {
            const newTask = { text: task, dueDate, priority, completed: false };
            await axios.post(API_URL, newTask);
            setTasks([...tasks, newTask]);
            setTask('');
            setDueDate('');
            setPriority('Low');
        }
    };

    const deleteTask = async (index) => {
        await axios.delete(`${API_URL}/${index}`);
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const toggleTaskCompletion = (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    }).filter((task) => task.text.toLowerCase().includes(searchTerm.toLowerCase()));

    const isPastDue = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        const due = new Date(dueDate);
        return due < today;
    };

    return (
        <div className={`todo-container ${darkMode ? 'dark-mode' : ''}`}>
            <h1>To-Do List</h1>
            <label className="dark-mode-toggle">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                Dark Mode
            </label>
            <div className="todo-input">
                <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a new task" />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
                <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="task-columns">
                {['High', 'Medium', 'Low'].map((priorityLevel) => {
                    const priorityTasks = filteredTasks.filter(task => task.priority === priorityLevel);
                    return (
                        <div key={priorityLevel} className={`task-column ${priorityLevel.toLowerCase()}-priority`}>
                            <h2>{priorityLevel} Priority</h2>
                            <ul className="todo-list">
                                {priorityTasks.map((task, index) => (
                                    <li key={task.text} className={`task-item ${task.completed ? 'completed' : ''} ${isPastDue(task.dueDate) ? 'past-due' : ''}`}>
                                        <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(filteredTasks.findIndex(t => t.text === task.text))} />
                                        <span className="task-text">{task.text} {task.dueDate && `(${task.dueDate})`}</span>
                                        <button onClick={() => deleteTask(filteredTasks.findIndex(t => t.text === task.text))}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
            {tasks.length === 0 && <p>No tasks added yet.</p>}
        </div>
    );
};

export default TodoList;
