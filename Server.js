// #####################################################################################################################
// ####                            Initialization                                                                   ####
// #####################################################################################################################
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const helpF      = require('./js/HelperFunctions');
const icHandler  = require('./js/IndexContentHandler');
const qcHandler  = require('./js/QuestionContentHandler');
const qDbHandler = require('./js/QuestionDatabaseHandler');
const filesys    = require('fs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


let activeQuestion_id = -1;
let user_logged_in = false;

// #####################################################################################################################
// ####                            Handling GET Requests                                                            ####
// #####################################################################################################################
app.get(['/', '/index.html'], (req, res) => {
    let data = filesys.readFileSync(__dirname + '/index.html').toString();
    data = icHandler.handleMostPopularQuestions(data);
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.get('/new.html', (req, res) => {
    let data = filesys.readFileSync(__dirname + '/new.html').toString();
    if(user_logged_in) {
        data = data.replace(/disabled>Log In to Unlock!/gi,">Submit Question");
    }
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.use("/", express.static(__dirname + '/'));

app.get('/about.html', (req, res) => {
    res.sendFile(__dirname + '/about.html')
})

app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.get('/question*', (req, res) => {
    activeQuestion_id = req.url.replace("/question","");
    let question = qDbHandler.getQuestionWithID(activeQuestion_id);
    if(question === undefined) {
        res.sendFile(__dirname + '/404.html')
    } else {
        let data = filesys.readFileSync(__dirname + '/question.html').toString();
        data = qcHandler.handleQuestionContent(data, question);
        data = qcHandler.handleAnswerContent(data, question, activeQuestion_id)
        if(user_logged_in) {
            data = data.replace(/disabled>Log In to Unlock!/gi,">Submit Answer");
        }
        res.setHeader("content-type", "text/html");
        res.send(data);
    }
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

// #####################################################################################################################
// ####                            Handling POST Requests                                                           ####
// #####################################################################################################################
app.post(['/', '/index*'], (req, res) => {
    let data = filesys.readFileSync(__dirname + '/index.html').toString();
    if(helpF.handleSearch(req, false)) {
        data = icHandler.enableSearchResults(data);
    } else {}
    data = icHandler.handleMostPopularQuestions(data);
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.post('/about.html', (req, res) => {
    if(helpF.handleSearch(req, false)) {}
    res.sendFile(__dirname + '/about.html');
})

app.post('/login.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleLogin(req, false)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.handleMostPopularQuestions(data);
        res.setHeader("content-type", "text/html");
        res.send(data);
        user_logged_in = true;
    }
    else {
        let data = filesys.readFileSync(__dirname + '/login.html').toString();
        data = icHandler.enableSearchResults(data);
        res.setHeader("content-type", "text/html");
        res.send(data);
    }
})

app.post('/register.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else {
        let result = helpF.handleRegister(req, false)
        if(result === 0) {
            res.sendFile(__dirname + '/login.html');
        } else if(result === 1) {
            let data = filesys.readFileSync(__dirname + '/index.html').toString();
            data = icHandler.handleMostPopularQuestions(data);
            res.setHeader("content-type", "text/html");
            res.send(data);
            user_logged_in = true;
        } else {
            let data = filesys.readFileSync(__dirname + '/register.html').toString();
            data = icHandler.enableSearchResults(data);
            res.setHeader("content-type", "text/html");
            res.send(data);
        }
    }
})

app.post('/new.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleQuestion(req, false)) {}
    let data = filesys.readFileSync(__dirname + '/index.html').toString();
    data = icHandler.handleMostPopularQuestions(data);
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.post('/question*', (req, res) => {
    if(helpF.handleSearch(req, true)) {}
    else if(helpF.handleAnswer(req, false, activeQuestion_id)) {}
    activeQuestion_id = req.url.replace("/question","");
    let question = qDbHandler.getQuestionWithID(activeQuestion_id);
    let data = filesys.readFileSync(__dirname + '/question.html').toString();
    data = qcHandler.handleQuestionContent(data, question);
    data = qcHandler.handleAnswerContent(data, question, activeQuestion_id)
    if(user_logged_in) {
        data = data.replace(/disabled>Log In to Unlock!/gi,">Submit Answer");
    }
    res.setHeader("content-type", "text/html");
    res.send(data);
})

// #####################################################################################################################
// ####                            Starting Server                                                                  ####
// #####################################################################################################################
app.listen(port, () => {
    console.log(`[DEBUG]QuestionOverflow-Server listening at http://localhost:${port}`)
})