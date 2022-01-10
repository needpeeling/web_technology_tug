const fs = require('fs');

module.exports = {
    handleLoginAttempt: function (username, password) {
        console.log("Login Attempt with username: " + username + " and password: " + password);
        let user_id = findUserID(username);
        if (user_id == -1) {
            console.log("[DEBUG] User " + username + " is not in Database");
            return -1
        } else {
            let password_check = passwordCheck(user_id, password);
            if (password_check == 1) {
                console.log("[DEBUG] User " + username + " logged in successfully");
                return user_id;
            } else {
                console.log("[DEBUG] User " + username + " has wrong password");
                return -1;
            }
        }
        return 4;
        // TODO: Handle the Login request
        // This means checking the credential database if username exists and password is correct
        // Returns -1 when failed
        // Returns user_id when successful
    },
    handleRegisterAttempt: function (username, password, password_confirmation) {
        console.log("Register Attempt with username: " + username + " ,password: " + password +
                    " and password-confirmation: " + password_confirmation);
        if (registerCheck(username) == 1) {
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

        // TODO: Handle the Register request
        // This means checking the credential database if username exists and then adding a new map entry
    }
}

function highestMissingUserID() {
    if(fs.existsSync('db/Users.json')) {
        let users_json = JSON.parse(fs.readFileSync('db/Users.json'));
        let iterator = 0;
        while (users_json[iterator] != undefined) {
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
        while (users_json[iterator] != undefined) {
            if (users_json[iterator].Username == username) {
                return 0;
            }
            iterator++;
        }
        return 1;
    } else {
        return 1;
    }
}

function findUserID(username) {
    if(fs.existsSync('db/Users.json')) {
        let users_json = JSON.parse(fs.readFileSync('db/Users.json'));
        let iterator = 0;
        while (users_json[iterator] != undefined) {
            if (users_json[iterator].Username == username) {
                return iterator;
            }
            iterator++;
        }
        return -1;
    } else {
        return -1;
    }
}

function passwordCheck(user_id, password) {
    let users_json = JSON.parse(fs.readFileSync('db/Users.json'));
    if (users_json[user_id].Password == password) {
        return 1;
    } else {
        return 0;
    }
}