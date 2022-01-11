const filesys    = require('fs');
const qDbHandler = require('./QuestionDatabaseHandler');
const lrHandler  = require('./LoginRegisterHandler');

module.exports = {
    handleMostPopularQuestions: function (data) {
        let result = qDbHandler.getHighesLikedQuestions();
        let iterator = 0;
        let entries = "";
        data = data.replace(/<h3>Most popular Questions<\/h3>[\S\s.]*<\/table>/gi, "<h3>Most popular Questions</h3></table>");
        while(iterator < Object.keys(result).length) {
            if(result[iterator] !== undefined) {
                let entry = createTableEntry(result[iterator]);
                entries = entries + entry;
            }
            iterator++;
        }
        data = data.replace(/<h3>Most popular Questions<\/h3><\/table>/gi, "<h3>Most popular Questions</h3>" + entries + "</table>");
        return data;
    },
    enableSearchResults: function (data) {
        data = data.replace(/style=\"display: none\"/gi, "");
        return data;
    },
    handleLoginHeader: function (data, logged_in, userID) {
        if(!logged_in) {
            return data;
        }
        let username = "undefined";
        if(userID !== -1 || userID !== undefined) {
            username = lrHandler.getUserByID(userID);
            if(username !== undefined) {
                username = username.Username;
            }
        }
        let logout_data = "" +
            "<div class=\"logout-container\">\n" +
            "    <small>Logged in as <b>" + username + "</b></small>\n" +
            "    <form action=\"\" method=\"POST\">\n" +
            "        <input type=\"hidden\" name=\"logout\" value=\"1\">\n" +
            "        <button type=\"submit\" id=\"logout_btn\"><img id=\"logout_icon\" src=\"icons/logout.png\" alt=\"Logout\" /></button>\n" +
            "    </form>\n" +
            "</div>"
        let replace_data = "<div class=\"login-container\">\r\n" +
            "                <a href=\"login.html\"><img id=\"login_icon\" src=\"icons/login.png\" alt=\"Login\" /></a>\r\n" +
            "            </div>";
        data = data.replace(replace_data, logout_data)
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