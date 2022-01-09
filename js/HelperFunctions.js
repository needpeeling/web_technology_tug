const sqHandler  = require('./SearchQueryHandler');
const dbHandler = require('./DatabaseHandler');
const lrHandler = require('./LoginRegisterHandler')

module.exports = {
    handleSearch: function (req, more) {
        let searchTerm = req.body.search2;
        if(searchTerm !== undefined) {
            sqHandler.handleSearchQuery(searchTerm);
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return false;
        }
        return true;
    },
    handleQuestion: function (req, more) {
        let questionTitle = req.body.title;
        let questionDescr = req.body.description;
        if(questionTitle !== undefined && questionDescr !== undefined) {
            dbHandler.handleNewQuestion(questionTitle, questionDescr);
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return false;
        }
        return true;
    },
    handleAnswer: function (req, more) {
        let answerTerm = req.body.myanswer;
        if(answerTerm !== undefined) {
            dbHandler.handleNewAnswer(answerTerm);
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return false;
        }
        return true;
    },
    handleLogin: function (req, more) {
        let username = req.body.username;
        let password = req.body.psw;
        if(username !== undefined && password !== undefined) {
            lrHandler.handleLoginAttempt(username, password);
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return false;
        }
        return true;
    },
    handleRegister: function (req, more) {
        let username = req.body.username;
        let password = req.body.psw;
        let pwd_conf = req.body.psw_repeat;
        if(username !== undefined && password !== undefined && pwd_conf !== undefined) {
            lrHandler.handleRegisterAttempt(username, password, pwd_conf);
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return false;
        }
        return true;
    }
}