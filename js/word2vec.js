const fs = require('fs');
const w2v = require('word2vec');

// processes a string for the corpus
function preprocess(originalString) {
    let nonspecialstring = originalString.replace(/[^a-zA-z0-9<> ]/g, '');
    let string_without_html = nonspecialstring.replace(/<[a-zA-z0-9 ]+>/g, "").replace(/<\/[a-zA-z0-9 ]+>/g, "").replace(/ +/g, " ");
    let processedString = string_without_html.toLowerCase();
    return processedString;
}

//InputFile ist eine .Json datei und outputFile eine .txt datei
//Nimmt den text(Body) aus der json datei, verarbeitet ihn und erstellt das outputFile daraus
function createCorpus(inputFile, outputFile) {
    fs.readFile(inputFile, function (err, data) {
        if (err) throw err;
        var questions_json = JSON.parse(data);
        let json_ids = Object.keys(questions_json);
        let max_id = json_ids[json_ids.length-1];
        console.log(max_id);
        let iterator = 0;
        let text_string = "";
        while(iterator <= max_id) {
            if(questions_json[iterator] !== undefined) {
                let question_body = questions_json[iterator];
                question_body.Body = preprocess(question_body.Body);
                text_string += question_body.Body + "\n";
            }
            iterator++;
        }
        fs.writeFile(outputFile, text_string, function(err) {
            if (err) throw err;
        });
    })
}

createCorpus("./db/Questions.json", './db/corpus.txt');
w2v.word2vec("./db/corpus.txt", "./db/word_vectors.txt");