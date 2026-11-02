import express from 'express'
import 'dotenv/config'
import cors from 'cors'


const app = express()

const PORT = 8000

app.use(cors())
app.use(express.json())

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}


const mongoClient = await connectToMongoDB()
const db = mongoClient.db('studio-space')
const studioCollection = db.collection('studios')
const bookingsCollection = db.collection('booking')



//http://localhost:8000/my-bookings/${email}


app.get('/', (req, res) =>{ 
    res.send({message: 'Server is running fine'})
})

app.get('/studios', async (req,res)=> {
    const result = await studioCollection.find().toArray()

    res.send(result)
})

app.get('/studios/:id' , async(req, res) => {
    const {id} = req.params
    const result = await studioCollection.findOne({_id: new ObjectId(id)})

    res.send(result)
})

app.get('/my-bookings/:email', async (req, res) => {
    const { email } = req.params;
    const result = await bookingsCollection.find({ userEmail: email }).toArray();
    res.send(result);
});

//booking cancel 
app.patch('/bookings/:id/cancel', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'Cancelled' } }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Remove a booking from history
app.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});
app.post('/add-studio' , async (req, res)=>{
    const data = req.body
    const result = await studioCollection.insertOne(data)
    
    console.log(result);
    res.send(result)
})

app.post('/bookings', async(req, res)=> {
    const data = req.body;

    const result = await bookingsCollection.insertOne(data);

    res.send(result)
})

app.put('/studios/:id', async(req, res) => {
    const {id} =  req.params 
    const data = req.body

    const result = await studioCollection.updateOne({_id: new ObjectId(id)},{$set: data})
    res.json(result)
})

app.delete('/studios/:id', async (req, res) => {
    const {id}  =  req.params
    const result = await studioCollection.deleteOne({_id: new ObjectId(id)})

    res.json(result)
})

app.listen(PORT, ()=>{
     console.log(`Example app listening on port ${PORT}`)
})