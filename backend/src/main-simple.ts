import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

// Import and run the bootstrap function from app.ts
import('./app').then(({ bootstrap }) => {
  bootstrap();
}).catch(error => {
  console.error('Failed to start server:', error);
});
