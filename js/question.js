const fs = require('fs');

/*let user_login_status = false;

module.exports = {
  setLoginStatus: function(new_status) {
    user_login_status = new_status;
  }
}*/

for (const btn of document.querySelectorAll('.heart')) {
    btn.addEventListener('click', event => {
        // Get Log In Status

        data = fs.readFileSync('./db/Logstatus.txt').toString();
        alert(data);
        if (data == 'True') {
          event.currentTarget.classList.toggle('is-active');
        }
      });
    }


