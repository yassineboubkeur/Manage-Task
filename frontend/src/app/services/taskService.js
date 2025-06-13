"use client";
const API_URL = "http://localhost:8081/api/tasks";

function getAuthHeaders() {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log("➡️ Headers envoyés:", headers); // ✅ دابا كيتنفذ
  return headers;
}


export async function fetchTasks() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function addTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    throw new Error("Failed to add task");
  }
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  return res.json();
}

export async function getTaskById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
  return;
}
