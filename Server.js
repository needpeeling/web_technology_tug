// #####################################################################################################################
// ####                            Initialization                                                                   ####
// #####################################################################################################################
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const helpF      = require('./js/HelperFunctions');
const icHandler  = require('./js/IndexContentHandler');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/", express.static(__dirname + '/'));

let activeQuestion_id = -1;
let user_logged_in = 0;

// #####################################################################################################################
// ####                            Handling GET Requests                                                            ####
// #####################################################################################################################
app.get(['/', '/index.html'], (req, res) => {
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
    activeQuestion_id = 5; // TODO: Set ID for active Question
    res.sendFile(__dirname + '/question.html')
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

// #####################################################################################################################
// ####                            Handling POST Requests                                                           ####
// #####################################################################################################################
app.post(['/', '/index*'], (req, res) => {
    if(helpF.handleSearch(req, false)) {
        let data = icHandler.enableSearchResults(res);
        res.send(data);
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.post('/about.html', (req, res) => {
    if(helpF.handleSearch(req, false)) {}
    res.sendFile(__dirname + '/about.html');
})

app.post('/login.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleLogin(req, false)) {
        res.sendFile(__dirname + '/index.html');
        user_logged_in = 1; 
    }
    else {res.sendFile(__dirname + '/login.html');}
})

app.post('/register.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else {
        let result = helpF.handleRegister(req, false)
        if(result === 0) {
            res.sendFile(__dirname + '/login.html');
        } else if(result === 1) {
            res.sendFile(__dirname + '/index.html');
        } else {
            res.sendFile(__dirname + '/register.html');
        }
    }
})

app.post('/new.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleQuestion(req, false)) {}
    res.sendFile(__dirname + '/new.html')
})

app.post('/question*', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleAnswer(req, false, activeQuestion_id)) {}
    res.sendFile(__dirname + '/question.html')
})

// #####################################################################################################################
// ####                            Starting Server                                                                  ####
// #####################################################################################################################
app.listen(port, () => {
    console.log(`QuestionOverflow-Server listening at http://localhost:${port}`)
})