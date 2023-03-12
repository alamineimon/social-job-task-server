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
 

    //post all post
    app.post('/allpost', async (req, res) => {
      const users = req.body;
      const result = await allPostCollection.insertOne(users);
      res.send(result);
  })
    //get all post
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

      // user Profile Update
      app.get("/profileUpdate/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await allUsersCollection.findOne(query);
        res.send(user);
      });
  
      app.patch("/profileUpdate/:id", async (req, res) => {
        const id = req.params.id;
        const profile = req.body;
        const query = { _id: ObjectId(id) };
        const option = { upsert: true };
        const updateDoc = {
          $set: {
            name: profile.name,
            email: profile.email,
            photoURL: profile.photoURL,
            facebook: profile.facebook,
            instagram: profile.instagram,
            youTube: profile.youTube,
            twitter: profile.twitter,
            bio: profile.bio,
          },
        };
        const result = await allUsersCollection.updateOne(query, updateDoc, option);
        res.send(result);
      });
  



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
