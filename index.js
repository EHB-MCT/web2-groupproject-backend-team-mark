const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/info.html');
})

app.get('/test', (req, res) =>{
    res.send('test succeeded!')
})

app.get('/data', (req, res) => {
    let exampleData = {
        name: 'Attila',
        age: 23
    }
    res.send(exampleData);
});

app.post('/saveData', (req, res) =>{
  console.log(req.body);
  
  res.send('Data received!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

