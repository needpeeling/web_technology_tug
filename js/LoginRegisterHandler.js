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
        console.log("Register Attempt with username: " + username + " ,password: " + password +
                    " and password-confirmation: " + password_confirmation);
        // TODO: Handle the Register request
        // This means checking the credential database if username exists and then adding a new map entry
    }
}