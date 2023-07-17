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
        const toursCollection = client.db('vromon-db').collection('tours');
        const usersCollection = client.db('vromon-db').collection('users');
        const contactsCollection = client.db('vromon-db').collection('contacts');
        const hotelOrdersCollection = client.db('vromon-db').collection('hotelOrders');
        const busTicketOrdersCollection = client.db('vromon-db').collection('busTicketOrders');
        const flightTicketOrdersCollection = client.db('vromon-db').collection('flightTicketOrders');


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

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const servicesList = await servicesCollection.findOne(query);
            res.send(servicesList);
        })

        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await toursCollection.insertOne(tour);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.post('/contacts', async (req, res) => {
            const contact = req.body;
            const result = await contactsCollection.insertOne(contact);
            res.send(result);
        })

        app.post('/hotelBookings', async (req, res) => {
            const order = req.body;
            const result = await hotelOrdersCollection.insertOne(order);
            res.send(result);
        })

        app.get('/hotelBookings', async (req, res) => {
            const query = {};
            const cursor = hotelOrdersCollection.find(query);
            const bookedHotels = await cursor.toArray();
            res.send(bookedHotels);
        })

        app.post('/busTicketBookings', async (req, res) => {
            const order = req.body;
            const result = await busTicketOrdersCollection.insertOne(order);
            res.send(result);
        })

        app.get('/busTicketBookings', async (req, res) => {
            const query = {};
            const cursor = busTicketOrdersCollection.find(query);
            const bookedBusTicket = await cursor.toArray();
            res.send(bookedBusTicket);
        })

        app.post('/flightTicketBookings', async (req, res) => {
            const order = req.body;
            const result = await flightTicketOrdersCollection.insertOne(order);
            res.send(result);
        })

        app.get('/flightTicketBookings', async (req, res) => {
            const query = {};
            const cursor = flightTicketOrdersCollection.find(query);
            const bookedFlightTicket = await cursor.toArray();
            res.send(bookedFlightTicket);
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