import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './config/db.js';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;
const prefix = process.env.API_PREFIX || '/api/v1';

app.use(express.json());
app.use(prefix, routes);

try {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
} catch (error) {
  console.error('Startup failed:', error);
  process.exitCode = 1;
}