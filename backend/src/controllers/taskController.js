const pool = require('../config/db');

function baseTaskQuery(where = '') {
  return `
    SELECT t.*, p.name AS project_name, u.name AS assigned_to_name, u.email AS assigned_to_email
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    LEFT JOIN users u ON u.id = t.assigned_to
    ${where}
    ORDER BY t.created_at DESC
  `;
}

async function getTasks(req, res) {
  const params = [];
  let where = '';

  if (req.user.role !== 'admin') {
    where = 'WHERE t.assigned_to = $1 OR EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = t.project_id AND pm.user_id = $1)';
    params.push(req.user.id);
  }

  const { rows } = await pool.query(baseTaskQuery(where), params);
  res.json(rows);
}

async function getTask(req, res) {
  const { rows } = await pool.query(baseTaskQuery('WHERE t.id = $1'), [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Task not found' });
  res.json(rows[0]);
}

async function createTask(req, res) {
  const { project_id, title, description, assigned_to, due_date, status = 'todo' } = req.body;
  if (!project_id || !title || !assigned_to || !due_date) {
    return res.status(400).json({ message: 'project_id, title, assigned_to and due_date are required' });
  }
  if (!['todo', 'in_progress', 'done'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const { rows } = await pool.query(
    `INSERT INTO tasks (project_id, title, description, assigned_to, due_date, status, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [project_id, title.trim(), description || null, assigned_to, due_date, status, req.user.id]
  );
  res.status(201).json(rows[0]);
}

async function updateTask(req, res) {
  const { project_id, title, description, assigned_to, due_date, status } = req.body;
  if (status && !['todo', 'in_progress', 'done'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const { rows } = await pool.query(
    `UPDATE tasks SET
      project_id = COALESCE($1, project_id),
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      assigned_to = COALESCE($4, assigned_to),
      due_date = COALESCE($5, due_date),
      status = COALESCE($6, status),
      updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [project_id || null, title || null, description || null, assigned_to || null, due_date || null, status || null, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Task not found' });
  res.json(rows[0]);
}

async function updateStatus(req, res) {
  const { status } = req.body;
  if (!['todo', 'in_progress', 'done'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const params = [status, req.params.id];
  let query = `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2`;

  if (req.user.role !== 'admin') {
    query += ` AND assigned_to = $3`;
    params.push(req.user.id);
  }

  query += ' RETURNING *';
  const { rows } = await pool.query(query, params);
  if (!rows[0]) return res.status(404).json({ message: 'Task not found or not assigned to you' });
  res.json(rows[0]);
}

async function deleteTask(req, res) {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
}

async function dashboard(req, res) {
  const params = [];
  let where = '';
  if (req.user.role !== 'admin') {
    where = 'WHERE assigned_to = $1';
    params.push(req.user.id);
  }

  const { rows } = await pool.query(
    `SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'todo')::int AS todo,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
      COUNT(*) FILTER (WHERE status = 'done')::int AS done,
      COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status <> 'done')::int AS overdue
     FROM tasks ${where}`,
    params
  );

  const overdue = await pool.query(
    `SELECT t.id, t.title, t.due_date, t.status, p.name AS project_name
     FROM tasks t JOIN projects p ON p.id = t.project_id
     WHERE t.due_date < CURRENT_DATE AND t.status <> 'done'
     ${req.user.role !== 'admin' ? 'AND t.assigned_to = $1' : ''}
     ORDER BY t.due_date ASC
     LIMIT 10`,
    params
  );

  res.json({ counts: rows[0], overdue_items: overdue.rows });
}

module.exports = { getTasks, getTask, createTask, updateTask, updateStatus, deleteTask, dashboard };
