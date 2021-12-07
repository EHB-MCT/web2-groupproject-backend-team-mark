const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

//Create the mongo client to use
const client = new MongoClient(process.env.MONGO_URL);

const app = express();
const port = process.env.PORT || 1337;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors())

//Root route
app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
});

// DONE Return all challenges from the database
app.get('/challenges', async (req, res) =>{

    try{
        //connect to the db
        await client.connect();

        //retrieve the challenges collection data
        const colli = client.db('session7').collection('challenges');
        const chs = await colli.find({}).toArray();

        //Send back the data with the response
    res.status(200).send(chs);
    }catch(error){
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    }finally {
        await client.close();
    }
});

// DONE /challenges/:id
app.get('/challenges/:id', async (req,res) => {
    //id is located in the query: req.params.id
    try{
        //connect to the db
        await client.connect();

        //retrieve the boardgame collection data
        const colli = client.db('session7').collection('challenges');

        //only look for a challenge with this ID
        const query = { _id: ObjectId(req.params.id)};

        const challenge = await colli.findOne(query);

        if(challenge){
            //Send back the file
              res.status(200).send(challenge);
            return;
        }else{
            res.status(400).send('Challenge could not be found with id: ' + req.params.id);
        }
      
    }catch(error){
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    }finally {
        await client.close();
    }
});

// save challenges
app.post('/challenges', async (req, res) => {

    if(!req.body.name || !req.body.course || !req.body.points){
        res.status(400).send('Bad request: missing name, course, or points');
        return;
    }

    try{
        //connect to the db
        await client.connect();

        //retrieve the boardgame collection data
        const colli = client.db('session7').collection('challenges');

        // Validation for double challenges
        const bg = await colli.findOne({name: req.body.name, course: req.body.course});
        if(bg){
            res.status(400).send(`Bad request: Challenge already exists with name ${req.body.name} for course ${req.body.course}`);
            return;
        } 
        // Create the new Challenge object
        let newChallenge = {
            name: req.body.name,
            course: req.body.course,
            points: req.body.points
        }
        //Add optional session field
        if(req.body.session){
          newChallenge.session = req.body.session;
        }
        // Insert into the database
        let insertResult = await colli.insertOne(newChallenge);
        //let insertResult = await colli.delete(newChallenge);

        //Send back successmessage
    res.status(201).json(newChallenge);
        return;
    }catch(error){
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    }finally {
        await client.close();
    }
});

//Update challenge
app.put('/challenges/:id', async (req,res) => {
  res.send('UPDATE OK');
});

// delete challenge
app.delete('/challenges/:id', async (req,res) => {
    //res.send('DELETE OK');
    if(!req.body.name || !req.body.course || !req.body.points){
        res.status(400).send('Bad request: missing name, course, or points');
        return;
    }

    try{
        //connect to the db
        await client.connect();

        //retrieve the boardgame collection data
        const colli = client.db('session7').collection('challenges');

        // Validation for double challenges
        const bg = await colli.findOne({name: req.body.name, course: req.body.course});
        if(bg){
            res.status(400).send(`Bad request: Challenge already exists with name ${req.body.name} for course ${req.body.course}`);
            return;
        } 
        // Create the new Challenge object
        let newChallenge = {
            name: req.body.name,
            course: req.body.course,
            points: req.body.points
        }
        //Add optional session field
        if(req.body.session){
          newChallenge.session = req.body.session;
        }
        // Insert into the database
        //let insertResult = await colli.insertOne(newChallenge);
        let insertResult = await colli.delete(newChallenge);

        //Send back successmessage
        res.send('DELETE OK');
        return;
    }catch(error){
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    }finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
})




// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser')
// const port = 3000

// app.use(express.static('public'));
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.redirect('/info.html');
// })

// app.get('/test', (req, res) =>{
//     res.send('test succeeded!')
// })

// app.get('/data', (req, res) => {
//     let exampleData = {
//         Team_name: 'Team Mark',
//         Members: 3
//     }
//     res.send(exampleData);
// });

// app.post('/saveData', (req, res) =>{
//   console.log(req.body);

//   res.send(`Data received with id: ${req.body.id}!`);
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

