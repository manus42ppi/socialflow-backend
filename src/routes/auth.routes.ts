import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { ENV } from '../config/env';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    const expiresIn = (ENV.JWT_EXPIRES_IN || '7d') as any;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET as string,
      { expiresIn }
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, role',
      [email, hash, name]
    );
    const user = result.rows[0];
    const expiresIn = (ENV.JWT_EXPIRES_IN || '7d') as any;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET as string,
      { expiresIn }
    );
    res.status(201).json({ token, user });
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'E-Mail bereits vergeben' });
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

export default router;
