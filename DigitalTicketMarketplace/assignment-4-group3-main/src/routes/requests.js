const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const router = express.Router()


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



//MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3316Lab4',
    database: 'stadiumdb',
});

//Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('1Error connecting to MySQL:', err.message);
        process.exit(1); //Exit the application if there's an error connecting to the database
    };
    //console.log('MySQL Connected...');
});


//Requests Page
router.get('/', (req, res) => {
    console.log("Redirected to requests page..")
    //Get email
    const email = decodeURIComponent(req.cookies['user_email'])
    //console.log(email);

    //Display all current requests from user
    const currentRequestsQuery = `SELECT requestID, status from refundrequest
    WHERE ticketID IN (SELECT ticketID FROM ticket WHERE email = ? );`
    
    db.query(currentRequestsQuery, [email], (err, result) => {
        if (err) throw err;
        const requests = currentRequests(result, 0)

        res.send(`<h1 style="background-color:rgb(179, 203, 235);">Current Requests:</h1>
        ${requests}
        <a href="/requests/new", style="background-color:rgb(0, 255, 0);">Create new request</a>&nbsp&nbsp&nbsp&nbsp
        <a href="/requests/cancel", style="background-color:rgb(255, 200, 0);">Cancel a request</a>
        `)
    })
})

//Make a new refund request
router.get('/new', (req, res) => {
    //Get email
    const email = decodeURIComponent(req.cookies['user_email'])
    console.log("Redirected to create new requests page..")
    
    //Display all tickets without a request
    const currentRequestsQuery = `SELECT ticketID, eventID FROM ticket
    WHERE email = ? and ticketID NOT IN (SELECT ticketID from refundrequest
        WHERE ticketID IN (SELECT ticketID FROM ticket WHERE email = ?));`
    
    db.query(currentRequestsQuery, [email, email], (err, result) => {
        if (err) {
            console.error('3Error executing MySQL query:', err.message);
            return res.status(500).send('Internal Server Error');
        };
        const requests = currentRequests(result, 'tix only')
        res.send(`
            <form action='/requests/new' method="post">
                <h1 style="background-color:rgb(179, 203, 235);">Create Request</h1>
                <label>Enter a Ticket from below:</label><br><br>
                <input type="text" name="ticketID" placeholder="Enter your ticket ID:"><br><br>
                <button type="submit">Submit</button><br>
                ${requests}
            </form>
        `);
    })
    
})

//POST new
router.post('/new', (req, res) => {

    //Generate a unique requestID
    const requestID = randomRequestID();

    //Data to update sql
    let requestData = [
        requestID,
        "Open",
        getRandomAdmin(),
        req.body.ticketID,
    ];

    //SQL query for data insertion
    let sql =   `INSERT INTO refundrequest (requestID, status, username, ticketID) VALUES (?, ?, ?, ?)`

    //Execute the query
    db.query(sql, requestData, (err, result)=> {
        if (err) {
            console.error('4Error executing MySQL query:', err.message);
            return res.status(500).send('Internal Server Error');
        };
        //console.log(result)
    })

    res.send(`<h1 style="background-color:rgb(179, 203, 235);">Create Request</h1>
    <h3>Request received. It will be handled as soon as possible.<br>You may view all your requests <a href="http://localhost:3000/requests">here</a>.</h3>`);
    console.log('Placed request in database with attributes:',requestData)
})


//Cancel a refund request
router.get('/cancel', (req, res) => {
    console.log("Redirected to cancel requests page..")
    
    //Get email
    const email = decodeURIComponent(req.cookies['user_email'])
    
    //Display all open requests from user
    const currentRequestsQuery = `SELECT requestID, ticketID from refundrequest
    WHERE status != 'Closed' and ticketID IN (SELECT ticketID FROM ticket WHERE email = ?);`
    //Execute query
    db.query(currentRequestsQuery, [email], (err, result) => {
        if (err) {
            console.error('5Error executing MySQL query:', err.message);
            return res.status(500).send('Internal Server Error');
        };
        const requests = currentRequests(result, 'cancel')

        res.send(`
        <form action='/requests/cancel' method="post">
            <h1 style="background-color:rgb(179, 203, 235);">Cancel Request</h1>
            <label>Enter the ID of the open request you want to cancel from below:</label><br><br>
            <input type="text" name="requestID" placeholder="Enter Request ID"><br><br>
            <button type="submit">Submit</button><br>
            ${requests}
        </form>
        `);
    })
    
})

//POST cancel
router.post('/cancel', (req, res) => {

    //SQL query to delete request
    let sql = `DELETE FROM refundrequest WHERE requestID= ?;`
    reqID = req.body.requestID
    //Execute the query
    db.query(sql, [reqID], (err, result)=> {
        //console.log(reqID)
        if (err) {
            console.error('6Error executing MySQL query:', err.message);
            return res.status(500).send('Internal Server Error');
        };
        //console.log(result)
    })

    res.send(`<h1 style="background-color:rgb(179, 203, 235);">Cancel Request</h1>
    <h3>Request cancelled.<br>You may view all your requests <a href="http://localhost:3000/requests">here</a>.</h3>`);
    console.log('Deleted request from database with ID:',reqID)
})



//Functions

//Print current requests
function currentRequests(data, a) {
    let requestString =''
    if (a===0){
        if (data.length === 0 ) {
            requestString = `<p>None</p>`
        } else {
            data.forEach(request => {
                requestString +=`<p>Request ID: ${request.requestID}, Status: ${request.status}</p>`
            });
        }
    } else if (a==='cancel') {
        if (data.length === 0 ) {
            requestString = `<p>None</p>`
        } else {
            data.forEach(request => {
                requestString +=`<p>Request ID: ${request.requestID} => Ticket: ${request.ticketID}</p>`
            });
        }
    } else {
        if (data.length === 0 ) {
            requestString = `<p>None</p>`
        } else {
            data.forEach(request => {
                requestString +=`<p>Ticket: ${request.ticketID} => For event: ${request.eventID}</p>`
            });
        }
    }
    return requestString
}

//Get random Admin
function getRandomAdmin(){
    const admins = ['apibuilder', 'lazerman', 'machinegun', 'malhamwi', 'thunderflame']
    return admins[Math.floor(Math.random() * admins.length)]
}

//Make random requestID
function randomRequestID(){
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    //In form "Req-00####"
    randomID = "Req-"+zeroPad(Math.floor(Math.random()*9000+1000), 6)
    return randomID
}


module.exports = router
