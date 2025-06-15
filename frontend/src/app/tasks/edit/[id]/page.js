'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // 👈 مهم جداً!
import { addTask, updateTask, getTaskById } from '../../../services/taskService';

export default function AddEditTask({ params }) {
  const router = useRouter();
  const resolvedParams = use(params); // 👈 نحل Promise ديال params
  const taskId = resolvedParams?.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId)
        .then(task => {
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
        })
        .catch(err => console.error(err));
    }
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { title, description, status };
    try {
      if (taskId) {
        await updateTask(taskId, task);
      } else {
        await addTask(task);
      }
      router.push('/dashboard');
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{taskId ? 'Modifier Tâche' : 'Ajouter Tâche'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">--Status--</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="DONE">Terminée</option>
        </select>
        <button type="submit">{taskId ? 'Modifier' : 'Ajouter'}</button>
      </form>
    </div>
  );
}
