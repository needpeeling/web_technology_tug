const sqHandler  = require('./SearchQueryHandler');
const aDbHandler = require('./AnswerDatabaseHandler');
const qDbHandler = require('./QuestionDatabaseHandler');
const lrHandler = require('./LoginRegisterHandler')

let user_id = -1;

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
            qDbHandler.handleNewQuestion(questionTitle, questionDescr, user_id);
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return false;
        }
        return true;
    },
    handleAnswer: function (req, more, activeQuestion_id) {
        let answerTerm = req.body.myanswer;
        if(answerTerm !== undefined) {
            aDbHandler.handleNewAnswer(answerTerm, user_id, activeQuestion_id);
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
        console.log("username: " + username + " , password: " + password);
        if(username !== undefined && password !== undefined) {
            user_id = lrHandler.handleLoginAttempt(username, password);
            if(user_id === -1) {
                return false;
            }
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
            if (password === pwd_conf) {
               lrHandler.handleRegisterAttempt(username, password);
            } else {
                return -1;
            }
        } else if (username !== undefined && password !== undefined && pwd_conf === undefined) {
            user_id = lrHandler.handleLoginAttempt(username, password);
            if(user_id !== -1) {
                return 1;
            }
            return 0;
        } else if(!more) {
            console.log("[DEBUG] Invalid Body!")
        } else {
            return -1;
        }
        return 0;
    }
}