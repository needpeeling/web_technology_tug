const express = require('express')
const app = express()
const port = 3000

app.use("/styles", express.static(__dirname + '/styles'));

app.get(['/', '/index*'], (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post(['/', '/index*'], (req, res) => {
    res.sendFile(__dirname + '/index.html'); // TODO: Handle Search Query
})

app.get('/about.html', (req, res) => {
    res.sendFile(__dirname + '/about.html')
})

app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/new.html', (req, res) => {
    res.sendFile(__dirname + '/new.html')
})

app.post('/new.html', (req, res) => {
    res.sendFile(__dirname + '/new.html') // TODO: Handle new Question
})

app.get('/question*', (req, res) => {
    res.sendFile(__dirname + '/question.html')
})

app.post('/question*', (req, res) => {
    res.sendFile(__dirname + '/question.html') // TODO: Handle new Answer
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})