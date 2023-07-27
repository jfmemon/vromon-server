const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const verifyJwt = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access.' });
    }

    // bearer token
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(401).send({ error: true, message: 'unauthorized access.' });
        }

        if (!decoded || !decoded.email) {
            console.error('Invalid JWT Payload:', decoded);
            return res.status(403).send({ error: true, message: 'unauthorized access.' });
        }

        // Ensure the decoded object is set correctly
        req.decoded = decoded;
        next();
    });
};




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



        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        })

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
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: 'User already exist.' });
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users/admin/:email', verifyJwt, async (req, res) => {
            const email = req.params.email;
            console.log('Email received:', email);
        
            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }
        
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const result = { admin: user?.role === 'admin' };
            res.send(result);
        });
        

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post('/contacts', async (req, res) => {
            const contact = req.body;
            const result = await contactsCollection.insertOne(contact);
            res.send(result);
        })

        app.get('/contacts', async (req, res) => {
            const query = {};
            const cursor = contactsCollection.find(query);
            const contactInfo = await cursor.toArray();
            res.send(contactInfo);
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