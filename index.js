const express = require('express')

const ObjectId = require('mongodb').ObjectId
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();
const cors = require('cors')
const app = express()



const port = process.env.port || 5000;


app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.doleddt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {

    const database = client.db('elearning');
    const usercollection = database.collection('userdetails');
    const coursecollection = database.collection('courselist');
    //all course show details
    app.get('/coursedetails', async (req, res) => {
      const cursor = coursecollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

   
    //search individual course for individual email
    app.get('/coursedetails/email/:email', async (req, res) => {
      // console.log('hit')
      // console.log('hit',req.params.email)
      const email = req.params.email;
      const query = { email: email };
      const data = coursecollection.find(query);
      const result = await data.toArray();
      res.json(result);
    })
    //individual course details
    app.get('/coursedetails/:courseid', async (req, res) => {
      
      const id = req.params.courseid;
      const query = { _id: ObjectId(id) };
      const result = await coursecollection.findOne(query);
      res.json(result)
    })

     //for delete any course
     app.delete('/coursedetails/:id', async (req, res) => {
      
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await coursecollection.deleteOne(query);
      res.json(result);
    })
    //course information Details
    app.post('/coursedetails', async (req, res) => {
      const course = req.body;
      const result = await coursecollection.insertOne(course);
      res.json(result);
    })
    //update it for the admin side so that the course details will be shown in to the ui
    




    //identify teacher through role
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usercollection.findOne(query);
      let isteacher = false;
      if (user?.role === 'teacher') {
        isteacher = true;
      }
      res.json({ role: isteacher });
    })

    //specific user details
    app.get('/user', async (req, res) => {
      const email = req.query.search;
      const info = { email: email };
      //if any problem occuse hide is data part and open the result part
      // let data;
      // if (email) {
      //   data = await usercollection.findOne(info);
      // }
      // else {
      //   data = usercollection.find({}).toArray();
      // }
      const result = await usercollection.findOne(info)
      res.json(result)
      // res.json(data);
    })

    //for all user
    app.get('/user', async (req, res) => {
      const data = usercollection.find({});
      const result = await data.toArray();
      res.json(result)
    })


    //for insert  registeration information
    app.post('/user', async (req, res) => {
      const data = req.body;
      const result = await usercollection.insertOne(data);
      res.json(result)
    })
    //yet not use
    //this not yet use but this is for login in google for multiple use sign in
    app.put('/user', async (req, res) => {
      const data = req.body;
      const filter = { email: data.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      res.json(result);

    })
  }
  finally {
    // await client.close()
  }

}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example  ${port}`)
})