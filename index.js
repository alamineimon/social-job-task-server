const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const allUsersCollection = client.db("SocialMedia_App").collection("users");

    //post all post
    app.post("/allpost", async (req, res) => {
      const users = req.body;
      const result = await allPostCollection.insertOne(users);
      res.send(result);
    });
    //get all post
    app.get("/allpost", async (req, res) => {
      const query = {};
      const posts = await allPostCollection.find(query).toArray();
      res.send(posts);
    });
    // post all user
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await allUsersCollection.insertOne(users);
      res.send(result);
    });
    // // get all user
    // app.get("/users", async (req, res) => {
    //   const query = {};
    //   const state = await allUsersCollection.find(query).toArray();
    //   res.send(state);
    // });


    // get all user by id
    app.get("/users/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = { email: userEmail };
      const user = await allUsersCollection.findOne(query);
      res.send(user);
    });


    //post like button
    app.put("/allpost/like/:id", async (req, res) => {
      const userEmail = req.query.email;
      const postId = req.params.id;
      //find the post
      const query = {
        _id: new ObjectId(postId),
      };
      const query2 = {
        _id:new ObjectId(postId),
        likes: { $all: [userEmail] },
      };
      const exist = await allPostCollection.findOne(query2);

      if (!exist) {
        const updatedDoc = {
          $inc: { quantity: 1 },
          $push: {
            likes: userEmail,
          },
        };
        const options = { upsert: true };
        const result = await allPostCollection.updateOne(
          query,
          updatedDoc,
          options
        );
        return res.send(result);
      }
      const updatedDoc = {
        $inc: { quantity: -1 },
        $pull: {
          likes: userEmail,
        },
      };
      const options = { upsert: true };
      const result = await allPostCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //post like button
    // app.put("/posts/like/:id", async (req, res) => {
    //   const userEmail = req.query.email;
    //   const postId = req.params.id;
    //   //find the post
    //   const query = { _id: ObjectId(postId) };
    //   const query2 = { _id: ObjectId(postId), likes: { $all: [userEmail] } };
    //   const exist = await allPostCollection.findOne(query2);
    //   if (!exist) {
    //     const updatedDoc = {
    //       $inc: { quantity: 1 },
    //       $push: {
    //         likes: userEmail,
    //       },
    //     };
    //     const options = { upsert: true };
    //     const result = await allPostCollection.updateOne(
    //       query,
    //       updatedDoc,
    //       options
    //     );
    //     return res.send(result);
    //   }
    //   const updatedDoc = {
    //     $inc: { quantity: -1 },
    //     $pull: {
    //       likes: userEmail,
    //     },
    //   };
    //   const options = { upsert: true };
    //   const result = await allPostCollection.updateOne(
    //     query,
    //     updatedDoc,
    //     options
    //   );
    //   res.send(result);
    // });
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
