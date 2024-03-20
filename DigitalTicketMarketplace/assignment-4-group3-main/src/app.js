const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

//For requests
const requestsRouter = require('./routes/requests')
const adminReqRouter = require('./routes/admin_requests')


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join('src', 'views')));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//For requests
app.use('/requests', requestsRouter)
app.use('/admin/handle_requests', adminReqRouter)


//MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3316Lab4',
    database: 'stadiumdb'
});

//Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

//const clientPath = path.join('src', 'server');
//app.use('/', express.static(path.join('src', '/server')));

//const clientPath = path.join('src', 'server', 'views');

function generateTicketID(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'TX';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//this function checks to ensure the seat exists, is in the correct stadium and is available
function getSeatInfoAndPrice(eventID, seatID){
    return new Promise((resolve, reject) => {
        let basePrice, seatNumber, rowNumber, sectionNumber, rowMultiplier, sectionMultiplier;

        //Define all queries

        let checkIfTicketExistsSQL = `SELECT COUNT(*) AS count FROM Ticket
                                    WHERE eventID = ? 
                                    AND seatID = ? 
                                    AND valid = 1;`;

        let getStadiumNameSQL = `SELECT name FROM Stadium 
                                WHERE stadiumID = (
                                SELECT stadiumID FROM Event
                                WHERE eventID = ?)`

        let getEventInfoSQL = `SELECT eventID, name, DATE_FORMAT(date, '%W, %M %e, %Y') AS date, basePrice, stadiumID FROM Event WHERE eventID = ?`;

        let getSeatNumberSQL = `SELECT seatID, seatNumber FROM Seat WHERE seatID = ?`;

        let getSectionInfoSQL = `SELECT sectionNumber, sectionMultiplier, stadiumID FROM Section WHERE sectionID = (
                                SELECT sectionID FROM SectionRow WHERE sectionRowID = (
                                SELECT sectionRowID FROM Seat WHERE seatID = ?))`;

        let getRowInfoSQL =     `SELECT rowNumber, rowMultiplier, stadiumID FROM stadrow WHERE rowID = (
                                SELECT rowID FROM SectionRow WHERE sectionRowID = (
                                SELECT sectionRowID FROM Seat WHERE seatID = ?))`;

        const findOtherTicketsPromise = new Promise((resolve, reject) => {
            db.query(checkIfTicketExistsSQL, [eventID, seatID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        getStadiumNamePromise = new Promise((resolve, reject) => {
            db.query(getStadiumNameSQL, [eventID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
                                    
        const eventInfoPromise = new Promise((resolve, reject) => {
            db.query(getEventInfoSQL, [eventID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const seatNumberPromise = new Promise((resolve, reject) => {
            db.query(getSeatNumberSQL, [seatID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const sectionInfoPromise = new Promise((resolve, reject) => {
            db.query(getSectionInfoSQL, [seatID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const rowInfoPromise = new Promise((resolve, reject) => {
            db.query(getRowInfoSQL, [seatID], (err, result) => {
                if (err) reject(err);
                else resolve(result)
            });
        });

        Promise.all([findOtherTicketsPromise, getStadiumNamePromise, eventInfoPromise, seatNumberPromise, sectionInfoPromise, rowInfoPromise])
            .then(results => {
                const [otherTickets, stadiumInfo, eventInfo, seatInfo, sectionInfo, rowInfo] = results;
                if (eventInfo[0].stadiumID != sectionInfo[0].stadiumID || eventInfo[0].stadiumID != rowInfo[0].stadiumID){
                    resolve({continue: false, errMsg: "This seat is not in the same stadium as the event!"})
                }
                else if (otherTickets[0].count > 0) {
                    resolve({continue: false, errMsg: "This seat is already occupied for this event!"})
                }
                else{
                    stadiumName = stadiumInfo[0].name

                    eventID = eventInfo[0].eventID
                    eventName = eventInfo[0].name
                    eventDate = eventInfo[0].date
                    basePrice = parseFloat(eventInfo[0].basePrice)
                    stadiumID = eventInfo[0].stadiumID

                    seatID = seatInfo[0].seatID
                    seatNumber = parseInt(seatInfo[0].seatNumber)
                    
                    sectionNumber = parseInt(sectionInfo[0].sectionNumber)
                    sectionMultiplier = parseInt(sectionInfo[0].sectionMultiplier)
                    
                    rowNumber = parseInt(rowInfo[0].rowNumber)
                    rowMultiplier = parseInt(rowInfo[0].rowMultiplier)

                    resolve({ continue: true, stadiumName, eventID, eventName, eventDate, basePrice, stadiumID, seatID, seatNumber, rowNumber, sectionNumber, rowMultiplier, sectionMultiplier });
                }
            })
            .catch(reject);
    });
}

//this function checks if a customer is logged in, and if they are, purchases them the ticket
function placeTicketOrder(eventID, seatID, price, email){
    return new Promise((resolve, reject) => {

        //Define all queries
        let lookingForCustomerSQL = `SELECT COUNT(*) AS count FROM Customer WHERE email = ?;`

        let createNewTicketSQL = `INSERT INTO Ticket (ticketID, valid, price, email, eventID, seatID)
                    VALUES (?, ?, ?, ?, ?, ?);`

        ticketFields = [
            generateTicketID(),
            1,
            price,
            email,
            eventID,
            seatID
        ]

        //Check if at least one customer with the given email exists
        db.query(lookingForCustomerSQL, [email], (err, results) => {
            if (err) {
                reject(err);
            } else if (results[0].count > 0) {
                //Customer exists, insert new ticket
                db.query(createNewTicketSQL, ticketFields, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({continue: true, result});
                    }
                });
            } else {
                //No customer found with that email
                resolve({continue: false})
            }
        });

    });
}

//Ticket route
//Tickets have: ticketID, valid, price, email, eventID, seatID
//My user: 'AbleGMP805@outlook.com'
app.get('/', (req, res) => {
    //res.cookie('user_email', 'AbleGMP805@outlook.com')
    res.sendFile(path.join(__dirname, 'views/index.html'))
});




app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    db.query('SELECT * FROM customer WHERE email = ? AND password = ?', [email, password], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const user = results[0];
      res.cookie('user_email', email) //setting email in cookies

      return res.json({ message: 'Login successful', user });
    });
});

app.post('/register', (req, res) => {
const { email, password, firstName, lastName, DOB } = req.body;

if (!email || !password || !firstName || !lastName || !DOB) {
    return res.status(400).json({ message: 'All fields are required for registration' });
}

db.query(
    'INSERT INTO customer (email, password, firstName, lastName, DOB) VALUES (?, ?, ?, ?, ?)',
    [email, password, firstName, lastName, DOB],
    (error, results) => {
    if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.json({ message: 'Registration successful' });
    }
);
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for admin login' });
    }

    db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid admin username or password' });
        }
        res.cookie('admin_username', username) //setting username in cookies
        return res.json({ message: 'Admin login successful' });
    });
});




//POST route to receive data and insert into MySQL
app.post('/reviewOrder', (req, res) => {
    console.log(`Requested event ID: ${req.body.eventID}`)
    console.log(`Requested seat ID: ${req.body.seatID}`)

    getSeatInfoAndPrice(req.body.eventID, req.body.seatID)
        .then(info => {
            if (info.continue){
                let unroundedPrice = info.basePrice * info.rowMultiplier * info.sectionMultiplier;
                let finalPrice = parseFloat(unroundedPrice.toFixed(2));
                res.render('ticketViews/reviewTicketOrder', {
                    ...info, //spread operator to pass all properties of info
                    finalPrice
                });
            }
            else{
                res.render('errorAlert.ejs', { errorMsg: info.errMsg})
            }
            
        })
        .catch(err => {
            console.error(err);
            //res.status(500).send('An error occurred');
            res.render('errorAlert.ejs', { errorMsg: "This seat or event does not exist!"})
        });
});

app.post('/placeOrder', (req, res) => {
    console.log(decodeURIComponent(req.cookies['user_email']))
    placeTicketOrder(req.body.eventID, req.body.seatID, req.body.finalPrice, decodeURIComponent(req.cookies['user_email']))
        .then(info => {
            if(info.continue){
                res.render('ticketViews/reviewTicketReciept', {
                    ...info,
                    ...req.body
                });
            }
            else{
                res.render('errorAlert.ejs', { errorMsg: "Please log in before trying to purchase tickets!"})
            }
            
        })
        .catch(err => {
            console.error(err);
            //res.status(500).send('An error occurred');
            res.render('errorAlert.ejs', { errorMsg: "Some error has occured!"})
        });
});


app.get('/stadiums', (req, res) => {
    db.query('SELECT * FROM Stadium', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

//POST route to add a new stadium
app.post('/stadiums', (req, res) => {
    const { stadiumID, address, city, province, country, name } = req.body;
  
    //SQL query to insert a new stadium
    const sql = `INSERT INTO stadium (stadiumID, address, city, province, country, name) VALUES (?, ?, ?, ?, ?, ?)`;
  
    //Execute the SQL query
    db.query(sql, [stadiumID, address, city, province, country, name], (err, result) => {
      if (err) {
        console.error('Error occurred', err);
        res.status(500).send('An error occurred');
      } else {
        console.log('1 record inserted', result);
        res.status(201).send('Stadium added successfully');
      }
    });
  });

//Get events by stadiumID
app.delete('/stadiums', (req, res) => {
    const stadiumID = req.query.stadiumID;
    db.query('DELETE FROM stadium WHERE stadiumID = ?', [stadiumID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            console.log('Stadium deleted successfully!');
        }
        res.json(results);
    });
  });

//Get events by stadiumID
app.delete('/events', (req, res) => {
    const eventID = req.query.eventID;
    db.query('DELETE FROM event WHERE eventID = ?', [eventID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            console.log('Event deleted successfully!');
        }
        res.json(results);
    });
  });

  app.delete('/sections', (req, res) => {
    const sectionID = req.query.sectionID;
    db.query('DELETE FROM section WHERE sectionID = ?', [sectionID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            console.log('Section deleted successfully!');
        }
        res.json(results);
    });
  });

  app.delete('/rows', (req, res) => {
    const rowID = req.query.rowID;
    db.query('DELETE FROM stadrow WHERE rowID = ?', [rowID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            console.log('Row deleted successfully!');
        }
        res.json(results);
    });
  });

  app.delete('/sectionRows', (req, res) => {
    const sectionRowID = req.query.sectionRowID;
    db.query('DELETE FROM sectionrow WHERE sectionRowID = ?', [sectionRowID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            console.log('Section row deleted successfully!');
        }
        res.json(results);
    });
  });

  app.delete('/seats', (req, res) => {
    const seatID = req.query.seatID;
    db.query('DELETE FROM seat WHERE seatID = ?', [seatID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
            console.log('Seat deleted successfully!');
        }
        res.json(results);
    });
  });
  
//Get events by stadiumID
app.get('/events', (req, res) => {
  const stadiumID = req.query.stadiumID;
  db.query('SELECT * FROM Event WHERE stadiumID = ?', [stadiumID], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json(results);
  });
});



//POST route to add a new stadium
app.post('/events', (req, res) => {
    const { eventID, name, date, basePrice, stadiumID} = req.body;
  
    //SQL query to insert a new stadium
    const sql = `INSERT INTO event (eventID, name, date, basePrice, stadiumID) VALUES (?, ?, ?, ?, ?)`;
  
    //Execute the SQL query
    db.query(sql, [eventID, name, date, basePrice, stadiumID], (err, result) => {
        if (err) {
            console.error('Error occurred', err);
            res.status(500).json({ error: 'An error occurred', details: err.message }); //Send back a JSON response
        } else {
            console.log('1 record inserted', result);
            res.status(201).json({ success: 'Event added successfully' });
        }
    });
});

//Get sections by stadiumID
app.get('/sections', (req, res) => {
  const stadiumID = req.query.stadiumID;
  db.query('SELECT * FROM Section WHERE stadiumID = ?', [stadiumID], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json(results);
  });
});

//POST route to add a new stadium
app.post('/sections', (req, res) => {
    const { sectionID, sectionNumber, sectionMultiplier, stadiumID} = req.body;
  
    //SQL query to insert a new stadium
    const sql = `INSERT INTO section (sectionID, sectionNumber, sectionMultiplier, stadiumID) VALUES (?, ?, ?, ?)`;
  
    //Execute the SQL query
    db.query(sql, [sectionID, sectionNumber, sectionMultiplier, stadiumID], (err, result) => {
        if (err) {
            console.error('Error occurred', err);
            res.status(500).json({ error: 'An error occurred', details: err.message }); //Send back a JSON response
        } else {
            console.log('1 record inserted', result);
            res.status(201).json({ success: 'Section added successfully' });
        }
    });
});


//POST route to add a new stadium
app.post('/rows', (req, res) => {
    const { rowID, rowNumber, rowMultiplier, stadiumID } = req.body;
  
    //SQL query to insert a new stadium
    const sql = `INSERT INTO stadrow (rowID, rowNumber, rowMultiplier, stadiumID) VALUES (?, ?, ?, ?)`;
  
    //Execute the SQL query
    db.query(sql, [rowID, rowNumber, rowMultiplier, stadiumID], (err, result) => {
        if (err) {
            console.error('Error occurred', err);
            res.status(500).json({ error: 'An error occurred', details: err.message }); //Send back a JSON response
        } else {
            console.log('1 record inserted', result);
            res.status(201).json({ success: 'Row added successfully' });
        }
    });
});

//POST route to add a new stadium
app.post('/sectionRows', (req, res) => {
    const { sectionRowID, sectionID, rowID } = req.body;
  
    //SQL query to insert a new stadium
    const sql = `INSERT INTO sectionrow (sectionRowID, sectionID, rowID) VALUES (?, ?, ?)`;
  
    //Execute the SQL query
    db.query(sql, [sectionRowID, sectionID, rowID], (err, result) => {
        if (err) {
            console.error('Error occurred', err);
            res.status(500).json({ error: 'An error occurred', details: err.message }); //Send back a JSON response
        } else {
            console.log('1 record inserted', result);
            res.status(201).json({ success: 'sectionRow added successfully' });
        }
    });
});


//POST route to add a new seat
app.post('/seats', (req, res) => {
    const { seatID, seatNumber, sectionRowID } = req.body;
  
    //SQL query to insert a new seat
    const sql = `INSERT INTO seat (seatID, seatNumber, sectionRowID) VALUES (?, ?, ?)`;
  
    //Execute the SQL query
    db.query(sql, [seatID, seatNumber, sectionRowID], (err, result) => {
        if (err) {
            console.error('Error occurred', err);
            res.status(500).json({ error: 'An error occurred', details: err.message }); //Send back a JSON response
        } else {
            console.log('1 record inserted', result);
            res.status(201).json({ success: 'Seat added successfully' });
        }
    });
});


//Get rows by stadiumID
app.get('/rows', (req, res) => {
  const stadiumID = req.query.stadiumID;
  db.query('SELECT * FROM stadrow WHERE stadiumID = ?', [stadiumID], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json(results);
  });
});

//Get section row by sectionID and rowID
app.get('/sectionRow', (req, res) => {
  const { sectionID, rowID } = req.query;
  db.query('SELECT * FROM SectionRow WHERE sectionID = ? AND rowID = ?', [sectionID, rowID], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json(results);
  });
});

//Get seat by sectionRowID
app.get('/seat', (req, res) => {
  const sectionRowID = req.query.sectionRowID;
  db.query('SELECT * FROM Seat WHERE sectionRowID = ?', [sectionRowID], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.json(results);
  });
});

//Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
