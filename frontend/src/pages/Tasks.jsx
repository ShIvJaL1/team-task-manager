import React, { useEffect, useState } from "react";
import http from "../api/http";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    project_id: "",
    assigned_to: "",
    due_date: "",
    status: "todo"
  });
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "Admin" || user?.role === "admin";

  async function loadData() {
    try {
      const taskRes = await http.get("/tasks");
      const projectRes = await http.get("/projects");
      const userRes = await http.get("/users");

      setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      setProjects(Array.isArray(projectRes.data) ? projectRes.data : []);
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTask(e) {
    e.preventDefault();
    setError("");

    if (!isAdmin) {
      setError("Only Admin can create tasks");
      return;
    }

    try {
      await http.post("/tasks", form);

      setForm({
        title: "",
        description: "",
        project_id: "",
        assigned_to: "",
        due_date: "",
        status: "todo"
      });

      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Only Admin can create tasks");
    }
  }

  async function updateStatus(id, status) {
    try {
      await http.patch(`/tasks/${id}/status`, { status });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  }

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const getBadgeClass = (status) => {
    if (status === "done") return "badge badge-green";
    if (status === "in_progress") return "badge badge-blue";
    return "badge badge-yellow";
  };

  return (
    <div className="fade-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">TASK CENTER</p>
          <h1>Tasks</h1>
          <p>Create, assign, filter and track all team tasks professionally.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {isAdmin ? (
        <form className="task-form" onSubmit={createTask}>
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.project_id}
            onChange={(e) => setForm({ ...form, project_id: e.target.value })}
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={form.assigned_to}
            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            required
          >
            <option value="">Assign to User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            required
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button type="submit">Create Task</button>
        </form>
      ) : (
        <div className="error">Only Admin can create tasks. Members can view and update assigned tasks.</div>
      )}

      <div className="task-toolbar">
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "todo" ? "active-filter" : ""}
          onClick={() => setFilter("todo")}
        >
          Todo
        </button>
        <button
          className={filter === "in_progress" ? "active-filter" : ""}
          onClick={() => setFilter("in_progress")}
        >
          In Progress
        </button>
        <button
          className={filter === "done" ? "active-filter" : ""}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="panel premium-card">
            <h2>No tasks found</h2>
            <p>Create a task or change the filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div className="task-card glass-card" key={task.id}>
              <div className="section-head">
                <span className={getBadgeClass(task.status)}>
                  {task.status?.replace("_", " ")}
                </span>
                <span className="badge badge-blue">
                  #{task.id?.slice(0, 8)}
                </span>
              </div>

              <h2>{task.title}</h2>
              <p>{task.description || "No description added."}</p>
              <p>
                <b>Project:</b> {task.project_name || task.project_id}
              </p>
              <p>
                <b>Assigned:</b> {task.assigned_to_name || task.assigned_to_email || "Unassigned"}
              </p>
              <p>
                <b>Due:</b> {task.due_date?.slice(0, 10)}
              </p>

              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}