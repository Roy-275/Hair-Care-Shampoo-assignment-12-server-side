const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uucxb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('hair_care_shampoo');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');

        // get api for getting all productCollection
        app.get('/allproducts', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray();
            res.json(products);
        })

        // get api for productCollection
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({}).limit(6);
            const products = await cursor.toArray();
            res.json(products);
        })

        // get api for single product details
        app.get('/products/:productId', async (req, res) => {
            const id = req.params.productId;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.find(query).toArray();
            res.json(product);
        })

        // post api for productCollection
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })

        // post api for ordersCollection
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hair care shampoo server is working')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})