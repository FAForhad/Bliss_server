const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c3txqlb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db("bliss").collection("products");

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
      let quary = {};
      if (req.query.category === "women") {
        quary = {
          category: req.query.category,
        };
      }
      const result = await productCollection.find(quary).toArray();
      res.send(result);

      console.log(result);
    });

    app.get("/productMen", async (req, res) => {
      let quary = {};
      if (req.query.category === "men") {
        quary = {
          category: req.query.category,
        };
      }
      const result = await productCollection.find(quary).toArray();
      res.send(result);

      console.log(result);
    });
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
