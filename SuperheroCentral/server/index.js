const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const fs = require('fs')
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { initialize, connection } = require('./passport');
initialize(passport)
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const levenshtein = require('js-levenshtein');
const validator = require('validator');
app.use(cors());
let superHeroInfoData;
let superHeroPowers;
let superheroLists = [];


fs.readFile('./server/superhero_info.json', 'utf-8', (err, data) => { //reads the info file
  if (err) {
    console.error(err) //consoles the error if it cant read it
    return;
  }
  superHeroInfoData = JSON.parse(data) //sets the data to superHeroInfoData
});
fs.readFile('./server/superhero_powers.json', 'utf-8', (err, data) => { //reads the powers file
  if (err) { // error if it happens
    console.error(err)
    return;
  }
  superHeroPowers = JSON.parse(data) //sets the data to superHeroPowers
});

app.use(
  session({
    secret: 'ggsdg',
    resave: false,
    saveUninitialized: false
  })
)
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', express.static('client')); //uses static for 'client' folder

app.use((req, res, next) => { //simplified methof for logging requests
  console.log(`${req.method} request for ${req.url}`)
  next();
})
app.use('/api/superheroinfo', router) //router so you dont have to keep repeating in the api's


router.get('/publishers', (req, res) => { //returns all the publishers
  const allPublishers = superHeroInfoData.map(superhero => superhero.Publisher);
  const uniquePublishers = [...new Set(allPublishers)]; //finds only unique publishers not repeated 
  res.json(uniquePublishers);
});
router.get('/search', (req, res) => { //updated search api
  const { name, race, power, publisher, n } = req.query;

  const regex = /^[\p{L}\p{N}\s-]+$/u;
  const numberRegex = /^(800|[1-7][0-9]{0,2}|[0-9][0-9]{0,1})?$/;

  if (!numberRegex.test(n)) { //check that the number regex matches
    return res.status(400).json({ error: 'Invalid entries' });
  }

  // Validate and sanitize input patterns
  const sanitizePattern = (pattern) => {
    return pattern && pattern.length < 30 ? pattern.trim().toLowerCase() : null;
  };

  const namePattern = sanitizePattern(name);
  const racePattern = sanitizePattern(race);
  const powerPattern = sanitizePattern(power);
  const publisherPattern = sanitizePattern(publisher);

  if (!regex.test(namePattern) && !regex.test(racePattern) && !regex.test(powerPattern) && !regex.test(publisherPattern)) { //if none of them then say invalid entries
    return res.status(400).json({ error: 'Invalid entries' });
  }

  // helper function for fuzzy matching using Levenshtein distance
  const isFuzzyMatch = (pattern, value) => {
    return pattern && value && levenshtein(pattern, value) <= 2;
  };

  // Filter superheroes based on fuzzy patterns
  const foundMatches = superHeroInfoData.filter(superhero => {
    const nameMatch = namePattern ? superhero.name.trim().toLowerCase().startsWith(namePattern) || isFuzzyMatch(namePattern, superhero.name.trim().toLowerCase()) : true;
    const raceMatch = racePattern ? superhero.Race.trim().toLowerCase().startsWith(racePattern) || isFuzzyMatch(racePattern, superhero.Race.trim().toLowerCase()) : true;
    const publisherMatch = publisherPattern ? superhero.Publisher.trim().toLowerCase().startsWith(publisherPattern) || isFuzzyMatch(publisherPattern, superhero.Publisher.trim().toLowerCase()) : true;

    let powerMatch = true;
    if (powerPattern) { //filter differntly if its power
      const matchingHeroes = superHeroPowers.filter(hero => {
        return Object.keys(hero).some(key => hero[key].toLowerCase() === "true" && key.toLowerCase() === powerPattern.toLowerCase());
      });

       powermatch = matchingHeroes.map(hero => hero.hero_names);
    }

    return nameMatch && raceMatch && powerMatch && publisherMatch; //return all the matches
  });

  if (n && foundMatches.length > n) { //slice the results based on n
    res.json(foundMatches.slice(0, n));
  } else {
    res.json(foundMatches);
  }
});


