'use client';
import { useState, useEffect } from 'react';
import { use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { addTask, updateTask, getTaskById } from '../../../services/taskService';

export default function AddEditTaskWrapper({ params }) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AddEditTask paramsPromise={params} />
    </Suspense>
  );
}

function AddEditTask({ paramsPromise }) {
  const router = useRouter();
  const resolvedParams = use(paramsPromise); // ✅ ديال React 19+
  const taskId = resolvedParams?.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const isEditMode = Boolean(taskId);

  useEffect(() => {
    if (isEditMode) {
      getTaskById(taskId)
        .then((task) => {
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
        })
        .catch((err) => {
          console.error(err);
          setError("Erreur lors du chargement de la tâche.");
        });
    }
  }, [isEditMode, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !status) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    const task = { title, description, status };

    try {
      if (isEditMode) {
        await updateTask(taskId, task);
      } else {
        await addTask(task);
      }
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>{isEditMode ? '✏️ Modifier une tâche' : '➕ Ajouter une tâche'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          style={inputStyle}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="">-- Sélectionner un statut --</option>
          <option value="TODO">🕒 À faire</option>
          <option value="IN_PROGRESS">🔄 En cours</option>
          <option value="DONE">✅ Terminée</option>
        </select>
        <button type="submit" style={buttonStyle}>
          {isEditMode ? '✅ Modifier la tâche' : '📌 Ajouter la tâche'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "0.75rem",
  backgroundColor: "#0070f3",
  color: "#fff",
  fontSize: "1rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
