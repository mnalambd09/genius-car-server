const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(express.json());
app.use(cors());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.llpo4b5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('geniusCar').collection('services');
        const ordersCollection = client.db('geniusCar').collection('orders');
        
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id)}
            const services = await serviceCollection.findOne(query);
            res.send(services);
            console.log(services);
        })

        // orders api
        app.get('/orders', async(req, res) => {
            let query = {};

            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }

            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })


        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
            console.log(result)

        })


        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)}
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await ordersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })



    }
    finally{

    }
}
run().catch(err => console.error(err))

app.get('/' , (req, res) => {
    res.send('Hello from Genius car Server')

})

app.listen(port, () => {
    console.log(`Server is Running on Port ${port}`)
})