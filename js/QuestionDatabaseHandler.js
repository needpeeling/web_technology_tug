const filesys = require('fs');

module.exports = {
    handleNewQuestion: function (questionTitle, questionDescription, user_id) {
        newQuestion(questionTitle, questionDescription, user_id);
    },
    getHighestLikedQuestions: function() {
        return findAmountAnswersWithHighestLikes(10);
    },
    getBestFittingW2VQuestions: function() {
        return findAmountAnswersWithHighestW2VValue(10);
    },
    getQuestionWithID: function(ID) {
        return findQuestionWithID(ID);
    },
    increaseScoreOfQuestion(ID) {
        if(filesys.existsSync('db/Questions.json')) {
            filesys.readFile('db/Questions.json', function (err, data) {
                var questions_json = JSON.parse(data);
                let question_body = questions_json[ID];
                question_body.Score = question_body.Score + 1;
                questions_json[ID] = question_body;
                filesys.writeFile('db/Questions.json', JSON.stringify(questions_json), function(err){
                    if (err) throw err;
                });
            })
        }
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
        while(iterator < Object.keys(questions_json).length && iterator < 50) { // Only look at first 50 entries
            if(questions_json[iterator] !== undefined) {
                result_obj.push({[iterator]:questions_json[iterator].Score});
            }
            iterator++;
        }
        result_obj = result_obj.sort(function(a,b){return b[Object.keys(b)]-a[Object.keys(a)]})

        iterator = 0;
        let res = undefined;
        while(iterator < amount) {
            if(result_obj[iterator] !== undefined) {
                res = {[Object.keys(result_obj[iterator])[0]]:questions_json[Object.keys(result_obj[iterator])[0]]};
                result.push(res);
            }
            iterator++;
        }

        return result;
    } else {
        return undefined;
    }
}

function contains(arr, entry) {
    if(entry === undefined || arr === undefined) {
        return false;
    }
    let iterator = 0;
    while(iterator < Object.keys(arr).length) {
        if(arr[iterator][Object.keys(arr[iterator])].Title        === entry[Object.keys(entry)].Title        &&
           arr[iterator][Object.keys(arr[iterator])].Body         === entry[Object.keys(entry)].Body         &&
           arr[iterator][Object.keys(arr[iterator])].OwnerUserId  === entry[Object.keys(entry)].OwnerUserId  &&
           arr[iterator][Object.keys(arr[iterator])].CreationDate === entry[Object.keys(entry)].CreationDate) {
            return true;
        }
        iterator++;
    }
    return false;
}

function findQuestionWithScore(score, start, questions_file) {
    if(filesys.existsSync('db/Questions.json') && score !== undefined) {
        let questions_json = questions_file;//JSON.parse(filesys.readFileSync('db/Questions.json'));
        let iterator = start;
        while(iterator < Object.keys(questions_json).length) {
            if(questions_json[iterator] !== undefined && questions_json[iterator].Score === score && iterator < 50) {
                return {[iterator]: questions_json[iterator]};
            }
            iterator++;
        }
    }
    return undefined;
}

function findQuestionWithID(id) {
    if(filesys.existsSync('db/Questions.json')) {
        let questions_json = JSON.parse(filesys.readFileSync('db/Questions.json'));
        return questions_json[id];
    }
    return undefined;
}

// Usage: findAllAnswersWithHighestLikes()
function findAllAnswersWithHighestLikes() {
    findAmountAnswersWithHighestLikes(100)
}

// Usage: findAmountAnswersWithHighestW2VValue(10)
// amount = How many results you want
function findAmountAnswersWithHighestW2VValue(amount) {
    if(filesys.existsSync('db/FileWithW2VValues.json') && filesys.existsSync('db/Questions.json')) {
        let result_obj = [];
        let result = [];
        let w2vv_json = JSON.parse(filesys.readFileSync('db/FileWithW2VValues.json'));
        let questions_json = JSON.parse(filesys.readFileSync('db/Questions.json'));
        let iterator = 0;
        while(iterator < Object.keys(w2vv_json).length && iterator < 50) { // Only look at first 50 entries (Performance)
            if(w2vv_json[iterator] !== undefined) {
                result_obj.push({[iterator]:w2vv_json[iterator].Score});
            }
            iterator++;
        }
        result_obj = result_obj.sort(function(a,b){return b[Object.keys(b)]-a[Object.keys(a)]})

        iterator = 0;
        let res = undefined;
        while(iterator < amount) {
            if(result_obj[iterator] !== undefined) {
                res = {[Object.keys(result_obj[iterator])[0]]:questions_json[Object.keys(result_obj[iterator])[0]]};
                result.push(res);
            }
            iterator++;
        }

        return result;
    } else {
        return undefined;
    }
}

// Usage: findAllAnswersWithHighestLikes()
function findAllAnswersWithHighestW2VValue() {
    findAmountAnswersWithHighestW2VValue(100)
}

