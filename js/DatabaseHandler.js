const filesys = require('fs');
let id_counter = 0;

module.exports = {
    handleNewAnswer: function (answerTerm, user_id, parent_id) {
        newAnswer(answerTerm, user_id, parent_id);
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
    // Body         ... Answer Text (text)

    // -- JSON Object Building
    const answer_body = {
        "OwnerUserId":ownerUserId,
        "CreationDate":creationDate,
        "ParentId":parentId,
        "Score":score,
        "Body":text,
    };
    const answer = {
        [ID]: answer_body
    };
    const answer_data = JSON.stringify(answer);

    // -- Write Data to File
    if(filesys.existsSync('db/Answers.json')) {
        filesys.readFile('db/Answers.json', function (err, data) {
            var answers_json = JSON.parse(data);
            answers_json[ID] = answer_body;
            filesys.writeFile('db/Answers.json', JSON.stringify(answers_json), function(err){
                if (err) throw err;
                console.log("[DEBUG] New Answer added: " + text);
            });
        })
    } else {
        filesys.writeFile('db/Answers.json', answer_data, function(err){
            if (err) throw err;
            console.log("[DEBUG] New Answer added: " + text);
        });
    }
}

function findHighestMissingID() {
    if(filesys.existsSync('db/Answers.json')) {
        let answers_json = JSON.parse(filesys.readFileSync('db/Answers.json'));
        let iterator = 0;
        while(answers_json[iterator] !== undefined) {
            iterator++;
        }
        return iterator;
    } else {
        return 0;
    }
}

