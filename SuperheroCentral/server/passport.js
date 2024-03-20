const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connection = mysql.createConnection({ //connect to the database by host user password, db name
    host: 'localhost',
    user: 'root',
    password: '3316Lab4',
    database: 'Lab4',
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database'); //print if the connection was made to the db
  });

  function initialize(passport) { //initialize passport function
    

    passport.use(new LocalStrategy({ //make a new local strategy
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, results) { //select the user for that specific email
          if (err) { 
            return done(err); 
          }
          if (results.length === 0) {  //no email 
            return done(null, false, { message: 'Incorrect email.' }); 
          }
          
          const hash = results[0].password.toString(); //hash the password
          bcrypt.compare(password, hash, function(err, response) { //compare the password using bcrypt
            if (response === true) { return done(null, results[0]); } //if matches return done with the result
            else { return done(null, false, { message: 'Incorrect password.' }); } //if doesnt match return incorrect password
          });
        });
      }
    ));
    
      passport.serializeUser(function(user, done) { //serialize user to store info in session
        done(null, user.email); //stores the users email
      });
    
      passport.deserializeUser(function(email, done) { //deserialize to retrive information from sesion
        connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, results) { //use the email that is stored in the session
          done(err, results[0]); //return the information retrieved
        });
      });
}

module.exports = { initialize, connection };
