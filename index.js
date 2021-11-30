const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect('/info.html');
})

app.get('/test', (req, res) =>{
    res.send('test succeeded!')
})

app.get('/data', (req, res) => {
    let exampleData = {
        Team_name: 'Team Mark',
        Members: 3
    }
    res.send(exampleData);
});

app.post('/saveData', (req, res) =>{
  console.log(req.body);

  res.send(`Data received with id: ${req.body.id}!`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

