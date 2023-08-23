import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = ({ input, setInput, todos, setTodos, editTodo, setEditTodo }) => {
  const [reminderTime, setReminderTime] = useState('');
  const [reminderAMPM, setReminderAMPM] = useState('AM'); // AM or PM

  const showNotification = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const showReminderNotification = (taskTitle) => {
    toast.success(`Reminder: Task "${taskTitle}" is due soon!`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000, 
    });
  };
  
  const checkReminders = () => {
    const currentTime = new Date();
  
    todos.forEach((todo) => {
      const dueTime = new Date(todo.dueTime);
      const reminderTime = new Date(dueTime.getTime() - 15 * 60 * 1000); 
  
      if (currentTime >= reminderTime && currentTime < dueTime) {
        showReminderNotification(todo.title);
      }
    });
  };
  

  const updateTodo = (title, id, completed) => {
    const updatedTime = new Date().toLocaleTimeString();
    const newDueDate = new Date();
  
    if (reminderTime) {
      const [hours, minutes] = reminderTime.split(':');
      newDueDate.setHours(hours % 12 + (reminderAMPM === 'PM' ? 12 : 0));
      newDueDate.setMinutes(minutes);
    } else {
      newDueDate.setMinutes(newDueDate.getMinutes() + 30);
    }
  
    const newTodo = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            title,
            completed,
            time: updatedTime,
            dueTime: newDueDate,
            dueAMPM: reminderAMPM,
          }
        : todo
    );
    setTodos(newTodo);
    setEditTodo('');
    setReminderTime('');
    setReminderAMPM('AM');
    showNotification('Task updated!');
  };
  

  useEffect(() => {
    if (editTodo) {
      setInput(editTodo.title);
      if (editTodo.dueTime) {
        const [time, ampm] = editTodo.dueTime.split(' ');
        setReminderTime(time);
        setReminderAMPM(ampm);
      }
    } else {
      setInput('');
    }

    const reminderInterval = setInterval(checkReminders, 60000); // Check every minute
    return () => {
      clearInterval(reminderInterval);
    };
  }, [setInput, editTodo, todos]);

  const onInputchange = (event) => {
    setInput(event.target.value);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (!editTodo) {
      const newTodo = {
        id: uuidv4(),
        title: input,
        completed: false,
        time: new Date().toLocaleTimeString(),
        dueTime: reminderTime ? `${reminderTime} ${reminderAMPM}` : '',
      };
      setTodos([...todos, newTodo]);
      setInput('');
      setReminderTime('');
      setReminderAMPM('AM');
      showNotification('Task added!');
    } else {
      updateTodo(input, editTodo.id, editTodo.completed);
      showNotification('Task updated!');
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type='text'
        placeholder='Enter a Todo....'
        className='task-input'
        value={input}
        required
        onChange={onInputchange}
      />
      <input
        type='time'
        className='reminder-input'
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
      />
      <select
        className='am-pm-select'
        value={reminderAMPM}
        onChange={(e) => setReminderAMPM(e.target.value)}
      >
        <option value='AM'>AM</option>
        <option value='PM'>PM</option>
      </select>
      <button className='button-add' type='submit'>
        {editTodo ? 'OK' : 'Add'}
      </button>
      <ToastContainer />
    </form>
  );
};

export default Form;
