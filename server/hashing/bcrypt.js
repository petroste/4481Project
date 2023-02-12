const bcrypt = require("bcryptjs");

const password = ""; // The password is going to come (be passed) from the user input in the password field of the sign in.
const saltRounds = 10;

export default function hashPw (password){
    bcrypt.genSalt(saltRounds, function (saltError, salt) {
        if (saltError) 
        {
          throw saltError
        } 
        else 
        {
          bcrypt.hash(password, salt, function(hashError, hash) {
            if (hashError) {
              throw hashError
            } else {
              // here handle the hash - return for comparison
              return(hash);
            }
          })
        }
      })
}

export default function compareHashes(userPw, dbPw)
{
    bcrypt.compare(userPw, dbPw, function(error, isMatch) {
        if (error)
        {
            throw error
        }
        else if (!isMatch)
        {
            // throw some kind of error
        }
        else
        {
            // match, successful comparison
        }

    })
}


