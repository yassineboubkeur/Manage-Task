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
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (!token) {
      console.warn("🔒 Aucun token trouvé. Redirection vers login...");
      router.push("/login");
    } else {
      loadTasks();
    }
  }, [token]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(token);
      setTasks(data);
    } catch (err) {
      console.error("❌ Échec du chargement des tâches", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTask(taskToDelete, token);
      await loadTasks();
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error("❌ Erreur de suppression:", error);
    } finally {
      setShowModal(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📋 Tableau de bord</h2>
        <button onClick={handleLogout} style={buttonStyleDanger}>
          Se déconnecter
        </button>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <Link href="/tasks/add">
          <button style={buttonStylePrimary}>➕ Ajouter une tâche</button>
        </Link>
      </div>

      {loading ? (
        <p>Chargement des tâches...</p>
      ) : tasks.length === 0 ? (
        <p>🟡 Aucune tâche trouvée.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Statut:</strong> {task.status}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <Link href={`/tasks/edit/${task.id}`}>
                  <button style={buttonStyleEdit}>✏️ Modifier</button>
                </Link>
                <button onClick={() => handleDeleteClick(task.id)} style={buttonStyleDelete}>
                  🗑️ Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Modal de confirmation */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <p>❓ Voulez-vous vraiment supprimer cette tâche ?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              <button onClick={handleConfirmDelete} style={buttonStyleDelete}>
                Oui, Supprimer
              </button>
              <button onClick={handleCancelDelete} style={buttonStylePrimary}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const buttonStylePrimary = {
  padding: "0.5rem 1rem",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const buttonStyleDanger = {
  ...buttonStylePrimary,
  backgroundColor: "#e63946",
};

const buttonStyleEdit = {
  ...buttonStylePrimary,
  backgroundColor: "#f4a261",
};

const buttonStyleDelete = {
  ...buttonStylePrimary,
  backgroundColor: "#d62828",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
  minWidth: "300px",
};
