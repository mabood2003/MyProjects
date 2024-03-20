const storedUsername = localStorage.getItem('globalusername');
if (storedUsername) {
  globalusername = storedUsername;
}
const showManageAccount = () => {
  const manageAccountDiv = document.getElementById('manageAccountModal');
  manageAccountDiv.style.display = 'block';
};
const register = async () => {
  //gets the values of the username and password the user entered
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/register', { //calls the register api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }), //sends the username and password in the request body
  });

  const data = await response.json();
  alert(data.message);
};

const login = async () => {
  //gets the values inputted by the user
  const username = document.getElementById('username').value; 
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }), //sends the values in the body
  });

  const data = await response.json();
  alert(data.message);

  localStorage.setItem('globalusername', username);

  
  window.location.href= 'dashboard.html'

};

const logout = async () => {
  const response = await fetch('/logout', { //calls the logout api
    method: 'POST',
  });

  const data = await response.json();
  alert(data.message); //alert the user of a successful logout
  //hide all unneeded elements
  const manageAccountButton = document.getElementById('manage-account-button');
  manageAccountButton.style.display = 'none';
  const itemsview = document.getElementById('itemsTable');
  itemsview.style.display = 'none';
  document.getElementById('loadCartButton').style.display = 'none';
  document.getElementById('cartTable').style.display = 'none';
  window.location.href = 'index.html' //returns to the login page

};


const updatePassword = async () => {
  //gets the values of the new password
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  
    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log(globalusername)
    // Make API call to update password
    const response = await fetch('/update-password?username=' + globalusername, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }), //sends the new password in the request body
    });
  
    const data = await response.json();
    alert(data.message); //alert the user of the result
  };
  
  const updateUsername = async () => {
    //same as update password just for changing username
    const newUsername = document.getElementById('newUsername').value;
    const confirmNewUsername = document.getElementById('confirmNewUsername').value;
  
    // Check if usernames match
    if (newUsername !== confirmNewUsername) {
      alert('Usernames do not match');
      return;
    }
  
    const response = await fetch('/update-username?username=' + globalusername, { //call the username update api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUsername }),
    });
  
    const data = await response.json();
    alert(data.message);
  
    // Update the global username
    globalusername = newUsername;
  };
  loadItemsTable()
  function loadItemsTable() {
    fetch('/items')
      .then(response => response.json())
      .then(items => {
        const table = document.getElementById('itemsTable');
        // Clear the existing table rows
        table.innerHTML = '';
  
        // Add table headers
        const headers = ['Item ID', 'Item Name', 'Item Price', 'Item Stock', 'Quantity', ''];
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
  
        // Add each item to the table
        items.forEach(item => {
          const row = document.createElement('tr');
  
          // Add item ID, name, and price to the row
          ['itemID', 'itemName', 'itemPrice','itemStock'].forEach(key => {
            if(key == 'itemPrice'){
              const cell = document.createElement('td');
              cell.textContent = "$"+item[key];
              row.appendChild(cell);
            }else{
              const cell = document.createElement('td');
              cell.textContent = item[key];
              row.appendChild(cell);
            }
          });
  
          // Add quantity selector to the row
          const quantityCell = document.createElement('td');
          const quantitySelector = document.createElement('input');
          quantitySelector.type = 'number';
          quantitySelector.min = '1';
          quantitySelector.value = '1';
          quantityCell.appendChild(quantitySelector);
          row.appendChild(quantityCell);
  
          // Add "Add to Cart" button to the row
          const buttonCell = document.createElement('td');
          const button = document.createElement('button');
          button.textContent = 'Add to Cart';
          button.onclick = () => {
            addToCart(item.itemID, quantitySelector.value);
            loadItemsTable();  // Reload the items table
          };
          buttonCell.appendChild(button);
          row.appendChild(buttonCell);
  
          table.appendChild(row);
        });
      });
  }

  function addToCart(itemID, quantity) {
    console.log(globalusername)
    fetch('/cart/' + itemID + '?username=' + globalusername, { //call the cart api with the item id being added and the user's username
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }), //send the quantity in the body
    })
      .then(response => { //alert user of the result of the api
        if (response.ok) {
          viewCart()
          alert('Item added to cart successfully');
        } else {
          alert('Failed to add item to cart');
        }
      });
      updateTotal();
  }
document.getElementById('loadCartButton').addEventListener('click', viewCart); //add an event listener to viewcart

