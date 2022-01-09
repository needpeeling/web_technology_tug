module.exports = {
    handleNewAnswer: function (answerTerm) {
        console.log("New Answer added: " + answerTerm);
        // TODO: Handle a new Answer
        // This means adding a new Answer to the Answer-Database and linking it to the Question
    },
    handleNewQuestion: function (questionTitle, questionDescription) {
        console.log("New questionTerm added: Title: " + questionTitle + " ,Description: " + questionDescription);
        // TODO: Handle a new Question
        // This means adding a new Question to the Question-Database
    }
}
