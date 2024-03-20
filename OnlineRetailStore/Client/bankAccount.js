var globalBankUsername; // declare the global username so it can be accessed when needed later
const showBankLogin = () => {

  const bankLoginModal = document.getElementById('bankLoginModal'); //ger the modal for bank login and display it
  bankLoginModal.style.display = 'block';
};

const closeBankLoginModal = () => {
  const bankLoginModal = document.getElementById('bankLoginModal'); //gets the modal for bank login and hides it
  bankLoginModal.style.display = 'none';
};

async function loginToBank() {
  //retrieve both values of the entered username and password
  const bankUsername = document.getElementById('bankUsername').value;
  const bankPassword = document.getElementById('bankPassword').value;

  const response = await fetch('/bank-login', { //call the bank login api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: bankUsername, password: bankPassword }), //send the username and password in the request body
  });

  const data = await response.json();
  globalBankUsername = bankUsername; //set the global bank username 
  if (data.success) {
    const showAcc = document.getElementById('addnewAcc');
    const trans = document.getElementById('transactionModal');
    const header1 = document.getElementById('header1');
    //show all the parts of bank account that were hidden
    showAcc.removeAttribute('hidden'); 
    trans.style.display = 'block'
    header1.style.display = 'block'
    alert('Bank login successful'); //alert user if login was successful
    closeBankLoginModal();
    globalBankUsername = bankUsername; //update the global bank username
    displayAccounts(); //call the display accounts function which will display the users account based on the username


  } else {
    alert('Bank login failed. Please check your credentials.');
  }
};


async function displayAccounts() {
  console.log(globalBankUsername);
  document.getElementById('accountsList').innerHTML = '';
  const response = await fetch(`/user-accounts?username=${globalBankUsername}`);
  const data = await response.json();
  const accountsList = document.getElementById('accountsList'); //get the div that will be used to display the accounts
  

  data.accounts.forEach(account => { //for each account the user has
    const accountDiv = document.createElement('div'); //create a div
    accountDiv.innerHTML = `<h3>${account.type}</h3><p>Balance: ${account.balance}</p><p>Account Number: ${account.id}`; //display the balance, type, and acc number

    accountDiv.addEventListener('click', () => showTransactionModal(account.id));
    accountsList.appendChild(accountDiv);
  });

};

const showTransactionModal = () => { //function used to show the transaction modal in the bank account

  const transactionModal = document.getElementById('transactionModal');
  transactionModal.style.display = 'block';
};

const closeTransactionModal = () => { //function used to hide the transaction model
  const transactionModal = document.getElementById('transactionModal');
  transactionModal.style.display = 'none';
};

const deposit = async () => {
  const amount = document.getElementById('amount').value; //gets the value of the amount wanted to deposit
  const selectedAccountId = document.getElementById('id').value //gets the value of the account number they want 
  const response = await fetch('/deposit', { //calls the deposit api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: globalBankUsername, amount, accountId: selectedAccountId }), //sents the bank username, amount, id in the request body
  });

  const data = await response.json();

  if (data.success) {
    alert('Deposit successful');
    closeTransactionModal();
    displayAccounts(); // Refresh account list
  } else {
    alert('Deposit failed. Please try again.');
  }
};

const withdraw = async () => {
  const amount = document.getElementById('amount').value; //retrieve the amount to be withdrawn
  const selectedAccountId = document.getElementById('id').value //retrieve the account id that is going to be used for the withdrawal

  const response = await fetch('/withdraw', { //call the withdraw api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: globalBankUsername, amount, accountId: selectedAccountId }), //send the info in the request body
  });

  const data = await response.json();

  if (data.success) {
    alert('Withdrawal successful');
    closeTransactionModal();
    displayAccounts(); // Refresh account list
  } else {
    alert('Withdrawal failed. Please try again.');
  }
};
const showAddAccountModal = () => { //function used to show the add acount modal form
  const addAccountModal = document.getElementById('addAccountModal');
  addAccountModal.style.display = 'block';
};

// Function to close the add account modal
const closeAddAccountModal = () => {
  const addAccountModal = document.getElementById('addAccountModal');
  addAccountModal.style.display = 'none';
};

const addAccount = async () => {
  const accountNumber = document.getElementById('accountNumber').value; //retrieve the acc number and type of the new account
  const accountType = document.getElementById('accountType').value;

  const response = await fetch('/add-account', { //call the add-account api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: globalBankUsername, accountNumber, accountType }), //send the info needed in the request body
  });

  const data = await response.json();

  if (data.success) {
    alert('Account added successfully'); //alert the user if successful
    closeAddAccountModal();
    // Refresh the accounts list after adding a new account
    displayAccounts();
  } else {
    alert('Failed to add account. Please try again.');
  }
};
const registerBank = async () => {
  const bankUsername = document.getElementById('bankUsername').value; //gets the username the user inputted
  const bankPassword = document.getElementById('bankPassword').value; //gets the password the user inputted

  const response = await fetch('/bank-register', { //call the bank-register api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: bankUsername, password: bankPassword }), //send the username and password in the request body
  });

  const data = await response.json();

  if (data.success) {
    alert('Registration successful'); //alert the user of a successful registration
  } else {
    alert('Registration failed. ' + data.message);
  }
};
function goHome () {
  window.location.href = 'dashboard.html'; //function for handline when the user clicks on the home button in the nav-bar
}
