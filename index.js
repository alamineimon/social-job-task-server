const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

const port = process.env.PORT || 9000;
require("dotenv").config();

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://socialmedia_user:IJsQUUIrkBV6YQdv@cluster0.juguzvf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // all Collenction
    const allPostCollection = client
      .db("SocialMedia_App")
      .collection("allpost");
    const allUsersCollection = client
      .db("SocialMedia_App")
      .collection("users");
 

    //featured e sports games
    app.get("/allpost", async (req, res) => {
      const query = {};
      const posts = await allPostCollection.find(query).toArray();
      res.send(posts);
    });   
    // post all user     
    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await allUsersCollection.insertOne(users);
      res.send(result);
  })
  // get all user
  app.get('/users', async (req, res) => {
      const query = {};
      const state = await allUsersCollection.find(query).toArray();
      res.send(state);
  })



  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (res, req) => {
  req.send("Social App  server is running");
});

app.listen(port, () => {
  console.log(`Social App Server running on port: ${port}`);
});
