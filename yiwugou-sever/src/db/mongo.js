import { MongoClient } from "mongodb";

const url = 'mongodb://127.0.0.1:27017';

const options= {
    serverSelectionTimeoutMS: 10000
}

export const Connect = () => new MongoClient(url, options)