async function viewCart() {
  // get the needed elements
  const checkoutBtn = document.getElementById('checkoutButton'); 
  const totalAmountDiv = document.getElementById('totalAmountDiv'); 
  if (document.getElementById('paypal-button-container') === 'none') { 
    checkoutBtn.style.display = 'block'; //display the paypal button
  }
  totalAmountDiv.style.display = 'block';
  updateTotal();
  console.log(globalusername)
  await fetch('/carts?username=' + globalusername) //call the carts api
    .then(response => {
      if (!response.ok) { //error handling
        throw new Error(`Network response was not ok. Status: ${response.status}, Status Text: ${response.statusText}`);
      }
      return response.json();
    })
    .then(cart => {
      const table = document.getElementById('cartTable');
      if (!table) { //error handline
        console.error('Could not find table with id "cartTable"');
        return;
      }
      // Clear existing rows
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      const row2 = document.createElement('tr');

      if (table.rows.length === 0) { //add the table rows for the items

        ['Item ID', 'Item Name', 'Item Price', 'Quantity', 'Remove Item'].forEach(key => {
          const cell = document.createElement('th');
          cell.textContent = key;
          row2.appendChild(cell);
        });
      }

      table.appendChild(row2);
      // Add each item to the table
      cart.items.forEach(cartItem => {
        const row = document.createElement('tr');




        // Add item ID, name, price, and quantity to the row
        ['itemID', 'itemName', 'itemPrice'].forEach(key => {
          if(key == 'itemPrice'){
            const cell = document.createElement('td');
            cell.textContent = "$" + cartItem[key];
            row.appendChild(cell);
            }else{
              const cell = document.createElement('td');
              cell.textContent = cartItem[key];
              row.appendChild(cell);
            }
          
        });

        // Add quantity to the row
        const quantityCell = document.createElement('td');
        quantityCell.textContent = cartItem.quantity;
        row.appendChild(quantityCell);

        // Add "Remove from Cart" button and quantity selector to the row
        const buttonCell = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = 'Remove from Cart';

        // Create quantity selector
        const quantitySelector = document.createElement('select');
        for (let i = 1; i <= cartItem.quantity; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.text = i;
          quantitySelector.appendChild(option);
        }

        button.onclick = () => removeFromCart(cartItem.itemID, parseInt(quantitySelector.value));
        buttonCell.appendChild(button);
        buttonCell.appendChild(quantitySelector);
        row.appendChild(buttonCell);

        table.appendChild(row);
      });
      table.hidden = false;

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });


}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("loadCartButton");

// Get the <span> element that closes the modal
var span = document.getElementById("close");

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

