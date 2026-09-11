import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

const STATUSES = ["todo", "in_progress", "done"];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");


  async function loadProject() {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data);
  }

  useEffect(() => {
    loadProject();
  }, [id]);

  async function handleAddTask(e) {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await api.post("/tasks", { title: taskTitle, projectId: id });
    setTaskTitle("");
    loadProject();
  }

  async function handleAddMember(e) {
  e.preventDefault();
  setMemberError("");
  try {
    await api.post(`/projects/${id}/members`, { email: memberEmail });
    setMemberEmail("");
    loadProject();
  } catch (err) {
    setMemberError(err.response?.data?.error || "Could not add member");
  }
}

  async function handleStatusChange(taskId, status) {
    await api.put(`/tasks/${taskId}`, { status });
    loadProject();
  }

  async function handleDeleteTask(taskId) {
    await api.delete(`/tasks/${taskId}`);
    loadProject();
  }

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Link to="/dashboard">&larr; Back to dashboard</Link>
      <h1>{project.name}</h1>
      <p>{project.description}</p>

      <h3>Team members</h3>
<ul>
  <li>{project.owner.name} (owner)</li>
  {project.members.map((m) => (
    <li key={m.id}>{m.user.name}</li>
  ))}
</ul>
<form onSubmit={handleAddMember}>
  <input
    placeholder="Add member by email"
    value={memberEmail}
    onChange={(e) => setMemberEmail(e.target.value)}
    style={{ padding: 6, marginRight: 8 }}
  />
  <button type="submit">Add</button>
</form>
{memberError && <p style={{ color: "red" }}>{memberError}</p>}

      <h3>Tasks</h3>
      <form onSubmit={handleAddTask} style={{ marginBottom: 16 }}>
        <input
          placeholder="New task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={{ padding: 6, marginRight: 8 }}
        />
        <button type="submit">Add task</button>
      </form>

      {project.tasks.length === 0 && <p>No tasks yet.</p>}
      {project.tasks.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>{t.title}</strong>
          <div>
            <select
              value={t.status}
              onChange={(e) => handleStatusChange(t.id, e.target.value)}
              style={{ marginRight: 8 }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
            <button onClick={() => handleDeleteTask(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}