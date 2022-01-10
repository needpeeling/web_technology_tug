const filesys    = require('fs');
const qDbHandler = require('./QuestionDatabaseHandler');

module.exports = {
    handleMostPopularQuestions: function (data) {
        //let result = qDbHandler.getHighesLikedQuestions();
        return data;
    },
    enableSearchResults: function () {
        let data = filesys.readFileSync(__dirname + '/../index.html').toString();
        data = data.replace(/style=\"display: none\"/gi, "");
        return data;
    }
}