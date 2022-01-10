const lrHandler = require('./LoginRegisterHandler')
const aDbHandler = require("./AnswerDatabaseHandler");

module.exports = {
    handleQuestionContent: function (data, question) {
        let username = lrHandler.getUserByID(question.OwnerUserId).Username;
        data = data.replace(/Insert Question Title/gi, question.Title);
        data = data.replace(/Insert Question Body/gi, question.Body);
        data = data.replace(/Insert User Name/gi, username);
        data = data.replace(/Insert Score/gi, question.Score);
        return data;
    },
    handleAnswerContent: function (data, question, question_id) {
        let username = lrHandler.getUserByID(question.OwnerUserId).Username;
        let result = aDbHandler.getAllAnswersWithQuestionID(question_id);
        let iterator = 0;
        let entries = "";
        data = data.replace(/<table class="answer_table">[\S\s.]*<\/table>/gi, "<table class=\"answer_table\"></table>");
        while(iterator < Object.keys(result).length) {
            let entry = createTableEntry(JSON.parse(result[iterator]));
            entries = entries + entry;
            iterator++;
        }
        data = data.replace(/<table class="answer_table"><\/table>/gi, "<table class=\"answer_table\">" + entries + "</table>");
        return data;
    }
}

function createTableEntry(s_res) {
    let score    = s_res[Object.keys(s_res)].Score;
    let body     = s_res[Object.keys(s_res)].Body;
    let username = lrHandler.getUserByID(s_res[Object.keys(s_res)].OwnerUserId).Username;

    return "            <tr>\n" +
        "                <td class=\"vote-td\">\n" +
        "                    <div class=\"vote\">\n" +
        "                        <div class=\"heart\"></div>\n" +
        "                    </div>\n" +
        "                    <div class=\"vote_count\">" + score + "</div>\n" +
        "                </td>\n" +
        "                <td class=\"answer-td\">\n" +
        "                    <p>" + body + "</p>\n" +
        "                    <p class=\"user\">written by <b>" + username + "</b></p>" +
        "                </td>\n" +
        "            </tr>";
}