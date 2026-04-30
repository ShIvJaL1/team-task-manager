import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [error, setError] = useState("");

  async function fetchProjects() {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function createProject(e) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Only Admin can create projects");
    }
  }

  return (
    <div className="fade-page">
      <h1 className="page-title">Projects</h1>
      <p className="page-subtitle">
        Create, manage and monitor team projects.
      </p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={createProject} className="project-form">
        <input
          placeholder="Project name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Project description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <button>Create Project</button>
      </form>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="panel premium-card">
            <h2>No projects yet</h2>
            <p>Create your first project as Admin.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div className="project-card glass-card" key={project.id}>
              <span className="badge badge-blue">Active</span>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <p>
                <b>Created:</b>{" "}
                {project.created_at
                  ? new Date(project.created_at).toLocaleDateString()
                  : "Recently"}
              </p>
              <button>View Project</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}