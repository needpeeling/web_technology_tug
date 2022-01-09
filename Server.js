// #####################################################################################################################
// ####                            Initialization                                                                   ####
// #####################################################################################################################
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const helpF      = require('./js/HelperFunctions');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/styles", express.static(__dirname + '/styles'));

// #####################################################################################################################
// ####                            Handling GET Requests                                                            ####
// #####################################################################################################################
app.get(['/', '/index*'], (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/about.html', (req, res) => {
    res.sendFile(__dirname + '/about.html')
})

app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.get('/new.html', (req, res) => {
    res.sendFile(__dirname + '/new.html')
})

app.get('/question*', (req, res) => {
    res.sendFile(__dirname + '/question.html')
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

// #####################################################################################################################
// ####                            Handling POST Requests                                                           ####
// #####################################################################################################################
app.post(['/', '/index*'], (req, res) => {
    if(helpF.handleSearch(req, false)) {}
    res.sendFile(__dirname + '/index.html');
})

app.post('/about.html', (req, res) => {
    if(helpF.handleSearch(req, false)) {}
    res.sendFile(__dirname + '/about.html');
})

app.post('/login.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleLogin(req, false)) {}
    res.sendFile(__dirname + '/login.html');
})

app.post('/register.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleRegister(req, false)) {}
    res.sendFile(__dirname + '/register.html');
})

app.post('/new.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleQuestion(req, false)) {}
    res.sendFile(__dirname + '/new.html')
})

app.post('/question*', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleAnswer(req, false)) {}
    res.sendFile(__dirname + '/question.html')
})

// #####################################################################################################################
// ####                            Starting Server                                                                  ####
// #####################################################################################################################
app.listen(port, () => {
    console.log(`QuestionOverflow-Server listening at http://localhost:${port}`)
})