router.get('/:superIDs', (req, res) => {
  const ids = req.params.superIDs.split(',');

  // Validate each ID individually
  const validIDs = ids.every(id => {
    const numberRegex = /^(800|[1-7][0-9]{0,2}|[0-9][0-9]{0,1})?$/;
    return numberRegex.test(id) && id.length <= 3;
  });

  if (!validIDs) {
    return res.status(400).json({ error: 'Invalid ID entry' });
  }

  // Find superhero info for each ID
  const superheroInfoArray = ids.map(id => {
    const superhero = superHeroInfoData.find(p => p.id === parseInt(id));
    if (!superhero) {
      return { id: parseInt(id), error: `Super hero ${id} does not exist` };
    }

    // Find powers for the superhero
    const powers = superHeroPowers
      .filter(hero => hero.hero_names === superhero.name)
      .map(hero => {
        // Extract powers with a value of "True"
        return Object.entries(hero)
          .filter(([power, value]) => power !== 'hero_names' && value === 'True')
          .map(([power]) => power);
      })
      .flat();

    return { ...superhero, powers };
  });

  res.json(superheroInfoArray);
});

router.get('/:superID/powers', (req, res) => { //finds powers based on ID
  const id = req.params.superID;
  const numberRegex = /^(800|[1-7][0-9]{0,2}|[0-9][0-9]{0,1})?$/;
  if (numberRegex.test(id) && id.length <= 3) { //same input sanitization
    const superheroInfo = superHeroInfoData.find(p => p.id === parseInt(id));
    if (!superheroInfo) { //returns error if superhero info not found
      res.status(404).send(`Super hero ${id} does not exist`)
    }
    const superName = superheroInfo.name;
    let powers = superHeroPowers.find(p => p.hero_names == superName); //finds the matching name

    if (!powers) {
      res.status(404).send(`Super hero powers ${id} does not exist`)
    }

    res.send(powers) //returns the powers of that superhero
  } else {
    res.status(400).json({ error: 'Invalid ID entry' });

  }
})

router.post('/lists', (req, res) => { //post request for creating a list
  const listName = req.body.name;
  const regex = /^[\p{L}\s-]+$/u;
  if (regex.test(listName) && listName.length < 20) {
    if (listName && !superheroLists[listName]) { //if listname and name doesnt already exists
      superheroLists[listName] = [];

      res.status(201).json({ message: 'Superhero list created successfully' });//list success
    } else {
      res.status(400).json({ error: 'List name already exists or is invalid' });
    }
  } else {
    res.status(400).json({ error: 'Invalid name entry' });
  }
});

router.put('/lists/:listName', (req, res) => { //adding ID's of superheroes to a list
  const listName = req.params.listName;
  const newSuperheroIDs = req.body.superheroIDs;
  const numberRegex = /^(800|[1-7][0-9,]+|[0-9][0-9]{0,1})$/;
  if (numberRegex.test(newSuperheroIDs)) {
    if (listName && superheroLists[listName] !== undefined) {
      superheroLists[listName] = newSuperheroIDs; // Replace the list
      console.log(superheroLists[listName])
      res.status(200).json({ message: 'Superhero list updated successfully' });
    } else {
      res.status(400).json({ error: 'List name does not exist or is invalid' });
    }
  } else {
    res.status(400).json({ error: 'Invalid ID entry' });
  }
});
router.get('/lists/:listName', (req, res) => { //gets the id's of a list
  const listName = req.params.listName;
  const regex = /^[\p{L}\s-]+$/u;
  if (regex.test(listName) && listName.length < 20) {
    if (listName && superheroLists[listName] !== undefined) {
      const superheroIDs = superheroLists[listName]; //gets the id's in a list


      res.status(200).json({ superheroIDs });
    } else {
      res.status(400).json({ error: 'List name does not exist or is invalid' }); //returns if list does not exist
    }
  } else {
    res.status(400).json({ error: 'Invalid Name entry' });

  }
});

