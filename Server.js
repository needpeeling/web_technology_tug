// #####################################################################################################################
// ####                            Initialization                                                                   ####
// #####################################################################################################################
const express = require('express')
const app = express()
const port = 3000
const helpF       = require('./js/HelperFunctions');
const icHandler   = require('./js/IndexContentHandler');
const qcHandler   = require('./js/QuestionContentHandler');
const qDbHandler  = require('./js/QuestionDatabaseHandler');
const filesys     = require('fs');
const {promisify} = require('util');
const sleep       = promisify(setTimeout);

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let activeQuestion_id = -1;
let user_logged_in = false;

// #####################################################################################################################
// ####                            Handling GET Requests                                                            ####
// #####################################################################################################################
app.get(['/', '/index.html'], (req, res) => {
    let data = filesys.readFileSync(__dirname + '/index.html').toString();
    data = icHandler.handleMostPopularQuestions(data);
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.get('/new.html', (req, res) => {
    let data = filesys.readFileSync(__dirname + '/new.html').toString();
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    if(user_logged_in) {
        data = data.replace(/disabled/gi,"");
        data = data.replace(/Log In to Unlock!/gi,"Submit Question");
    }
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.get('/about.html', (req, res) => {
    let data = filesys.readFileSync(__dirname + '/about.html').toString();
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.get('/login.html', (req, res) => {
    let data = filesys.readFileSync(__dirname + '/login.html').toString();
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.get('/register.html', (req, res) => {
    let data = filesys.readFileSync(__dirname + '/register.html').toString();
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.get('/question*', (req, res) => {
    activeQuestion_id = req.url.replace("/question","");
    let question = qDbHandler.getQuestionWithID(activeQuestion_id);
    if(question === undefined) {
        let data = filesys.readFileSync(__dirname + '/404.html').toString();
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else {
        let data = filesys.readFileSync(__dirname + '/question.html').toString();
        data = qcHandler.handleQuestionContent(data, question, activeQuestion_id, user_logged_in);
        data = qcHandler.handleAnswerContent(data, question, activeQuestion_id, user_logged_in);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        data = qcHandler.handleRelatedContent(data);
        if(user_logged_in) {
            data = data.replace(/disabled/gi,"");
            data = data.replace(/Log In to Unlock!/gi,"Submit Answer");
        }
        res.setHeader("content-type", "text/html");
        res.send(data);
    }
})


app.use("/", express.static(__dirname + '/'));

app.get('/*', (req, res) => {
    let data = filesys.readFileSync(__dirname + '/404.html').toString();
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    res.setHeader("content-type", "text/html");
    res.send(data);
})


// #####################################################################################################################
// ####                            Handling POST Requests                                                           ####
// #####################################################################################################################
app.post(['/', '/index*'], (req, res) => {
    let data = filesys.readFileSync(__dirname + '/index.html').toString();
    if(helpF.handleSearch(req, true)) {
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleBestSuitingW2VQuestions(data, req.body.search2);
    } else if(req.body.logout !== undefined) {
        user_logged_in = false;
        helpF.resetUserID();
    } else {}
    data = icHandler.handleMostPopularQuestions(data);
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    res.setHeader("content-type", "text/html");
    res.send(data);
})

app.post('/about.html', (req, res) => {
    let skip = false;
    if(helpF.handleSearch(req, true)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleBestSuitingW2VQuestions(data, req.body.search2);
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
        skip = true;
    } else if(req.body.logout !== undefined) {
        user_logged_in = false;
        helpF.resetUserID();
    }
    if(!skip) {
        let data = filesys.readFileSync(__dirname + '/about.html').toString();
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    }
})

app.post('/login.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleBestSuitingW2VQuestions(data, req.body.search2);
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else if(helpF.handleLogin(req, true)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.handleMostPopularQuestions(data);
        user_logged_in = true;
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else if(req.body.logout !== undefined) {
        user_logged_in = false;
        helpF.resetUserID();
        let data = filesys.readFileSync(__dirname + '/login.html').toString();
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else {
        let data = filesys.readFileSync(__dirname + '/login.html').toString();
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    }
})

app.post('/register.html', (req, res) => {
    if(helpF.handleSearch(req, true)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleBestSuitingW2VQuestions(data, req.body.search2);
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else if(req.body.logout !== undefined) {
        user_logged_in = false;
        helpF.resetUserID();
        let data = filesys.readFileSync(__dirname + '/register.html').toString();
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else {
        let result = helpF.handleRegister(req, false)
        if(result === 0) {
            let data = filesys.readFileSync(__dirname + '/login.html').toString();
            data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
            res.setHeader("content-type", "text/html");
            res.send(data);
        } else if(result === 1) {
            let data = filesys.readFileSync(__dirname + '/index.html').toString();
            data = icHandler.handleMostPopularQuestions(data);
            data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
            res.setHeader("content-type", "text/html");
            res.send(data);
            user_logged_in = true;
        } else {
            let data = filesys.readFileSync(__dirname + '/register.html').toString();
            data = icHandler.enableSearchResults(data);
            data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
            res.setHeader("content-type", "text/html");
            res.send(data);
        }
    }
})

app.post('/new.html', (req, res) => {
    let skip = false;
    if(helpF.handleSearch(req, true)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleBestSuitingW2VQuestions(data, req.body.search2);
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
        skip = true;
    } else if(helpF.handleQuestion(req, true)) {}
    else if(req.body.logout !== undefined) {
        user_logged_in = false;
        helpF.resetUserID();
        let data = filesys.readFileSync(__dirname + '/new.html').toString();
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
        skip = true;
    }
    if(!skip) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    }
})

app.post('/question*', (req, res) => {
    if(helpF.handleSearch(req, true)) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = icHandler.enableSearchResults(data);
        data = icHandler.handleBestSuitingW2VQuestions(data, req.body.search2);
        data = icHandler.handleMostPopularQuestions(data);
        data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
        res.setHeader("content-type", "text/html");
        res.send(data);
    } else if(helpF.handleAnswer(req, true, activeQuestion_id)) {
        sleep(100).then(() => {
            handleQuestionPost(req, res);
        })
    } else if(helpF.handleClap(req, true)) {
        sleep(500).then(() => {
            handleQuestionPost(req, res);
        })
    } else if(req.body.logout !== undefined) {
        user_logged_in = false;
        helpF.resetUserID();
        handleQuestionPost(req, res);
    } else {
        handleQuestionPost(req, res);
    }
})

function handleQuestionPost(req, res) {
    activeQuestion_id = req.url.replace("/question","");
    let question = qDbHandler.getQuestionWithID(activeQuestion_id);
    let data = filesys.readFileSync(__dirname + '/question.html').toString();
    data = qcHandler.handleQuestionContent(data, question, activeQuestion_id, user_logged_in);
    data = qcHandler.handleAnswerContent(data, question, activeQuestion_id, user_logged_in);
    data = icHandler.handleLoginHeader(data,user_logged_in,helpF.getLoggedInUserID());
    if(user_logged_in) {
        data = data.replace(/disabled>Log In to Unlock!/gi,">Submit Answer");
    }
    res.setHeader("content-type", "text/html");
    res.send(data);
}

// #####################################################################################################################
// ####                            Starting Server                                                                  ####
// #####################################################################################################################
app.listen(port, () => {
    console.log(`[DEBUG]QuestionOverflow-Server listening at http://localhost:${port}`)
})