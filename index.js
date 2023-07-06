const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mxnk8qu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("bliss").collection("products");
    const orderCollection = client.db("bliss").collection("orders");
    const usersCollection = client.db("bliss").collection("users");

    // product collection
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/productWomen", async (req, res) => {
      const categories = req.query.category;

      let query = {};
      if (categories && Array.isArray(categories)) {
        query = {
          category: { $in: categories },
        };
      } else if (categories) {
        query = {
          category: categories,
        };
      }

      const result = await productCollection.find(query).sort({ time: -1 }).toArray();
      res.send(result);
      console.log(result);
    });
    app.get("/productMen", async (req, res) => {
      const categories = req.query.category;

      let query = {};
      if (categories && Array.isArray(categories)) {
        query = {
          category: { $in: categories },
        };
      } else if (categories) {
        query = {
          category: categories,
        };
      }

      const result = await productCollection.find(query).sort({ time: -1 }).toArray();
      res.send(result);
      console.log(result);
    });

    app.delete("/allproduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/allproducts", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // USER COLLECTION

    app.get('/admin/allusres/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const result = await usersCollection.findOne(query)
      res.send(result);
      console.log(result);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const result = await usersCollection.findOne(query)
      res.send(result);
      console.log(result);
    })

    app.post("/users", async (req, res) => {
      const query = req.body;
      const result = await usersCollection.insertOne(query);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/verifyuser/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          isVerifyed: status,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    app.delete("/allusers/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });


    // ORDERS COLLECTIONS

    app.post("/order", async (req, res) => {
      const product = req.body;
      const result = await orderCollection.insertOne(product);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query).sort({ time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.findOne(query);
      res.send(result);
    });

    app.delete("/allorders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });


    //
  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("bliss server is running");
});

app.listen(port, () => {
  console.log(`app is running in port ${port}`);
});
