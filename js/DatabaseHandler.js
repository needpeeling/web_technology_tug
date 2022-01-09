const filesys = require('fs');

module.exports = {
    handleNewAnswer: function (answerTerm, user_id, parent_id) {
        newAnswer(answerTerm, user_id, parent_id);
        console.log("New Answer added: " + answerTerm);
        // TODO: Handle a new Answer
        // This means adding a new Answer to the Answer-Database and linking it to the Question
    },
    handleNewQuestion: function (questionTitle, questionDescription, user_id) {
        console.log("New questionTerm added: Title: " + questionTitle + " ,Description: " + questionDescription);
        // TODO: Handle a new Question
        // This means adding a new Question to the Question-Database
    }
}

function newAnswer(text, user_id, parent_id) {
    // -- Data Acquisation
    // Create JSON-Object which needs:
    // ID           ... ID of Answer
    let ID = findHighestMissingID();
    // OwnerUserId  ... ID of logged in User
    let ownerUserId = user_id;
    // CreationDate ... Date of Creation of Answer (Now)
    let creationDate = new Date().toISOString();
    // ParentId     ... ID of Question this Answer refers to
    let parentId = parent_id;
    // Score        ... Score of Answer (0 at begin)
    let score = 0;
    // Body         ... Answer Text
    let body = text;
}

function findHighestMissingID() {
   return 0; // TODO: Implement
}

