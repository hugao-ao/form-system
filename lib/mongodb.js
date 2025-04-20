import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://hugoviana91@gmail.com:Hermogenesviana@cluster0.mongodb.net/form-system?retryWrites=true&w=majority";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, use uma variável global para que a conexão
  // seja mantida entre recarregamentos de página
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Em produção, é melhor não usar uma variável global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
