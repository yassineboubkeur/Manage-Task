"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTasks, deleteTask } from "../services/taskService";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.warn("🔒 Aucun token trouvé. Redirection vers login...");
    router.push("/login");
    return;
  }
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error("❌ Failed to load tasks", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      await deleteTask(id); // ما كتدير لا .then() لا res.json()
      loadTasks(); // عاد كتحمّل المهام
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error("❌ Delete error:", error);
    }
  };

  return (
    <div>
      <h2>Tableau de bord</h2>
      <Link href="/tasks/add">
        <button>Ajouter une tâche</button>
      </Link>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <Link href={`/tasks/edit/${task.id}`}>
              <button>Modifier</button>
            </Link>
            <button
              onClick={() => handleDelete(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