router.delete('/lists/:listName', (req, res) => { //removing a list 
  const listName = req.params.listName;
  const regex = /^[\p{L}\s-]+$/u;
  if (regex.test(listName) && listName.length < 20) {//same input sanitization
    if (listName && superheroLists[listName] !== undefined) { //if the list name is valid and exists in the list
      delete superheroLists[listName]; //removes it
      res.status(200).json({ message: 'Superhero list deleted successfully' }); //returns the status
    } else {
      res.status(400).json({ error: 'List name does not exist or is invalid' });
    }
  } else {
    res.status(400).json({ error: 'Invalid Name entry' });
  }
});

router.get('/lists/:listName/superheroes', (req, res) => { //getting the info for all the id's in a list
  const listName = req.params.listName;
  const regex = /^[\p{L}\s-]+$/u;
  if (regex.test(listName) && listName.length < 20) { //same input validition
    if (!superheroLists[listName]) { //if the listName is not in the list
      return res.status(404).json({ error: 'List not found' });
    }

    const superheroIDs = superheroLists[listName];// gets the ids
    const superheroesWithPowers = superHeroInfoData
      .filter(superhero => superheroIDs.includes(superhero.id))
      .map(superhero => ({
        ...superhero,
        powers: superHeroPowers.find(p => p.hero_names === superhero.name), //matching names 
      }));

    res.json(superheroesWithPowers);
  } else {
    res.status(400).json({ error: 'Invalid Name entry' });
  }
});

app.post('/login', function (req, res, next) { //login api
  passport.authenticate('local', function (err, user, info) { //use the passport authenticate function 
    if (err) { return next(err); }
    if (!user) { return res.status(401).send(info.message); }

    req.logIn(user, function (err) {
      if (err) { return next(err); }

      const userEmail = user.email;  //get the user email, admin state, verified state, disabled state
      const isAdmin = user.isAdmin
      const verified = user.verified
      const disabled = user.isDisabled
      return res.json({
        message: 'User logged in', //return this as the message
        email: userEmail, //return all the values of the fields
        isAdmin: isAdmin,
        isVerified: verified,
        isDisabled: disabled
      });
    });
  })(req, res, next);
});

app.post('/register', (req, res) => { //registeration api
  const { email, password, nickname } = req.body;

  if (!validator.isEmail(email)) { //validate the email is in the right format using validator library
    return res.status(400).send('Invalid email format');
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], function (err, results) { //select the row from the table where the email matches
    if (err) throw err;
    if (results.length > 0) { //if this row exists it means the user has already registered under this email
      console.log("email in use")
      res.status(400).send('Email already registered');
    } else {
      bcrypt.hash(password, 10, (err, hash) => { //hash the password
        if (err) throw err;

        const token = crypto.randomBytes(64).toString('hex'); //create their verification token

        connection.query('INSERT INTO users SET ?', { email: email, password: hash, nickname: nickname, verificationToken: token }, (err, result) => { //insert the information to the users table
          if (err) throw err;

          const transporter = nodemailer.createTransport({ //create the gmail transporter using nodemailer
            service: 'gmail',
            auth: {
              user: 'moa75574@gmail.com', //fill email info 
              pass: 'inxu mrcp nhek yzdv'
            }
          });
          const mailOptions = { //send the mail from the gmail 
            from: 'moa75574@gmail.com',
            to: email,
            subject: 'Please verify your email', //set the subject line
            text: `Your verification token is: ${token}` //and the body
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) throw err;
            res.status(201).send('User registered. A verification email has been sent.');  //return that user has been registered an an email has been sent 
          });
        });
      });
    }
  });
});

