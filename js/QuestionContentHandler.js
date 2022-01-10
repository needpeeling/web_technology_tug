const lrHandler = require('./LoginRegisterHandler')

module.exports = {
    handleQuestionContent: function (data, question) {
        let user_e = lrHandler.getUserByID(question.OwnerUserId);
        data = data.replace(/Insert Question Title/gi, question.Title);
        data = data.replace(/Insert Question Body/gi, question.Body);
        data = data.replace(/Insert User Name/gi, user_e.Username);
        data = data.replace(/Insert Score/gi, question.Score);
        return data;
    }
}