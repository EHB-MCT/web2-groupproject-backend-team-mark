const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

//Create the mongo client to use
const client = new MongoClient(process.env.MONGO_URL);

const app = express();
const port = process.env.PORT || 1337;

app.use(express.static('public'));
app.use(bodyParser.json());


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
        const query = { _id: req.params.id };

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

    // if(!req.body.bggid || !req.body.name || !req.body.genre || !req.body.mechanisms
    //     || !req.body.description){
    //     res.status(400).send('Bad request: missing id, name, genre, mechanisms or description');
    //     return;
    // }

    // try{
    //     //connect to the db
    //     await client.connect();

    //     //retrieve the boardgame collection data
    //     const colli = client.db('session5').collection('boardgames');

    //     // Validation for double boardgames
    //     const bg = await colli.findOne({bggid: req.body.bggid});
    //     if(bg){
    //         res.status(400).send('Bad request: boardgame already exists with bggid ' + req.body.bggid);
    //         return;
    //     } 
    //     // Create the new boardgame object
    //     let newBoardgame = {
    //         bggid: req.body.bggid,
    //         name: req.body.name,
    //         genre: req.body.genre,
    //         mechanisms: req.body.mechanisms,
    //         description: req.body.description
    //     }
        
    //     // Insert into the database
    //     let insertResult = await colli.insertOne(newBoardgame);

    //     //Send back successmessage
    res.status(201).send(`Boardgame succesfully saved with name ${req.body.name}`);
    //     return;
    // }catch(error){
    //     console.log(error);
    //     res.status(500).send({
    //         error: 'Something went wrong',
    //         value: error
    //     });
    // }finally {
    //     await client.close();
    // }
});

//Update challenge
app.put('/challenges/:id', async (req,res) => {
  res.send('UPDATE OK');
});

// delete challenge
app.delete('/challenges/:id', async (req,res) => {
  res.send('DELETE OK');
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

