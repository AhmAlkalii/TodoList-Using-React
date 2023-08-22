import React,{useEffect} from 'react'
import {v4 as uuidv4} from "uuid";


const Form = ({input,setInput,todos,setTodos,editTodo,setEditTodo }) => {
  
  const updateTodo = (title, id, completed) => {
    const updatedTime = new Date().toLocaleTimeString(); 
    const newTodo = todos.map((todo) =>
      todo.id === id ? { ...todo, title, completed, time: updatedTime } : todo
    );
    setTodos(newTodo);
    setEditTodo("");
  };
  
  

  useEffect(() => {
    if(editTodo){
      setInput(editTodo.title);
    }else{
      setInput("");
    }
  },[setInput,editTodo])
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
      };
      setTodos([...todos, newTodo]);
      setInput("");
    } else {
      updateTodo(input, editTodo.id, editTodo.completed);
    }
  };
  
  

  return (
    <form  onSubmit={onFormSubmit}> 
        <input type='text' placeholder='Enter a Todo....' className='task-input' value={input} required onChange={onInputchange}/>
        <button className='button-add' type='submit'>
            {editTodo ? "OK" : "Add"}
        </button>
    </form>
  )
}

export default Form;