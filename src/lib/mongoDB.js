import { MongoClient } from "mongodb";

// Ensure the MongoDB URI is provided in your environment
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

const uri = process.env.MONGODB_URI;
const options = {};

// Use a global variable in development to preserve the value across module reloads
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each connection.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
