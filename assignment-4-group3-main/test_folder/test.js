const express = require('express')
//routers
const requestsRouter = require('./routes/requests')

const app = express()
//const port = 3000; 

app.set('view engine', 'ejs')
//Initial uses
app.use(logger)
app.use('/requests', requestsRouter)

//Home page
app.get('/', (req, res) => {
  console.log("Redirected to home page..")
  //res.send('Home Page')
  res.send(`<h1 style="background-color:rgb(179, 203, 235);">Welcome User to the home page! </h1>
  <a href="/requests">View current refund requests</a>`)
})


function logger(req, res, next) {
  console.log('MW: Redirecting to: localhost:3000'+ req.originalUrl)
  next()
}

//Email for export
let email = 'AbleGMP805@outlook.com';
module.exports = email

app.listen(3000)