app.get('/verify-email', function (req, res) { //function for verifying an email
  const token = req.query.token;
  console.log(`Received token: ${token}`);  // log the received token
  connection.query('UPDATE users SET verified = 1 WHERE verificationToken = ?', [token], function (err, results) { //update the user to being verified
    if (err) {
      console.error(err);  
      throw err;
    }
    console.log(`Updated rows: ${results.affectedRows}`);  
    res.send('Email verified'); //send that the email has been verified
  });
});
app.post('/resendVerificationEmail', (req, res) => { //api for resending the verification email
  const { email } = req.body;

  connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, results) { //select the user
    if (err) throw err;
    if (results.length === 0) {
      return res.status(400).send('Email not found'); //return email not found if no results get returned
    } else {
      const token = crypto.randomBytes(64).toString('hex');

      connection.query('UPDATE users SET verificationToken = ? WHERE email = ?', [token, email], (err, result) => { //update the verification token
        if (err) throw err;

        const transporter = nodemailer.createTransport({ //use nodemailer to send the email same as before
          service: 'gmail',
          auth: {
            user: 'moa75574@gmail.com',
            pass: 'inxu mrcp nhek yzdv'
          }
        });
        const mailOptions = {
          from: 'moa75574@gmail.com',
          to: email,
          subject: 'Please verify your email',
          text: `Your verification token is: ${token}`
        };
        transporter.sendMail(mailOptions, function(err, info) {
          if (err) throw err;
          res.send('A verification email has been sent.'); //return that the email has been sent
        });
      });
    }
  });
});

app.post('/update-password', (req, res) => { //api for updating password
  const { email, newPassword } = req.body; //get the email and new password from the req body

  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => { //select the user that matches the email
    if (err) throw err;
    if (results.length === 0) {
      res.send('Email does not exist'); //return email does not exist if no user matches that email
    } else {
      bcrypt.hash(newPassword, 10, (err, hash) => { //hash the new password
        if (err) throw err;

        connection.query('UPDATE users SET password = ? WHERE email = ?', [hash, email], (err, result) => { //update the users password with the new password hashed
          if (err) throw err;
          res.send('Password updated');
        });
      });
    }
  });
});
app.get('/public-hero-lists', (req, res) => { //api for getting public hero lists
  const query = 'SELECT * FROM HeroLists WHERE visibility = "public"'; //select lists that have visibility as public
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching public hero lists:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results); //return the lists
    }
  });
});

app.post('/create-list', (req, res) => { //api for creating a list
  const { name, description, superHeros, creatorEmail, creatorNickname, averageRating, visibility } = req.body; //get the list info from the body
  const superIDs = superHeros.split(',');
  connection.query('SELECT COUNT(*) AS listCount FROM herolists WHERE creatorEmail = ?', [creatorEmail], (err, results) => { //query for the count of the user lists
    if (results[0].listCount >= 20) { //check if the user has more than 20 lists already
      return res.status(400).json({ message: 'You have created the max of 20 lists.' });
    }
  });

  for(i = 0; i<superIDs.length; i++){ //loop for the checking that all superhero id's entered acctually exist
    if(!superHeroInfoData[superIDs[i]]){
      console.log("cant do this")
      return res.status(400).json({message: `superhero ID ${superIDs[i]} does not exist`}) //if one of them doesnt return which one does not exist
    }
  }
  const query = `INSERT INTO HeroLists (name, description, superHeros, creatorEmail, creatorNickname, averageRating, visibility) 
                   SELECT ?, ?, ?, ?, ?, ?, ?
                   WHERE NOT EXISTS (
                     SELECT 1 FROM HeroLists WHERE name = ?
                   )`; //query of inserting the list information in the list table

  connection.query(query, [name, description, superHeros, creatorEmail, creatorNickname, averageRating, visibility, name], (err, result) => {
    if (result.affectedRows === 0) {
      res.status(400).json({message: 'List name already exists'}); //if the list table doesnt get changed, means the list name already exists
    } else {
      res.status(201).send('Hero list created successfully'); //otherwise return 201 that the list was created succesfully
    }
  });
});

app.get('/getNickname', (req, res) => { //api for getting nickname
  const { email } = req.query;


  const query = 'SELECT nickname FROM users WHERE email = ?'; //select nickname for a specific email

  connection.query(query, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    if (result.length === 0) { //if no user with that email then user does not exist
      return res.status(404).send('User not found');
    }

    res.json({ nickname: result[0].nickname }); //return the nickname
  });
});
app.get('/getMyLists', (req, res) => { //api for getting a specific users lists
  const userEmail = req.query.email;

  const query = 'SELECT * FROM HeroLists WHERE creatorEmail = ?'; //get lists where the email matches

  connection.query(query, [userEmail], (err, results) => {
    if (err) { //error handling
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.status(200).json(results); ///return 200 and the all the lists the user has
    }
  });
});


