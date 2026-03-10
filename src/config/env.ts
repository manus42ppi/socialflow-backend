export const ENV = {
  PORT:           parseInt(process.env.PORT || '3001'),
  JWT_SECRET:     process.env.JWT_SECRET || 'dev-secret-change-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL:   process.env.FRONTEND_URL || 'http://localhost:5173',
};
