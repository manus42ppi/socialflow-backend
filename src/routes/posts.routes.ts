import { Router } from 'express';
import { pool } from '../config/db';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth as any);

router.get('/', async (req, res) => {
  const { status, channel } = req.query;
  let query = 'SELECT * FROM posts WHERE 1=1';
  const params: any[] = [];
  if (status)  { params.push(status);  query += ` AND status = $${params.length}`; }
  if (channel) { params.push(channel); query += ` AND $${params.length} = ANY(channels)`; }
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { title, content, hashtags, channels, status, scheduledDate, scheduledTime, mediaId, campaignId } = req.body;
  const result = await pool.query(
    `INSERT INTO posts (title,content,hashtags,channels,status,scheduled_date,scheduled_time,media_id,campaign_id,created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [title,content,hashtags,channels,status||'draft',scheduledDate,scheduledTime,mediaId,campaignId,(req as any).user.id]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { title, content, hashtags, channels, status, scheduledDate, scheduledTime, mediaId, campaignId } = req.body;
  const result = await pool.query(
    `UPDATE posts SET title=$1,content=$2,hashtags=$3,channels=$4,status=$5,
     scheduled_date=$6,scheduled_time=$7,media_id=$8,campaign_id=$9,updated_at=NOW()
     WHERE id=$10 RETURNING *`,
    [title,content,hashtags,channels,status,scheduledDate,scheduledTime,mediaId,campaignId,req.params.id]
  );
  res.json(result.rows[0]);
});

router.patch('/:id/status', async (req, res) => {
  const result = await pool.query(
    'UPDATE posts SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
    [req.body.status, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

export default router;