span.addEventListener('click', function () {
  modal.style.display = "none";
  console.log("joe")
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Function to remove an item from the cart
function removeFromCart(itemID, quantity) {
  fetch('/cart/' + itemID + '?username=' + globalusername, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  })
  .then(response => {
    if (response.ok) {
      alert('Item quantity updated successfully');
      // Reload the cart table
      viewCart().catch(error => console.error('Error viewing cart:', error));
    } else {
      alert('Failed to update item quantity');
    }
  });
  updateTotal();
}

async function updateTotal() {
  // Make API call to calculate the total amount
  const response = await fetch('/calculate-total?username=' + globalusername);
  const data = await response.json();

  // Update the total amount in the DOM
  document.getElementById('totalAmountSpan').textContent = data.totalAmount;

  if (data.totalAmount === 0) {
    document.getElementById('paypal-button-container').style.display = 'none';
    document.getElementById('checkoutButton').style.display = 'block';
    document.getElementById('cancelButton').style.display = 'none';
  }
}
function redirectToBankAccount(){
  window.location.href = 'bankAccount.html';
}



async function checkout() {
  const checkoutBtn = document.getElementById('checkoutButton');
  const cancelBtn = document.getElementById('cancelButton'); // Ensure you have this button in your HTML
  const paypalContainer = document.getElementById('paypal-button-container');

  const response = await fetch('/calculate-total?username=' + globalusername);
  const data = await response.json();
  const totalAmount = data.totalAmount;

  if (parseFloat(totalAmount) > 0) {
    checkoutBtn.style.display = 'none'; // Hide checkout button
    cancelBtn.style.display = 'block'; // Show cancel button
    paypalContainer.style.display = 'block'; // Show PayPal button container

    // Render PayPal buttons if not already rendered
    if (!paypalContainer.firstChild) { // Check if PayPal buttons are not already rendered
      paypal.Buttons({
        createOrder: function (data, actions) {
          const totalAmount = document.getElementById('totalAmountSpan').textContent; //total amount in the label on html

          const formattedTotalAmount = parseFloat(totalAmount).toFixed(2); //convert to 2 decimal places

          return actions.order.create({
            purchase_units: [{
              amount: {
                value: formattedTotalAmount // Use the most recent total amount
              }
            }]
          });
        },
        onApprove: function (data, actions) {
          // Capture the funds from the transaction
          return actions.order.capture().then(function (details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');
    }
  } else {
    alert('Your cart is empty. Add items before checking out.');
  }
}

// Cancel checkout and hide PayPal buttons
function cancelCheckout() {
  const checkoutBtn = document.getElementById('checkoutButton');
  const cancelBtn = document.getElementById('cancelButton');
  const paypalContainer = document.getElementById('paypal-button-container');

  checkoutBtn.style.display = 'block'; // Show checkout button
  cancelBtn.style.display = 'none'; // Hide cancel button
  paypalContainer.style.display = 'none'; // Hide PayPal button container
}

// Event listener for the cancel button
document.getElementById('cancelButton').addEventListener('click', cancelCheckout);



updateTotal();

async function checkout2() {
  
  // Make API call to calculate the total amount
  const response = await fetch('/calculate-total?username=' + globalusername);
  const data = await response.json();

  if (data.totalAmount > 0) {
    const paymentAmount = prompt('Your total amount: $' + data.totalAmount + '\nEnter payment amount:'); 

    if (paymentAmount >= data.totalAmount) {
      // Proceed with the payment
      const paymentResponse = await fetch('/process-payment?username=' + globalusername, { //call the api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentAmount }), //send the amount in the body
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        alert('Payment successful!');
        // Clear the cart or perform other necessary actions
      } else {
        alert('Payment failed. Please try again.');
      }
    } else {
      alert('Invalid payment amount. Please enter an amount equal to or greater than the total.');
    }
  } else {
    alert('Your cart is empty. Add items before checking out.');
  }
}


const showTransactionHistory = async () => {
  const username = globalusername; //get the username
  const response = await fetch(`/transactions?username=${username}`); //send the username in the request
  const transactionHistory = await response.json();

  // Display transaction history
  displayTransactionHistory(transactionHistory);
};

const displayTransactionHistory = (transactions) => {
  const transactionList = document.getElementById('transactionList');

  // Clear existing entries
  transactionList.innerHTML = '';

  // Append new entries
  transactions.forEach(transaction => {
    const transactionItem = document.createElement('li');
    transactionItem.textContent = `Date: ${transaction.timestamp}, Total: ${transaction.total}`;
    transactionList.appendChild(transactionItem);
  });

  // Show the modal
  const transactionHistoryModal = document.getElementById('transactionHistoryModal');
  transactionHistoryModal.style.display = 'block';
};

const closeTransactionHistoryModal = () => {
  // Close the modal
  const transactionHistoryModal = document.getElementById('transactionHistoryModal');
  transactionHistoryModal.style.display = 'none';
};
const closeManageAccountModal = () => {
  const manage = document.getElementById('manageAccountModal');
  manage.style.display = 'none';
}
// Attach the checkout function to the checkout button
document.getElementById('checkoutButton').addEventListener('click', checkout);





var globalBankUsername;
const showBankLogin = () => { //function used for showing bank login screen

  const bankLoginModal = document.getElementById('bankLoginModal');
  bankLoginModal.style.display = 'block';
  
};

const closeBankLoginModal = () => { //closing bank login
  const bankLoginModal = document.getElementById('bankLoginModal');
  bankLoginModal.style.display = 'none';
};

async function loginToBank() { //login function for bank
  //retrieve needed data
  const bankUsername = document.getElementById('bankUsername').value;
  const bankPassword = document.getElementById('bankPassword').value;

  const response = await fetch('/bank-login', { //call the bank-login api
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: bankUsername, password: bankPassword }), //add the username and password in the body
  });

  const data = await response.json();
  globalBankUsername = bankUsername;
  if (data.success) {
    alert('Bank login successful');
    closeBankLoginModal();
    globalBankUsername = bankUsername;
    displayAccounts();


  } else {
    alert('Bank login failed. Please check your credentials.');
  }
};


async function displayAccounts() {
  console.log(globalBankUsername);
  const accountDiv = document.getElementById('accountsList');
  accountDiv.innerHTML = ''

  const confirmPurchase = document.getElementById('confirmPurchase');
  confirmPurchase.style.display = 'block';
  document.getElementById('transdiv').style.display = 'block';

  const response = await fetch(`/user-accounts?username=${globalBankUsername}`); //call the user-accounts api
  const data = await response.json();
  const accountsList = document.getElementById('accountsList');
  console.log("Accounts List Element:", accountsList);

  if (!accountsList) {
    console.error("Element with id 'accountsList' not found.");
    return;
  }

  data.accounts.forEach(account => { //display the accounts the user has in the accountsList div
    const accountDiv = document.createElement('div');
    accountDiv.innerHTML = `<h3>${account.type}</h3><p>Balance: ${account.balance}</p><p>Account Number: ${account.id}`;

    accountDiv.addEventListener('click', () => showTransactionModal(account.id));
    accountsList.appendChild(accountDiv);
  });

};

const confirm = async () => {
  const selectedAccountId = document.getElementById('id').value;

  const response = await fetch(`/confirm?username=${globalBankUsername}&nonBankUsername=${globalusername}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accountId: selectedAccountId }),
});


  const data = await response.json();

  if (data.success) {
    alert('Purchase successful');
    displayAccounts(); // Refresh account list
    
  } else {
    alert('Purchase failed. Please try again.');
  }
};

document.getElementById('checkoutButton2').addEventListener('click', showBankLogin); //add event listener to showbanklogin





