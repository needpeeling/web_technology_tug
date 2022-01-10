const filesys = require('fs');

module.exports = {
    handleNewAnswer: function (answerTerm, user_id, parent_id) {
        newAnswer(answerTerm, user_id, parent_id);
    },
    getAllAnswersWithQuestionID(ID) {
        return findAllAnswersWithParentID(ID);
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
        "Body":text
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
            console.log("[DEBUG][NF] New Answer added: " + text);
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

// Usage: findAmountAnswersWithParentID(2,5)
// amount   = How many results you want
// parentID = ID of Question you want the answers to
function findAmountAnswersWithParentID(amount, parentID) {
    if(filesys.existsSync('db/Answers.json')) {
        let result_obj = [];
        let answers_json = JSON.parse(filesys.readFileSync('db/Answers.json'));
        let iterator = 0;
        while(iterator < Object.keys(answers_json).length && Object.keys(result_obj).length < amount) {
            if(answers_json[iterator].ParentId === parentID) {
                const answer = {
                    [iterator]: answers_json[iterator]
                };
                const answer_data = JSON.stringify(answer);
                result_obj.push(answer_data);
            }
            iterator++;
        }
        return result_obj;
    } else {
        return undefined;
    }
}

// Usage: findAllAnswersWithParentID(5)
// ParentID = ID of Question
function findAllAnswersWithParentID(parentID) {
    return findAmountAnswersWithParentID(1000,parentID)
}

