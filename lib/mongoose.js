import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://hugoviana91@gmail.com:Hermogenesviana@cluster0.mongodb.net/form-system?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

/**
 * Variável global para manter a conexão com o MongoDB
 * entre recarregamentos de página em desenvolvimento
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
