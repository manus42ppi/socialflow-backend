import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import { ENV } from './config/env';
import authRoutes  from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';

const app = express();
app.use(helmet());
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/auth',  authRoutes);
app.use('/posts', postsRoutes);
// TODO: app.use('/media',     mediaRoutes);
// TODO: app.use('/campaigns', campaignRoutes);
// TODO: app.use('/users',     userRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.listen(ENV.PORT, () => console.log(`✅ Backend läuft auf http://localhost:${ENV.PORT}`));
