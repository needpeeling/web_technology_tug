const filesys    = require('fs');
const qDbHandler = require('./QuestionDatabaseHandler');

module.exports = {
    handleMostPopularQuestions: function (data) {
        let result = qDbHandler.getHighesLikedQuestions();
        let iterator = 0;
        let entries = "";
        data = data.replace(/<h3>Most popular Questions<\/h3>[\S\s.]*<\/table>/gi, "<h3>Most popular Questions</h3></table>");
        while(iterator < Object.keys(result).length) {
            let entry = createTableEntry(result[iterator]);
            entries = entries + entry;
            iterator++;
        }
        data = data.replace(/<h3>Most popular Questions<\/h3><\/table>/gi, "<h3>Most popular Questions</h3>" + entries + "</table>");
        return data;
    },
    enableSearchResults: function (data) {
        data = data.replace(/style=\"display: none\"/gi, "");
        return data;
    }
}

function createTableEntry(s_res) {
    let score = s_res[Object.keys(s_res)].Score;
    let title = s_res[Object.keys(s_res)].Title;
    let id    = Object.keys(s_res);

    return "            <tr>\n" +
        "                <td class=\"vote-td\">\n" +
        "                    <div class=\"vote\">\n" +
        "                        <div class=\"heart\"></div>\n" +
        "                    </div>\n" +
        "                    <div class=\"vote_count\">" + score + "</div>\n" +
        "                </td>\n" +
        "                <td class=\"question-td\" onclick=\"window.location='question" + id + "';\">\n" +
        "                    <p>" + title + "</p>\n" +
        "                </td>\n" +
        "            </tr>";
}