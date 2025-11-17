import http from 'http';
import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function main() {
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
