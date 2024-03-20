const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

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
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
});

//Admin Requests Page
router.get('/', (req, res) => {
    const username = decodeURIComponent(req.cookies['admin_username']);
    const openRequestsQuery = `SELECT rr.requestID, t.ticketID, t.price FROM stadiumdb.refundrequest rr, stadiumdb.ticket t
    WHERE t.ticketID = rr.ticketID and rr.username = ? and rr.status='Open';`;

    db.query(openRequestsQuery, [username, username], (err, result) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.render('adminRequests', { username: username, requests: result });
    });
});

router.get('/approval', (req, res) => {
    const requestID = req.query.requestID;
    res.render('adminApproval', { requestID: requestID });
});

router.post('/approval', (req, res) => {
    const requestData = JSON.parse(req.body.action);
    const action = requestData[0];
    const requestID = requestData[1];
    const updateStatusQuery = `UPDATE Refundrequest SET status = 'Closed' WHERE requestID = ?;`;

    if (action === 'approve') {
        const updateValidQuery = `UPDATE Ticket t SET t.valid = 0 WHERE t.ticketID = (SELECT rr.ticketID FROM Refundrequest rr WHERE rr.requestID = ?);`;

        db.query(updateStatusQuery, [requestID], (err, result) => {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            db.query(updateValidQuery, [requestID], (err, result) => {
                if (err) {
                    res.status(500).send('Database error');
                    return;
                }
                res.render('approvalResponse', { action: 'approved', requestID: requestID });
            });
        });
    } else if (action === 'reject') {
        db.query(updateStatusQuery, [requestID], (err, result) => {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.render('approvalResponse', { action: 'rejected', requestID: requestID });
        });
    } else {
        res.status(400).send('Invalid action.');
    }
});

module.exports = router;
