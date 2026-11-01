import express from 'express'

const app = express()

const PORT = 8000



import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb://studio_space:tGqxX4tlLbUdcBQs@ac-qptuiex-shard-00-00.xuksm8z.mongodb.net:27017,ac-qptuiex-shard-00-01.xuksm8z.mongodb.net:27017,ac-qptuiex-shard-00-02.xuksm8z.mongodb.net:27017/?ssl=true&replicaSet=atlas-psa02l-shard-0&authSource=admin");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}


connectToMongoDB()

//http://localhost:8000/


app.get('/', (req, res) =>{ 
    res.send({message: 'Server is running fine'})
})

app.listen(PORT, ()=>{
     console.log(`Example app listening on port ${PORT}`)
})