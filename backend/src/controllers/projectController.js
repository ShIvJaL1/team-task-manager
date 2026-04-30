const pool = require('../config/db');

async function getProjects(req, res) {
  const params = [];
  let query = `
    SELECT p.*, u.name AS created_by_name,
      COALESCE(json_agg(json_build_object('id', pm.user_id, 'role', pm.role, 'name', mu.name, 'email', mu.email))
      FILTER (WHERE pm.user_id IS NOT NULL), '[]') AS members
    FROM projects p
    LEFT JOIN users u ON u.id = p.created_by
    LEFT JOIN project_members pm ON pm.project_id = p.id
    LEFT JOIN users mu ON mu.id = pm.user_id
  `;

  if (req.user.role !== 'admin') {
    query += ` WHERE EXISTS (SELECT 1 FROM project_members x WHERE x.project_id = p.id AND x.user_id = $1) `;
    params.push(req.user.id);
  }

  query += ` GROUP BY p.id, u.name ORDER BY p.created_at DESC`;
  const { rows } = await pool.query(query, params);
  res.json(rows);
}

async function getProject(req, res) {
  const { id } = req.params;
  const { rows } = await pool.query(
    `SELECT p.*, u.name AS created_by_name
     FROM projects p LEFT JOIN users u ON u.id = p.created_by
     WHERE p.id = $1`,
    [id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Project not found' });
  res.json(rows[0]);
}

async function createProject(req, res) {
  const { name, description, members = [] } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const projectResult = await client.query(
      `INSERT INTO projects (name, description, created_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), description || null, req.user.id]
    );
    const project = projectResult.rows[0];

    await client.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (project_id, user_id) DO NOTHING`,
      [project.id, req.user.id]
    );

    for (const member of members) {
      if (member.userId) {
        await client.query(
          `INSERT INTO project_members (project_id, user_id, role)
           VALUES ($1, $2, $3)
           ON CONFLICT (project_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
          [project.id, member.userId, member.role || 'member']
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(project);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateProject(req, res) {
  const { name, description } = req.body;
  const { id } = req.params;
  const { rows } = await pool.query(
    `UPDATE projects SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [name || null, description || null, id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Project not found' });
  res.json(rows[0]);
}

async function deleteProject(req, res) {
  const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted' });
}

async function addProjectMember(req, res) {
  const { userId, role = 'member' } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  if (!['admin', 'member'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

  await pool.query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (project_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
    [req.params.id, userId, role]
  );
  res.status(201).json({ message: 'Member added/updated' });
}

async function removeProjectMember(req, res) {
  await pool.query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [req.params.id, req.params.userId]);
  res.json({ message: 'Member removed' });
}

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, addProjectMember, removeProjectMember };
