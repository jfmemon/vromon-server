const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qp55ast.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const destinationCollection = client.db('vromon-db').collection('destination');
        const servicesCollection = client.db('vromon-db').collection('services');


        app.get('/destinations', async (req, res) => {
            const query = {};
            const cursor = destinationCollection.find(query);
            const destinations = await cursor.toArray();
            res.send(destinations);
        })

        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const destinations = await destinationCollection.findOne(query);
            res.send(destinations);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })



    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Vromon server is running successfully.");
})

app.listen(port, () => {
    console.log(`Vromon server is running on port: ${port}`)
})