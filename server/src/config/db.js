import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Windows DNS resolution of MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  const retryInterval = 5000; // 5 seconds
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness_assistant';

  try {
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    
    if (retryCount < maxRetries) {
      console.log(`[MongoDB] Retrying connection in ${retryInterval / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
      setTimeout(() => connectDB(retryCount + 1), retryInterval);
    } else {
      console.error('[MongoDB] Max retry attempts reached. Database connection failed.');
    }
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Warning: Database connection lost. Attempting reconnection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection re-established.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Connection runtime error: ${err.message}`);
});

export default connectDB;
