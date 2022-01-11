const lrHandler = require('./LoginRegisterHandler')
const aDbHandler = require("./AnswerDatabaseHandler");

module.exports = {
    handleQuestionContent: function (data, question, questionID, logged_in) {
        let username = lrHandler.getUserByID(question.OwnerUserId);
        if(username !== undefined) {
            username = username.Username;
        }
        data = data.replace(/Insert Question Title/gi, question.Title);
        data = data.replace(/Insert Question Body/gi, question.Body);
        data = data.replace(/Insert User Name/gi, username);
        data = data.replace(/Insert Score/gi, question.Score);
        data = handleQuestionClap(data, questionID, logged_in);
        return data;
    },
    handleAnswerContent: function (data, question, question_id, logged_in) {
        let result = aDbHandler.getAllAnswersWithQuestionID(question_id);
        let iterator = 0;
        let entries = "";
        data = data.replace(/<table class="answer_table">[\S\s.]*<\/table>/gi, "<table class=\"answer_table\"></table>");
        while(iterator < Object.keys(result).length) {
            let entry = createTableEntry(JSON.parse(result[iterator]), logged_in);
            entries = entries + entry;
            iterator++;
        }
        data = data.replace(/<table class="answer_table"><\/table>/gi, "<table class=\"answer_table\">" + entries + "</table>");
        return data;
    }
}
function handleQuestionClap(data, questionID, logged_in) {
    let disabled = "";
    if(!logged_in) {
        disabled = "disabled";
    }
    let heart_data = "                        <form action=\"\" method=\"POST\">\n" +
        "                           <input type=\"hidden\" name=\"questionID\" value=\"" + questionID + "\">" +
        "                           <button type=\"submit\" class=\"heart\" style='border:none' " + disabled + "></button>\n" +
        "                        </form>\n"
    data = data.replace("<div class=\"heart\"></div>", heart_data);
    return data;
}

function createTableEntry(s_res, logged_in) {
    let score    = s_res[Object.keys(s_res)].Score;
    let body     = s_res[Object.keys(s_res)].Body;
    let username = lrHandler.getUserByID(s_res[Object.keys(s_res)].OwnerUserId).Username;
    let answerID = Object.keys(s_res)[0];
    let disabled = "";
    if(!logged_in) {
        disabled = "disabled";
    }

    return "            <tr>\n" +
        "                <td class=\"vote-td\">\n" +
        "                    <div class=\"vote\">\n" +
        "                        <form action=\"\" method=\"POST\">\n" +
        "                           <input type=\"hidden\" name=\"answerID\" value=\"" + answerID + "\">" +
        "                           <button type=\"submit\" class=\"heart\" style='border:none' " + disabled + "></button>\n" +
        "                        </form>\n" +
        "                    </div>\n" +
        "                    <div class=\"vote_count\">" + score + "</div>\n" +
        "                </td>\n" +
        "                <td class=\"answer-td\">\n" +
        "                    <p>" + body + "</p>\n" +
        "                    <p class=\"user\">written by <b>" + username + "</b></p>" +
        "                </td>\n" +
        "            </tr>";
}