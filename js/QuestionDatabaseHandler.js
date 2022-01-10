const filesys = require('fs');

module.exports = {
    handleNewQuestion: function (questionTitle, questionDescription, user_id) {
        newQuestion(questionTitle, questionDescription, user_id);
    },
    getHighesLikedQuestions: function() {
        return findAmountAnswersWithHighestLikes(3);
    }
}

function newQuestion(title, desc, user_id) {
    // -- Data Acquisation
    // Create JSON-Object which needs:
    // ID           ... ID of Question
    let ID = findHighestMissingID();
    // OwnerUserId  ... ID of logged in User
    let ownerUserId = user_id;
    // CreationDate ... Date of Creation of Answer (Now)
    let creationDate = new Date().toISOString();
    // Score        ... Score of Answer (0 at begin)
    let score = 0;
    // Title        ... Question Title (title)
    // Body         ... Question Description (desc)

    // -- JSON Object Building
    const question_body = {
        "OwnerUserId":ownerUserId,
        "CreationDate":creationDate,
        "Score":score,
        "Title":title,
        "Body":desc
    };
    const question = {
        [ID]: question_body
    };
    const question_data = JSON.stringify(question);

    // -- Write Data to File
    if(filesys.existsSync('db/Questions.json')) {
        filesys.readFile('db/Questions.json', function (err, data) {
            var questions_json = JSON.parse(data);
            questions_json[ID] = question_body;
            filesys.writeFile('db/Questions.json', JSON.stringify(questions_json), function(err){
                if (err) throw err;
                console.log("[DEBUG] New Question added: " + title + " | " + desc);
            });
        })
    } else {
        filesys.writeFile('db/Questions.json', question_data, function(err){
            if (err) throw err;
            console.log("[DEBUG][NF] New Question added: " + title + " | " + desc);
        });
    }
}

function findHighestMissingID() {
    if(filesys.existsSync('db/Questions.json')) {
        let questions_json = JSON.parse(filesys.readFileSync('db/Questions.json'));
        let iterator = 0;
        while(questions_json[iterator] !== undefined) {
            iterator++;
        }
        return iterator;
    } else {
        return 0;
    }
}

// Usage: findAmountAnswersWithHighestLikes(10)
// amount   = How many results you want
function findAmountAnswersWithHighestLikes(amount) {
    if(filesys.existsSync('db/Questions.json')) {
        let result_obj = [];
        let result = [];
        let questions_json = JSON.parse(filesys.readFileSync('db/Questions.json'));
        let iterator = 0;
        while(iterator < Object.keys(questions_json).length) {
            result_obj.push(questions_json[iterator].Score);
            iterator++;
        }
        result_obj = result_obj.sort(function(a,b){return b-a})

        iterator = 0;
        let res     = undefined;
        let old_res = undefined;
        while(iterator < amount) {
            old_res = res;
            res = findQuestionWithScore(result_obj[iterator],0);

            if(res.body === old_res.body) {
                res = findQuestionWithScore(result_obj[iterator], res.id)
            }

            result.push(res);
            iterator++;
        }
        console.log(result);
        return result;
    } else {
        return undefined;
    }
}

function findQuestionWithScore(score, start) {
    if(filesys.existsSync('db/Questions.json')) {
        let questions_json = JSON.parse(filesys.readFileSync('db/Questions.json'));
        let iterator = start;
        while(iterator < Object.keys(questions_json).length) {
            if(questions_json[iterator].Score === score) {
                return {[iterator]: questions_json[iterator]};
            }
            iterator++;
        }
    }
    return undefined;
}

// Usage: findAllAnswersWithHighestLikes()
function findAllAnswersWithHighestLikes() {
    findAmountAnswersWithHighestLikes(1000)
}

// Usage: findAmountAnswersWithHighestW2VValue(10)
// amount = How many results you want
function findAmountAnswersWithHighestW2VValue() {
    // TODO: Implement
}

// Usage: findAllAnswersWithHighestLikes()
function findAllAnswersWithHighestW2VValue() {
    findAmountAnswersWithHighestW2VValue(1000)
}

