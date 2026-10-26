import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/homecrew';
  const forceInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (!forceInMemory) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if no local mongod
      });
      console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Could not connect to primary MongoDB (${err.message}).`);
      if (process.env.USE_IN_MEMORY_DB === 'false') {
        console.error('[Database] USE_IN_MEMORY_DB is disabled. Exiting...');
        process.exit(1);
      }
      console.log('[Database] Falling back to embedded MongoDB Memory Server for seamless hackathon execution...');
    }
  }

  // Fallback to MongoDB Memory Server
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    console.log(`[Database] In-memory MongoDB started at: ${memoryUri}`);
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to in-memory MongoDB database.`);
    return conn;
  } catch (memErr) {
    console.error(`[Database] Failed to start MongoMemoryServer: ${memErr.message}`);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
