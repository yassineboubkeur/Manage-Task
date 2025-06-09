'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTasks, deleteTask } from '../services/taskService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    fetchTasks()
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  };

  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;

    try {
      await deleteTask(id);
      // إعادة تحميل المهام بعد الحذف
      loadTasks();
    } catch (error) {
      alert('Erreur lors de la suppression');
      console.error(error);
    }
  };

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
              <button >Modifier</button>
            </Link>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: '10px' }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
