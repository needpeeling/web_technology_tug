const express = require('express')
const app = express()
const port = 3000

app.use("/styles", express.static(__dirname + '/styles'));

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(__dirname + '/index.html');
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

app.get('/question', (req, res) => {
    res.sendFile(__dirname + '/question.html')
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})