const fs = require('fs');

module.exports = {
    handleLoginAttempt: function (username, password) {
        console.log("Login Attempt with username: " + username + " and password: " + password);
        return 4;
        // TODO: Handle the Login request
        // This means checking the credential database if username exists and password is correct
        // Returns -1 when failed
        // Returns user_id when successful
    },
    handleRegisterAttempt: function (username, password, password_confirmation) {
        if (registerCheck(username) === 1) {
            let ID = highestMissingUserID();
            const userdata = {
                "Username":username,
                "Password":password
            };
            const user = {
                [ID]: userdata
            };
            const user_data = JSON.stringify(user);

            if(fs.existsSync('db/Users.json')) {
                fs.readFile('db/Users.json', function (err, data) {
                    var users_json = JSON.parse(data);
                    users_json[ID] = userdata;
                    fs.writeFile('db/Users.json', JSON.stringify(users_json), function(err){
                        if (err) throw err;
                        console.log("[DEBUG] New User added: " + username);
                    });
                })
            } else {
                fs.writeFile('db/Users.json', user_data, function(err){
                    if (err) throw err;
                    console.log("[DEBUG] New User added: " + username);
                });
            }
        } else {
            console.log("[DEBUG] Username already in Database");
        }
    }
}

function highestMissingUserID() {
    if(fs.existsSync('db/Users.json')) {
        let users_json = JSON.parse(fs.readFileSync('db/Users.json'));
        let iterator = 0;
        while (users_json[iterator] !== undefined) {
            iterator++;
        }
        return iterator;
    } else {
        return 0;
    }
}

function registerCheck(username) {
    if(fs.existsSync('db/Users.json')) {
        let users_json = JSON.parse(fs.readFileSync('db/Users.json'));
        let iterator = 0;
        while (users_json[iterator] !== undefined) {
            if (users_json[iterator].Username === username) {
                return 0;
            }
            iterator++;
        }
        return 1;
    } else {
        return 1;
    }
}