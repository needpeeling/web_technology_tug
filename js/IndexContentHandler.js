module.exports = {
    handleMostPopularQuestions: function (res) {

    },
    enableSearchResults: function (res) {
        let data = filesys.readFileSync(__dirname + '/index.html').toString();
        data = data.replace(/style=\"display: none\"/gi, "");
        res.setHeader("content-type", "text/html");
        return data;
    }
}