app.put('/update-lists', async (req, res) => { //api for updating a list
  const { name, description, superHeros, visibility } = req.body; //get the new updated list info from the request body
  const query = 'UPDATE HeroLists SET description = ?, superHeros = ?, visibility = ? WHERE name = ?' //query for updating a list
  const superIDs = superHeros.split(',');
  for(i = 0; i<superIDs.length; i++){ //same for loop to check whether the superhero id's all exist
    if(!superHeroInfoData[superIDs[i]]){ //if the id is not in the superher info
      console.log("cant do this")
      return res.status(400).json({message: `superhero ID ${superIDs[i]} does not exist`}) //return that the id does not exist
    }
  }

  connection.query(query, [description, superHeros, visibility, name], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else if (result.affectedRows === 0) {
      res.status(400).send('Name doesnt match'); 
    } else {
      res.status(201).send('Hero list updated successfully'); //send 201 that list was updated
    }
  });

});
app.delete('/delete-list', (req, res) => {  //api for deleting a list
  const listName = req.body.name;

  if (!listName) {
    return res.status(400).json({ success: false, message: 'List name is required' }); //if no list name then send that the list name is needed
  }

  const sql = 'DELETE FROM HeroLists WHERE name = ?'; //query for deleting a lsit

  connection.query(sql, [listName], (err, result) => {
    if (err) {
      console.error('Error deleting list:', err); //error handling
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: 'List deleted successfully' }); //return list deleted if there was an affected row
    } else {
      return res.status(404).json({ success: false, message: 'List not found' }); //otherwise list is not found
    }
  });
});
app.post('/add-review', (req, res) => { //api for adding a review
  const { listName, rating, comment, reviewer_email } = req.body; //get the info from the request body

  if (!listName || !rating || !reviewer_email) {
    return res.status(400).json({ success: false, message: 'Invalid input. Please provide listName, rating, and reviewer_email.' }); //if rating list anme or email missing
  }

  const query = 'INSERT INTO heroReviews (listName, rating, comment, reviewer_email) VALUES (?, ?, ?, ?)'; //query for inserting intto hero reviews table
  const values = [listName, rating, comment, reviewer_email];

  connection.query(query, values, (error, results) => {
    if (error) { //error handling
      console.error('Error inserting review:', error);
      return res.status(500).json({ success: false, message: 'Error inserting review.' });
    }

    return res.status(200).json({ success: true, message: 'Review added successfully.' }); //return 200 that review was added
  });
});
app.get('/reviews/:listName', (req, res) => { //api for getting reviews for a specific list
  const { listName } = req.params;

  const query = 'SELECT * FROM heroReviews WHERE listName = ? AND isHidden = 0'; //ensure that the review is not hidden
  connection.query(query, [listName], (error, results) => {
    if (error) { //error handling
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ success: false, message: 'Error fetching reviews.' });
    }

    return res.status(200).json(results); //return the reviews for that list
  });
});
app.get('/users', (req, res) => { //api for fetching all the users
  const query = 'SELECT * FROM users'; //get all the users

  connection.query(query, (err, result) => {
    if (err) { //error handling
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    res.json(result); //return the whole users table
  });
});
app.get('/hero-reviews', (req, res) => { //api for getting all hero reviews
  const query = 'SELECT * FROM heroReviews';

  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    res.json(result); //return the hero reviews table
  });
});
app.get('/hero-lists', (req, res) => { //api for getting all the hero lists
  const query = 'SELECT * FROM heroLists';

  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    res.json(result); //return the hero lists table
  });
});

