import React, { useEffect, useState } from "react";
import http from "../api/http";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
    overdue: 0,
    overdueItems: []
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await http.get("/tasks/dashboard");

        setStats({
          total: res.data.counts?.total || 0,
          todo: res.data.counts?.todo || 0,
          in_progress: res.data.counts?.in_progress || 0,
          done: res.data.counts?.done || 0,
          overdue: res.data.counts?.overdue || 0,
          overdueItems: res.data.overdue_items || []
        });
      } catch (err) {
        console.log(err);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">TEAM WORKSPACE</p>
          <h1>Good evening, Admin 👋</h1>
          <p>Track projects, tasks, deadlines and team performance from one place.</p>
        </div>

        <a href="/tasks" className="hero-btn">+ New Task</a>
      </div>

      <div className="stats-grid">
        <a href="/tasks" className="stat-card premium-card clickable-card">
          <span className="stat-icon blue">📋</span>
          <p>Total Tasks</p>
          <h2>{stats.total}</h2>
          <small>All assigned tasks</small>
        </a>

        <a href="/tasks" className="stat-card premium-card clickable-card">
          <span className="stat-icon orange">📝</span>
          <p>Todo</p>
          <h2>{stats.todo}</h2>
          <small>Waiting to start</small>
        </a>

        <a href="/tasks" className="stat-card premium-card clickable-card">
          <span className="stat-icon blue">⏳</span>
          <p>In Progress</p>
          <h2>{stats.in_progress}</h2>
          <small>Currently active</small>
        </a>

        <a href="/tasks" className="stat-card premium-card clickable-card">
          <span className="stat-icon green">✅</span>
          <p>Completed</p>
          <h2>{stats.done}</h2>
          <small>Finished tasks</small>
        </a>
      </div>

      <div className="dashboard-grid">
        <div className="panel premium-card">
          <div className="section-head">
            <h2>Task Status</h2>
            <a href="/tasks">View all →</a>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>Todo</span>
              <b>{stats.todo}</b>
            </div>
            <div className="progress-bar">
              <div
                style={{
                  width: `${stats.total ? (stats.todo / stats.total) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>In Progress</span>
              <b>{stats.in_progress}</b>
            </div>
            <div className="progress-bar">
              <div
                style={{
                  width: `${stats.total ? (stats.in_progress / stats.total) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>Done</span>
              <b>{stats.done}</b>
            </div>
            <div className="progress-bar">
              <div
                style={{
                  width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="panel premium-card">
          <div className="section-head">
            <h2>Overdue</h2>
            <span className="badge badge-red">{stats.overdue} Items</span>
          </div>

          {(stats.overdueItems || []).length === 0 ? (
            <p className="empty">No overdue tasks 🎉</p>
          ) : (
            (stats.overdueItems || []).map((task) => (
              <div className="overdue-item" key={task.id}>
                <b>{task.title}</b>
                <span>Due: {task.due_date?.slice(0, 10)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}