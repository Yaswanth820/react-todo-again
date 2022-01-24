import './App.css';
import Header from './components/Header';
import Tasks from './components/Tasks';
import SearchBar from './components/SearchBar';
import AddTask from './components/AddTask';
import { useState, useEffect } from 'react';

const App = () => {

  const [tasks, setTasks] = useState([]);

  useEffect( () => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
      setTempTasks(tasksFromServer);
    }

    getTasks()
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('https://spring-todo-1.herokuapp.com/tasks');
    const data = res.json();
    return data;
  }

  const [tempTasks, setTempTasks] = useState([]);

  const [showForm, setFormState] = useState(false);

  const onDeleteTask = async (id) => {

    await fetch(`https://spring-todo-1.herokuapp.com/tasks/${id}`, {
      method: 'DELETE',
    })

    setTasks(
      tasks.filter( 
        (task) => {
          return task.taskId !== id? task: '';
        }
      ) 
    );
    setTempTasks(
      tempTasks.filter( 
        (task) => {
          return task.taskId !== id? task: '';
        }
      ) 
    );
  }

  const onSearchTask = async (searchString) => {

    let n = searchString.length;
    searchString = searchString.toLowerCase();

    await fetch(`https://spring-todo-1.herokuapp.com/tasks/name/${searchString}`, {
      method: 'GET',
    });


    (n === 0)? setTasks(tempTasks):
     setTasks(
      tempTasks.filter( 
        (task) => {
          return (((task.chore).toLowerCase()).substring(0, n) === searchString)? task: '';
        } 
      )
    )
  }

  const toggleTaskCompletion = async (id) => {

    await fetch(`https://spring-todo-1.herokuapp.com/tasks/${id}`, {
      method: 'PUT'
    })

    setTasks(
      tasks.map( (task) => task.taskId === id?
        { ...task, completed: !task.completed }: task 
      )
    )

    setTempTasks(tempTasks.map( (task) => task.taskId === id?
    { ...task, completed: !task.completed }: task ))
  }

  const onAddingTask = async (taskPart) => {

    const res = await fetch(`https://spring-todo-1.herokuapp.com/tasks`, {
      method: 'POST',
      body: JSON.stringify(
        taskPart
      ),
      headers: {
        "Content-type": "application/json"
      }
    })
    const data = await res.json();

    const newTask = data;

    setTasks([...tasks, newTask]);
    setTempTasks([...tempTasks, newTask]);
  }

  const onToggleForm = () => {
    setFormState(!showForm);
  }

  return (
    <div className="App">
      <Header onToggle = {onToggleForm} showForm = {showForm} />

      {showForm === true? <AddTask onAdd = {onAddingTask} />: ''}

      <SearchBar onSearch = {onSearchTask} />

      {
        tasks.length === 0? <h2>No tasks found!</h2>: 
        <Tasks tasks = {tasks} onDelete = {onDeleteTask} onToggle = {toggleTaskCompletion} />
      }

    </div>
  );
}

export default App;
/*
 1. Sort tasks
~2. Search ~
*/