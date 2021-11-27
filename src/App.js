import {useEffect, useState} from 'react'
//component
import Header from "./component/Header";
import Footer from "./component/Footer";
import Tasks from "./component/Tasks";
import AddTask from "./component/AddTask";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // fetch tasks from serve
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    return await res.json()
  }

  // fetch tasks from serve
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    return await res.json()
  }

  //delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //set reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updateTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? {...task, reminder: data.reminder} : task
      )
    )
  }

  //add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])
  }

  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask ? (<AddTask onAdd={addTask}/>) : ''}
      { tasks.length > 0 ?
        (<Tasks
          tasks={tasks}
          onDelete={deleteTask}
          onToggle={toggleReminder}
          />
        )
        :
        ('No Tasks To Show')
      }
      <Footer/>
    </div>
  );
}

export default App;