app.post('/make-admin', (req, res) => { //api for making a user an admin
  const { email } = req.body;

  if (!email) { //if no email of the user return that email is needed
    return res.status(400).send('Email parameter is required');
  }

  const query = 'UPDATE users SET isAdmin = 1 WHERE email = ?'; //update the admin state

  connection.query(query, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    res.json({ success: true }); //return that the the user was made an admin
  });
});



app.get('/api/policy/:type', (req, res) => { //getting the content of a policy document by type
  const { type } = req.params;
  const query = 'SELECT content FROM policies WHERE type = ?'; //query for getting the content of a policy by type
  connection.query(query, [type], (err, result) => {
    if (err) { //error handling 
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    if (result.length === 0) { //if the type does not exist
      return res.status(404).send('Policy not found');
    }
    res.json({ content: result[0].content }); //return the content of the policy
  });
});
app.put('/api/update-policy/:type', (req, res) => { //api for updating policy content
  const { type } = req.params;
  const { content } = req.body;
  const query = 'UPDATE policies SET content = ? WHERE type = ?'; //query to update the content of a specific policy type
  connection.query(query, [content, type], (err, result) => {
    if (err) {//error handling
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    if (result.affectedRows === 0) { //if the type was not found
      return res.status(404).send('Policy not found');
    }
    res.send('Policy updated successfully'); //return success
  });
});
app.get('/api/policy-pages', (req, res) => { //retrieving all the policy pages
  const query = 'SELECT * FROM policies';

  connection.query(query, (err, result) => { 
    if (err) { //error handling
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    res.json(result); //return all the policy pages table
  });
});

app.post('/api/insert-dmca-entry', (req, res) => {
  const { reviewId, dateRequestReceived, dateNoticeSent, dateDisputeReceived, notes } = req.body; //get the info from the request body

  const sql = 'INSERT INTO dmca_entries (review_id, date_request_received, date_notice_sent, date_dispute_received, notes) VALUES (?, ?, ?, ?, ?)'; //insert statement
  const values = [ //values of the information thats being inserted
    reviewId,
    new Date(dateRequestReceived),
    new Date(dateNoticeSent),
    new Date(dateDisputeReceived),
    notes
  ];
  connection.query(sql, values, (err, result) => {
    if (err) { //error handling
      console.error('Error inserting DMCA entry:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('DMCA entry inserted successfully');
      res.status(200).send('DMCA entry inserted successfully'); //return that the dmca entry was added successfully
    }
  });
});


app.post('/disable-account', (req, res) => { //api for disabling an account
  const { email } = req.body;

  const sql = 'UPDATE users SET isDisabled = 1 WHERE email = ?'; //update the disabled column for a user

  connection.query(sql, [email], (error, results) => {
    if (error) { //error handling
      console.error('Error disabling account:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ success: true, message: `Account for ${email} disabled successfully` }); //reurn wchich email has been disabled
  });
});
app.post('/enable-account', (req, res) => { //same as disable account but for enabling
  const { email } = req.body;

  const sql = 'UPDATE users SET isDisabled = 0 WHERE email = ?';

  connection.query(sql, [email], (error, results) => {
    if (error) {
      console.error('Error enabling account:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ success: true, message: `Account for ${email} enabled successfully` });
  });
});

app.post('/unhide-review', (req, res) => { //same as disabling account but for unhiding review
  const { reviewId } = req.body;

  const sql = 'UPDATE heroreviews SET isHidden = 0 WHERE id = ?';

  connection.query(sql, [reviewId], (error, results) => {
    if (error) {
      console.error('Error unhiding review:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ success: true, message: `Review with ID ${reviewId} unhidden successfully` });
  });
});

app.post('/hide-review', (req, res) => { //same as disabling account but for hiding review
  const { reviewId } = req.body;

  const sql = 'UPDATE heroreviews SET isHidden = 1 WHERE id = ?';

  connection.query(sql, [reviewId], (error, results) => {
    if (error) {
      console.error('Error hiding review:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ success: true, message: `Review with ID ${reviewId} hidden successfully` });
  });
});


app.listen(port, () => { //listening on port 3000 
  console.log(`Listening on port ${port}`);
});
