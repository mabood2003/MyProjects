const express = require('express');
const session = require('express-session');
const path = require('path'); 
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const port = 3000;
const app = express();
console.log(process.cwd())
const { exec } = require('child_process');

app.use(bodyParser.json());
app.use('/', express.static('client'));

app.use(session({ //using express-session
    secret: 'joe', 
    resave: false,
    saveUninitialized: true,
  }));

const loadUsers = () => { //function for loading the users json file
    try {
      const filePath = path.resolve(process.cwd(), 'server/data/users.json'); //find the file path
      const data = fs.readFileSync(filePath, 'utf8'); //read the file
      return JSON.parse(data) ; //return a parsed data
    } catch (error) {
      return {};
    }
  };
  const loadItems = () => { //same as loadusers but for items
    try {
      const filePath = path.resolve(process.cwd(), 'server/data/Items.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) ;
    } catch (error) {
      return {};
    }
  };
  const loadCarts = () => { //same as load users but for carts
    try {
      const filePath = path.resolve(process.cwd(), 'server/data/carts.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) ;
    } catch (error) {
      return {};
    }
  };



  const saveItems = (items) => { //this function will be used to write items in the items.json file
    fs.writeFileSync('./server/data/Items.json', JSON.stringify(items), 'utf8');
  };
  
  const saveCarts = (carts) => { //same as saveItems but for carts
    fs.writeFileSync('./server/data/carts.json', JSON.stringify(carts), 'utf8');
  };

  
  const saveUsers = (users) => { //same as saveItems but for users
    fs.writeFileSync('./server/data/users.json', JSON.stringify(users), 'utf8');
  };
  
const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

app.post('/register', (req, res) => { //registeration api
    const { username, password } = req.body; // the username and password are sent in the request body
  
    const users = loadUsers(); //get the users jsons
    if (users[username]) { //return an error if username is already in the json file
      return res.status(400).json({ error: 'Username already exists' });
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10); //hash the password
  
    users[username] = { username, password: hashedPassword }; 
    saveUsers(users); //write the change in the json file
  
    res.json({ message: 'Registration successful' }); //return message success
  });

  app.post('/login', (req, res) => { //login api
    const { username, password } = req.body; //info is in the req body
    const users = loadUsers(); //load the users JSON
    console.log(users);   
    const user = users[username];
    console.log(user); 
    if (!user) { //if the user doesnt exist in the file return an invalid credentials error message
      return res.status(401).json({ error: 'Invalid username or password' });
    } 
    if (bcrypt.compareSync(password, user.password)) { //compare the password with the password in the file
      req.session.userId = username;
      console.log(req.session); 
      res.json({ message: 'Login successful' }); //return messsage of outcome
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  app.post('/logout', (req, res) => { //logout api
    req.session.destroy((err) => {
      if (err) { //return the outcome of the api
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'Logout successful' });
    });
  });
  app.post('/update-password', (req, res) => { //update password api
    const { newPassword } = req.body;  
    const users = loadUsers();  //get the users json
    const username = req.query.username;  //get the username for the user
    const user = users[username];  
    if (!user) { //return user not found message if user isnt in the file
      return res.status(401).json({ error: 'User not found' });
    } 
    user.password = bcrypt.hashSync(newPassword, 10);  //change the user password to the new one hashed
    saveUsers(users); 
    res.json({ message: 'Password updated successfully' }); //return the result
  });
  
  app.post('/update-username', (req, res) => { //update username api
    const { newUsername } = req.body;  
    const users = loadUsers();  //load the users JSON
    const username = req.query.username; 
    const user = users[username]; 
    if (!user) { //return if user does not exist
      return res.status(401).json({ error: 'User not found' });
    }     
    if (users[newUsername]) { //return if username is already in the file
      return res.status(400).json({ error: 'Username already exists' });
    }  
    users[newUsername] = { ...user, username: newUsername }; //update the username
    delete users[username];  
    saveUsers(users); 
    globalusername = newUsername;  
    res.json({ message: 'Username updated successfully' }); //return the result
  });


  app.get('/items', (req, res) => { //items api
    try {
      const items = loadItems(); //load the items.JSON
      res.json(items);
    } catch (error) { //return the outcome
      console.error('Error loading items:', error);
      res.status(500).send('Error loading items');
    }
  });
  





  app.post('/item', (req, res) => { //post api for item
    const items = loadItems(); //load the items
    items.push(req.body); //push the body of the request into items
    saveItems(items);
    res.json({ message: 'Item added successfully' }); //return result message
  });
  
  app.delete('/item/:id', (req, res) => { //delete item api
    let items = loadItems();
    items = items.filter(item => item.itemID !== req.params.id); //filter the items.JSON
    saveItems(items);
    res.json({ message: 'Item deleted successfully' }); //return the message
  });


  app.post('/cart/:id', (req, res) => {
    const quantity = Number(req.body.quantity); // Get the quantity from the request body
    const username = req.query.username; // Get the username from the query parameters
    const carts = loadCarts(); //load the carts
    const cart = carts.find(cart => cart.username === username);
    const items = loadItems(); //load the items
    const item = items.find(item => item.itemID === req.params.id);

    if (item && item.itemStock >= quantity) { //if the item exists and the stock is enough
        item.itemStock -= quantity;
        saveItems(items);

        if (!cart) {
            carts.push({ //push the item to the user cart
                username: username,
                items: [{ itemID: req.params.id, quantity }]
            });
        } else {
            const cartItem = cart.items.find(item => item.itemID === req.params.id); //find the cart if the cart already exists

            if (cartItem) {
                cartItem.quantity += quantity; //increase the quantity
            } else {
                cart.items.push({ itemID: req.params.id, quantity });
            }
        }

        saveCarts(carts);
        res.json({ message: 'Item added to cart successfully' }); //return the result message
    } else {
        res.json({ message: 'Not enough stock available' });
    }
});

  app.get('/carts',(req, res) => { //carts api
    try {
      const username = req.query.username;  //get the username from the query
      const carts = loadCarts(); //load carts and items
      const items = loadItems();
      const cart = carts.find(cart => cart.username === username);   //find the cart for that username
      if (cart) {
        cart.items = cart.items.map(cartItem => {
          const item = items.find(item => item.itemID === cartItem.itemID); //find the item for the cart
          if (!item) {
            console.error(`Could not find item with id ${cartItem.itemID}`);
            return cartItem;
          }
            return { ...cartItem, ...item }; //return the cart item
        });
      }
      res.json(cart || { items: [] });
    } catch (error) {
      console.error('Error loading carts:', error);
      res.status(500).send('Error loading carts');
    }
  });
  
  
  app.delete('/cart/:id', (req, res) => {
    const quantity = Number(req.body.quantity); // Get the quantity from the request body
    const username = req.query.username; // Get the username from the query parameters
    const carts = loadCarts();
    const cart = carts.find(cart => cart.username === username);
    const items = loadItems();
    const item = items.find(item => item.itemID === req.params.id);

    if (cart && item) {
        const cartItem = cart.items.find(item => item.itemID === req.params.id); //find the item by id

        if (cartItem) {
            if (cartItem.quantity >= quantity) {
                cartItem.quantity -= quantity;
                item.itemStock += quantity;
                saveItems(items);

                // If the quantity is 0 or less, remove the item from the cart
                if (cartItem.quantity <= 0) {
                    cart.items = cart.items.filter(item => item.itemID !== req.params.id);
                }

                saveCarts(carts);
                //return the result message or status based on the outcome
                res.json({ message: 'Item quantity updated successfully' });
            } else {
                res.status(400).json({ error: 'Not enough quantity in cart' });
            }
        } else {
            res.status(400).json({ error: 'Item not found in cart' });
        }
    } else {
        res.status(400).json({ error: 'Cart or item not found' });
    }
});
  app.get('/calculate-total', (req, res) => { //calculate total api
    const username = req.query.username;
    //load items and carts
    const carts = loadCarts();
    const items = loadItems();
    const cart = carts.find(cart => cart.username === username);
  
    if (cart) {
      let totalAmount = 0;
  
      // Calculate the total amount based on the items in the cart
      cart.items.forEach(cartItem => {
        const item = items.find(item => item.itemID === cartItem.itemID);
        if (item) {
          totalAmount += item.itemPrice * cartItem.quantity;
        }
      });
      totalAmount = Number(totalAmount.toFixed(2)); //change to two decimal points

      res.json({ totalAmount }); //return the total amount
    } else {
      res.json({ totalAmount: 0 });
    }
  });
  
  app.post('/process-payment', (req, res) => { //process payment api
    const success = true;
  
    if (success) {
      const username = req.query.username; //get the username from the query
      //load carts and items
      const carts = loadCarts();
      const items = loadItems();
      const cart = carts.find(cart => cart.username === username); //find the cart by username
      const totalAmount = calculateTotalAmount(cart.items, items); //get the total amount in the car
  
      // Save the transaction history
      saveTransactionHistory(username, cart.items, totalAmount);
      //update the cart
      const updatedCarts = carts.filter(cart => cart.username !== username);
      saveCarts(updatedCarts);
  
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
  function calculateTotalAmount(cartItems, items) {
    let totalAmount = 0;
  
    cartItems.forEach(cartItem => { //foreach item in the cart increase the total amount by the price and quantity
      const item = items.find(item => item.itemID === cartItem.itemID);
      if (item) {
        totalAmount += item.itemPrice * cartItem.quantity;
      }
    });
  
    return totalAmount; //return the total amount
  }
  
  // New function to save transaction history
  function saveTransactionHistory(username, items, total) {
    try {
      const filePath = path.resolve(process.cwd(), 'server/data/transactions.json'); 
      let transactions = loadTransactions(); //load the transactions json
  
      transactions.push({ //push the new transaction
        username,
        items: items.map(item => ({ itemID: item.itemID, quantity: item.quantity })),
        total,
        timestamp: new Date().toISOString(),
      });
  
      fs.writeFileSync(filePath, JSON.stringify(transactions), 'utf8'); //write it in the file
    } catch (error) {
      console.error('Error saving transaction history:', error);
    }
  }
  
  // New function to load transaction history
  function loadTransactions() {
    try {
      const filePath = path.resolve(process.cwd(), 'server/data/transactions.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) || []; //return the data in the transactions JSON
    } catch (error) {
      return [];
    }
  }
  const paypal = require('@paypal/checkout-server-sdk'); //require the paypal SDK

// Set up PayPal environment with sandbox credentials
let environment = new paypal.core.SandboxEnvironment('AccJqc_su6djGjlA4-ED7LeZz_vsyhJCEJktYz3yZ39MEM872BSKqMPAWqb-WtcJdgkrLcJFb0RVnghK', 'ENVxKn0i9tdYpJw5AWii_x90KfRZ-bg6g871EbYh4SfBZqzHyzvvveuissj-BJMJixfTv-pFX2f9CNgA');
let client = new paypal.core.PayPalHttpClient(environment);

// Handle payment creation 
app.post('/create-payment', async (req, res) => {
  // Construct a request object and set desired parameters
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '0.01' // Can dynamically set the amount based on cart total
      }
    }]
  });

  try {
    let response = await client.execute(request); //execute the request
    res.json({ id: response.result.id }); //return the result id
  } catch (err) {
    // Handle errors
    res.status(500).send(err);
  }
});
app.get('/transactions', (req, res) => { //get the transactions
  const username = req.query.username;
  const transactions = loadTransactions();
  const userTransactions = transactions.filter(transaction => transaction.username === username); //filter the transactions by username of the user
  res.json(userTransactions);
});



const bankLoginData = () => { //function used to retrieve the data in bank login JSON
  try {
    const filePath = path.resolve(process.cwd(), 'server/data/bankLogin.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) ; //return the parsed data
  } catch (error) {
    return {};
  }
};

app.post('/bank-login', (req, res) => {
  const { username, password } = req.body; //get the info from the req body
  
  const bankUsers = bankLoginData(); //load the bank login data

  if (bankUsers[username] && bankUsers[username].password === password) { //check if the username exists and the password matches
    res.json({ success: true, message: 'Login successful' }); //return the success message
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});


app.get('/user-accounts', (req, res) => { //api for getting user accounts
  const { username } = req.query;
  try {
    const filePath = path.resolve(process.cwd(), 'server/data/userAccounts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const userAccounts = JSON.parse(data)[username]; //get the data from user Accounts
    if (userAccounts) { //if the username has an account
      res.json(userAccounts); //return the accounts
      console.log(userAccounts)
    } else {
      res.status(404).json({ success: false, message: 'User not found' }); //otherwise say user not in data
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/deposit', (req, res) => { //used for depositing money in the system bank
  const { username, amount, accountId } = req.body;

  try {
    const filePath = path.resolve(process.cwd(), 'server/data/userAccounts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const userAccounts = JSON.parse(data); //get the user accounts

    if (userAccounts[username]) {
      const account = userAccounts[username].accounts.find(acc => acc.id === accountId); //find the account associated with the deposit

      if (account) {
        account.balance += parseFloat(amount); //increase the account balance

        fs.writeFileSync(filePath, JSON.stringify(userAccounts, null, 2)); //write the updated changes

        res.json({ success: true, message: 'Deposit successful' });
      } else {
        res.status(404).json({ success: false, message: 'Account not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.post('/withdraw', (req, res) => { //function used for withdrawing
  const { username, amount, accountId } = req.body; //get the request body info

  try {
    const filePath = path.resolve(process.cwd(), 'server/data/userAccounts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const userAccounts = JSON.parse(data); //get the user accounts JSON data

    if (userAccounts[username]) {
      const account = userAccounts[username].accounts.find(acc => acc.id === accountId); //find the associated account 

      if (account) {
        if (account.balance >= parseFloat(amount)) { //if the user has more money than the withdrawal
          account.balance -= parseFloat(amount); //update the balance

          fs.writeFileSync(filePath, JSON.stringify(userAccounts, null, 2)); //write the changes in the file

          //return the success and message based on outcome
          res.json({ success: true, message: 'Withdrawal successful' });
        } else {
          res.status(400).json({ success: false, message: 'Insufficient funds' });
        }
      } else {
        res.status(404).json({ success: false, message: 'Account not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/confirm', (req, res) => {
  const { accountId } = req.body;
  const username = req.query.username;
  const nonBankUsername = req.query.nonBankUsername;
  try {
    //load all needed data files
    const filePath = path.resolve(process.cwd(), 'server/data/userAccounts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const userAccounts = JSON.parse(data);

    const carts = loadCarts();
    const items = loadItems();
    const cart = carts.find(cart => cart.username === nonBankUsername);

    const totalAmount = calculateTotalAmount(cart.items, items);
    
    if (userAccounts[username]) { //check if the account exists
      const account = userAccounts[username].accounts.find(acc => acc.id === accountId);//find the associated account id

      if (account) {
        if (account.balance >= parseFloat(totalAmount)) {
          account.balance -= parseFloat(totalAmount); //update the acc balance after the transaction

          fs.writeFileSync(filePath, JSON.stringify(userAccounts, null, 2)); //write the updated changes

          res.json({ success: true, message: 'Withdrawal successful' }); //return the success message
          saveTransactionHistory(nonBankUsername,cart.items,totalAmount)
          const updatedCarts = carts.filter(cart => cart.username !== nonBankUsername); //update the cart
          saveCarts(updatedCarts);
        } else {
          res.status(400).json({ success: false, message: 'Insufficient funds' });
        }
      } else {
        res.status(404).json({ success: false, message: 'Account not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'bad' });
  }
});
app.post('/add-account', (req, res) => {
  const { username, accountNumber, accountType } = req.body;
  const filePath = path.resolve(proces.cwd(), 'server/data/userAccounts.json');

  try {
    // read the user accounts data from the file
    const data = fs.readFileSync(filePath, 'utf8');
    const userAccounts = JSON.parse(data);

    // check if the user exists
    if (userAccounts[username]) {
      // generate a unique ID for the new account
      const accountId = `acc${userAccounts[username].accounts.length + 1}`;

      // add the new account to the user's accounts
      userAccounts[username].accounts.push({
        id: accountId,
        type: accountType,
        balance: 0, // 0 initial balance
      });

      // write the updated data back to the file
      fs.writeFileSync(filePath, JSON.stringify(userAccounts, null, 2));

      res.json({ success: true, message: 'Account added successfully' });
    } else {
      userAccounts[username] = {
        accounts: [
          {
            id: `acc1`,
            type: accountType,
            balance: 0, 
          },
        ],
      };
        fs.writeFileSync(filePath, JSON.stringify(userAccounts, null, 2));

    res.json({ success: true, message: 'Account added successfully' });
    }    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/bank-register', (req, res) => { //api used for registering for bank account
  const { username, password } = req.body; //get the info from the request body
  const filePath = path.resolve(process.cwd(), 'server/data/bankLogin.json');

  if(!username || !password){ //if the user didnt put all the infor needed
    res.status(500).json({ success: false, message: 'Internal Server Error' }); //return an error
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8'); 
    const bankLoginData = JSON.parse(data); //retrieve the bank login data

    if (bankLoginData[username]) {
      res.status(400).json({ success: false, message: 'Username already exists' }); //return failure if the username already exists in data
    } else {
      bankLoginData[username] = { password }; //set the info thats about to be written to the file

      fs.writeFileSync(filePath, JSON.stringify(bankLoginData, null, 2)); //write the new user in the JSON file

      res.json({ success: true, message: 'Registration successful' }); //return success message
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.listen(port,   () => {
  console.log(`Server running at http://localhost:${port}`);
  exec(`start http://localhost:${port}`);
});