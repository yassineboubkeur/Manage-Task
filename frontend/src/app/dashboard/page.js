'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTasks } from '../services/taskService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks()
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Tableau de bord</h2>
      <Link href="/tasks/add">
        <button>Ajouter une tâche</button>
      </Link>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <Link href={`/tasks/edit/${task.id}`}>
              <button>Modifier</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
