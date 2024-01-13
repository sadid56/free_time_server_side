const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 9000;
const app = express();

//1JL7A5691jeHQNKX
//free_time

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://free_time:1JL7A5691jeHQNKX@cluster0.dzbhwpo.mongodb.net/?retryWrites=true&w=majority`;
// console.log(process.env.DB_PASS);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // console.log(client);
    // collectoins
    const feedsCollection = client.db("free_time").collection("feeds");
    const profileCollection = client.db("free_time").collection("profiles");
    const videosCollection = client.db("free_time").collection("videos");
    const reeelsCollection = client.db("free_time").collection("reels");
    const notificationsCollection = client.db("free_time").collection("notifications");
    const postSavedCollection = client.db("free_time").collection("save-post");
    const playlistCollection = client.db("free_time").collection("playlist");

    //*operations
    //feeds related
    app.post("/feeds", async(req, res)=>{
      const post = req.body;
      const result = await feedsCollection.insertOne(post)
      res.send(result)
    })

    app.patch("/feeds/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const post = req.body;
      const updatePost = {
        $set:{
          article: post?.article,
        }
      }
      const result = await feedsCollection.updateOne(filter, updatePost)
      res.send(result)
    })

    app.delete("/feeds/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await feedsCollection.deleteOne(filter)
      res.send(result)
    })

   

    app.get("/feeds", async (req, res) => {
      let query = {}
      if(req?.query?.email){
        query = {email: req?.query?.email}
      }
      const result = await feedsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/feeds/likes/:postId", async(req, res)=>{
      const postId = req.params.postId;
      const post = await feedsCollection.findOne({_id:new ObjectId(postId)})
      if(!post){
        return res.status(404).send({message: "post not found"})
      }
      post.likes += 1
      await feedsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: post });

      // Send the updated post as the response
      res.json(post);
    })

    app.post("/feeds/comment/:id", async(req, res)=>{
      try{
        const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const commnet = req.body;
      const post = await feedsCollection.findOne(filter)
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      post?.comments.push(commnet)
      await feedsCollection.updateOne(filter, {$set:post})
      res.json(post)
      }catch(err){
        console.log('comment post err backend-->', err);
        res.status(500).send({ message: "Internal server error" });
      }
    })

    //profiles related
    app.post("/profiles", async(req, res)=>{
      const profile = req.body;
      const result = await profileCollection.insertOne(profile)
      res.send(result)
    })

    app.get("/profiles", async(req, res)=>{
      let query = {}
      if(req?.query?.email){
        query = {email:req?.query?.email}
      }
      const result = await profileCollection.find(query).toArray()
      res.send(result)
    })

    app.get("/profiles/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await profileCollection.findOne(query)
      res.send(result)
    })

    app.patch('/profiles/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const profile = req.body;
      const updateProfile = {
        $set:{
          bio:profile.bio,
          work: profile.work,
          home:profile.home,
          institute:profile.institute,
          relation:profile.relation,
          date_of_birth:profile.date_of_birth,
          social:profile.social
        }
      }
      const result = await profileCollection.updateOne(filter, updateProfile)
      res.send(result)

    })

    app.patch("/profile/cover/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const cover = req.body;
      const updateCover = {
        $set:{
          cover: cover.cover
        }
      }
      const result = await profileCollection.updateOne(filter, updateCover)
      res.send(result)
    })

    // video post relatred
    app.post('/videos', async(req,res)=>{
      const video = req.body;
      const result = await videosCollection.insertOne(video)
      res.send(result)
    })

    app.get('/videos', async(req, res)=>{
      let query = {}
      if(req?.query?.email){
        query = {email: req?.query?.email}
      }
      const result = await videosCollection.find(query).toArray()
      res.send(result)
    })
    app.post("/videos/likes/:postId", async(req, res)=>{
      const postId = req.params.postId;
      const post = await videosCollection.findOne({_id:new ObjectId(postId)})
      if(!post){
        return res.status(404).send({message: "videos not found"})
      }
      post.likes += 1
      await videosCollection.updateOne({ _id: new ObjectId(postId) }, { $set: post });

      // Send the updated post as the response
      res.json(post);
    })
    app.post("/videos/comment/:id", async(req, res)=>{
      try{
        const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const commnet = req.body;
      const post = await videosCollection.findOne(filter)
      if (!post) {
        return res.status(404).send({ message: "videos not found" });
      }
      post?.comments.push(commnet)
      await videosCollection.updateOne(filter, {$set:post})
      res.json(post)
      }catch(err){
        console.log('comment post err backend-->', err);
        res.status(500).send({ message: "Internal server error" });
      }
    })

    app.delete("/videos/:id",async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await videosCollection.deleteOne(filter)
      res.send(result)
    })

    // reels related
    app.post("/reels", async(req, res)=>{
      const reels = req.body;
      const result = await reeelsCollection.insertOne(reels)
      res.send(result)
    })
    app.get("/reels", async(req, res)=>{
       let query = {}
       if(req?.query?.email){
        query = {email: req?.query?.email}

       }
       const result = await reeelsCollection.find(query).toArray()
       res.send(result)
    })

    app.get("/reels/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await reeelsCollection.findOne(filter)
      res.send(result)
    })
    app.delete("/reels/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await reeelsCollection.deleteOne(filter)
      res.send(result)
    })

    app.post("/reels/comment/:id", async(req, res)=>{
      try{
        const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const commnet = req.body;
      const post = await reeelsCollection.findOne(filter)
      if (!post) {
        return res.status(404).send({ message: "videos not found" });
      }
      post?.comments.push(commnet)
      await reeelsCollection.updateOne(filter, {$set:post})
      res.json(post)
      }catch(err){
        console.log('comment post err backend-->', err);
        res.status(500).send({ message: "Internal server error" });
      }
    })
    
    app.post("/reels/likes/:postId", async(req, res)=>{
      const postId = req.params.postId;
      const post = await reeelsCollection.findOne({_id:new ObjectId(postId)})
      if(!post){
        return res.status(404).send({message: "feeds not found"})
      }
      post.likes += 1
      await reeelsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: post });

      // Send the updated post as the response
      res.json(post);
    })

    // notifications related
    app.post("/notification", async(req, res)=>{
      const notification = req.body;
      const result = await notificationsCollection.insertOne(notification)
      res.send(result)
    })
    app.get("/notification", async(req, res)=>{
      const result  = await notificationsCollection.find().toArray()
      res.send(result)
    })

    app.delete("/notification/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result= await notificationsCollection.deleteOne(filter)
      res.send(result)
    })

    // post save related
    app.post('/post-save', async(req, res)=>{
      const post = req.body;
      const result = await postSavedCollection.insertOne(post)
      res.send(result)
    })
    app.get('/post-save', async(req, res)=>{
      let query = {}
      if(req?.query?.email){
        query = {email: req?.query?.email}
      }
      const result = await postSavedCollection.find(query).toArray()
      res.send(result)
    })

    app.delete("/post-save/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await postSavedCollection.deleteOne(query)
      res.send(result)
    })
    // playlist related
    app.post('/playlist', async(req, res)=>{
      const post = req.body;
      const result = await playlistCollection.insertOne(post)
      res.send(result)
    })
    app.get('/playlist', async(req, res)=>{
      let query = {}
      if(req?.query?.email){
        query = {email: req?.query?.email}
      }
      const result = await playlistCollection.find(query).toArray()
      res.send(result)
    })

    app.delete("/playlist/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await playlistCollection.deleteOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("free time server is running");
});

app.listen(port, () => {
  console.log(`Server response ${port}`);
});
