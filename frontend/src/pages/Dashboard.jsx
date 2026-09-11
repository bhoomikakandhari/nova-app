import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function loadProjects() {
    const res = await api.get("/projects");
    setProjects(res.data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/projects", { name, description });
    setName("");
    setDescription("");
    loadProjects();
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>NOVA Dashboard</h1>
        <div>
          <span style={{ marginRight: 12 }}>Hi, {user?.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <form onSubmit={handleCreate} style={{ margin: "20px 0" }}>
        <input
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <button type="submit">Create project</button>
      </form>

      <div>
        {projects.length === 0 && <p>No projects yet — create one above.</p>}
        {projects.map((p) => (
          <Link
            to={`/projects/${p.id}`}
            key={p.id}
            style={{
              display: "block",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3 style={{ margin: 0 }}>{p.name}</h3>
            <p style={{ margin: "4px 0", color: "#666" }}>{p.description}</p>
            <div style={{ background: "#eee", borderRadius: 4, height: 8 }}>
              <div
                style={{
                  width: `${p.progress}%`,
                  background: "#4caf50",
                  height: 8,
                  borderRadius: 4,
                }}
              />
            </div>
            <small>{p.progress}% complete</small>
          </Link>
        ))}
      </div>
    </div>
  );
}