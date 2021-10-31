const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 7000;

//middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbwqg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();

        const database = client.db('all_foods');
        const foodsCollection = database.collection('foods');
        const restaurantsCollection = database.collection('restaurants')


        // Get api
        app.get('/foods', async(req, res) => {
            const cursor = foodsCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        });

        // Get single api
        app.get('/foods/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const food = await foodsCollection.findOne(query);
            res.json(food)
        });


        // Get api
        app.get('/restaurants', async(req, res) => {
            const cursor = restaurantsCollection.find({});
            const restaurants = await cursor.toArray();
            res.send(restaurants);
        })


    } finally {
        // await client.close()
    }
}
run().catch(console.dir())





app.get('/', (req, res) => {
    res.send('Running FoodiZone Server');
});
app.listen(port, () =>{
    console.log("Running port on", port)
})