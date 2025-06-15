"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchTasks, deleteTask } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!token) {
      console.warn("🔒 Aucun token trouvé dans le contexte. Redirection vers login...");
      router.push("/login");
      return;
    }
    loadTasks();
  }, [token]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(token); // إذا كنت تحتاج token هنا
      setTasks(data);
    } catch (err) {
      console.error("❌ Failed to load tasks", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      await deleteTask(id, token); // نفس الشيء هنا إذا احتاج token
      loadTasks();
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error("❌ Delete error:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>Se déconnecter</button>
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
