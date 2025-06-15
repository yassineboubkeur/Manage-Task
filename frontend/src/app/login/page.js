"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.js";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();

const router = useRouter();
    const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess("Connexion réussie !");
        // Optionnel : tu peux stocker le token si backend retourne un
        login(data.token);
        setUsername("");
        setPassword("");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(
          data.message || "Nom d'utilisateur ou mot de passe incorrect."
        );
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
