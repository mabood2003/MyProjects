function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login successful') {
        alert('Login successful!');
        window.location.href= 'customerHome.html'
      } else {
        alert('Login failed. Please check your credentials.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
  }


  function register() {
    const regEmail = document.getElementById('regEmail').value;
    const regPassword = document.getElementById('regPassword').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const DOB = document.getElementById('DOB').value;
  
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: regEmail, password: regPassword, firstName, lastName, DOB }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Registration successful') {
          alert('Registration successful!');
        } else {
          alert('Registration failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });

      
  }
  function adminLogin() {
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;
  
    fetch('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: adminUsername, password: adminPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Admin login successful') {
          alert('Admin login successful!');
          window.location.href= "admin.html"
        } else {
          alert('Admin login failed. Please check your credentials.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });
  }


function toggleStadiumForm() {
  const formOld = document.getElementById('eventForm');
  const formOld2 = document.getElementById('sectionForm');
  const formOld3 = document.getElementById('seatForm');
  const formOld4 = document.getElementById('rowForm');
  const formOld5 = document.getElementById('sectionRowForm');
  formOld.style.display = 'none';
  formOld2.style.display = 'none';
  formOld3.style.display = 'none';
  formOld4.style.display = 'none';
  formOld5.style.display = 'none';
  event.preventDefault();
    const form = document.getElementById('stadiumForm');
    const displayStatus = form.style.display;

    if (displayStatus === 'none' || displayStatus === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function toggleEventForm() {
  const selectElement = document.getElementById('stadiumSelect');
  resetDropdown('stadiumSelect', 'Select a stadium')
  selectElement.disabled = false; //Disable the dropdown
  fetch('/stadiums')
  .then(response => response.json())
  .then(stadiums => {
    const selectElement = document.getElementById('stadiumSelect');
    
    stadiums.forEach(stadium => {
      const option = document.createElement('option');
      option.value = stadium.stadiumID;
      option.textContent = stadium.name;
      selectElement.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching stadiums:', error);
  });
  const formOld = document.getElementById('stadiumForm');
  const formOld2 = document.getElementById('sectionForm');
  const formOld3 = document.getElementById('seatForm');
  const formOld4 = document.getElementById('rowForm');
  const formOld5 = document.getElementById('sectionRowForm');
  formOld.style.display = 'none';
  formOld2.style.display = 'none';
  formOld3.style.display = 'none';
  formOld4.style.display = 'none';
  formOld5.style.display = 'none';
  event.preventDefault();
  const form = document.getElementById('eventForm');
  const displayStatus = form.style.display;

  if (displayStatus === 'none' || displayStatus === '') {
      form.style.display = 'block';
  } else {
      form.style.display = 'none';
  }

//Event listener for the stadium dropdown change
document.getElementById('stadiumSelect').addEventListener('change', function() {
  const selectedOption = this.options[this.selectedIndex];
  const stadiumIdLabel = document.getElementById('stadiumIdLabel');
  
  //Update the label with the stadium ID
  stadiumIdLabel.textContent = selectedOption.value;
});
}

function toggleSectionForm() {
  const selectElement = document.getElementById('stadiumSelect2');
  resetDropdown('stadiumSelect2', 'Select a stadium')
  selectElement.disabled = false; //Disable the dropdown
  fetch('/stadiums')
  .then(response => response.json())
  .then(stadiums => {
    const selectElement = document.getElementById('stadiumSelect2');
    stadiums.forEach(stadium => {
      const option = document.createElement('option');
      option.value = stadium.stadiumID;
      option.textContent = stadium.name;
      selectElement.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching stadiums:', error);
  });
  const formOld = document.getElementById('stadiumForm');
  const formOld2 = document.getElementById('eventForm');
  const formOld3 = document.getElementById('seatForm');
  const formOld4 = document.getElementById('rowForm');
  const formOld5 = document.getElementById('sectionRowForm');
  formOld.style.display = 'none';
  formOld2.style.display = 'none';
  formOld3.style.display = 'none';
  formOld4.style.display = 'none';
  formOld5.style.display = 'none';
  event.preventDefault();
  const form = document.getElementById('sectionForm');
  const displayStatus = form.style.display;

  if (displayStatus === 'none' || displayStatus === '') {
      form.style.display = 'block';
  } else {
      form.style.display = 'none';
  }

  

//Event listener for the stadium dropdown change
document.getElementById('stadiumSelect2').addEventListener('change', function() {
  const selectedOption = this.options[this.selectedIndex];
  const stadiumIdLabel = document.getElementById('stadiumIdLabel2');
  
  //Update the label with the stadium ID
  stadiumIdLabel.textContent = selectedOption.value;
});
}

function toggleRowForm() {
  const selectElement = document.getElementById('stadiumSelect4');
  resetDropdown('stadiumSelect4', 'Select a stadium')
  selectElement.disabled = false; //Disable the dropdown
  fetch('/stadiums')
  .then(response => response.json())
  .then(stadiums => {
    const selectElement = document.getElementById('stadiumSelect4');
    stadiums.forEach(stadium => {
      const option = document.createElement('option');
      option.value = stadium.stadiumID;
      option.textContent = stadium.name;
      selectElement.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching stadiums:', error);
  });
  const formOld = document.getElementById('stadiumForm');
  const formOld2 = document.getElementById('eventForm');
  const formOld3 = document.getElementById('seatForm');
  const formOld4 = document.getElementById('sectionForm');
  const formOld5 = document.getElementById('sectionRowForm');
  formOld.style.display = 'none';
  formOld2.style.display = 'none';
  formOld3.style.display = 'none';
  formOld4.style.display = 'none';
  formOld5.style.display = 'none';
  event.preventDefault();
  const form = document.getElementById('rowForm');
  const displayStatus = form.style.display;

  if (displayStatus === 'none' || displayStatus === '') {
      form.style.display = 'block';
  } else {
      form.style.display = 'none';
  }

  

//Event listener for the stadium dropdown change
document.getElementById('stadiumSelect4').addEventListener('change', function() {
  const selectedOption = this.options[this.selectedIndex];
  const stadiumIdLabel = document.getElementById('stadiumIdLabel4');
  
  //Update the label with the stadium ID
  stadiumIdLabel.textContent = selectedOption.value;
});
}

function toggleSeatForm() {
  document.getElementById('sectionSelect').disabled = true;
  document.getElementById('rowSelect').disabled = true;
  document.getElementById('sectionRowSelect').disabled = true;
  const stadiumIdLabel3 = document.getElementById('stadiumIdLabel3');
  const sectionIdLabel = document.getElementById('sectionIdLabel');
  const rowIdLabel = document.getElementById('rowIdLabel');
  
  //Fetch and populate stadiums dropdown
  fetch('/stadiums')
    .then(response => response.json())
    .then(stadiums => {
      populateDropdown('stadiumSelect3', stadiums, 'name', 'stadiumID', 'Select a stadium');
    })
    .catch(error => {
      console.error('Error fetching stadiums:', error);
    });

  //Add event listener for when a stadium is selected to populate sections
  document.getElementById('stadiumSelect3').addEventListener('change', function() {
    const stadiumID = this.value;
    stadiumIdLabel3.textContent = stadiumID;
    document.getElementById('sectionSelect').disabled = !stadiumID;
    //Fetch sections for the selected stadium
    fetch(`/sections?stadiumID=${stadiumID}`)
      .then(response => response.json())
      .then(sections => {
        console.log(sections)
        populateDropdown('sectionSelect', sections, 'sectionNumber', 'sectionID', 'Select a section');
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
      });

      sectionIdLabel.textContent = 'ID';
      rowIdLabel.textContent ='ID';
      resetDropdown('rowSelect', 'Select a row')
      resetDropdown('sectionRowSelect', 'Select a section row')
      document.getElementById('rowSelect').disabled = true;
      document.getElementById('sectionRowSelect').disabled = true;
  });

  //Add event listener for when a section is selected to populate rows
  document.getElementById('sectionSelect').addEventListener('change', function() {
    const stadiumID = document.getElementById('stadiumSelect3').value;
    sectionIdLabel.textContent = this.value;
    document.getElementById('rowSelect').disabled = !this.value;
    fetch(`/rows?stadiumID=${stadiumID}`)
      .then(response => response.json())
      .then(rows => {
        populateDropdown('rowSelect', rows, 'rowNumber', 'rowID', 'Select a row');
      })
      .catch(error => {
        console.error('Error fetching rows:', error);
      });
      rowIdLabel.textContent ='ID';
      resetDropdown('sectionRowSelect', 'Select a section row')
      document.getElementById('sectionRowSelect').disabled = true;
  });

  //Add event listener for when a row is selected to populate section rows
  document.getElementById('rowSelect').addEventListener('change', function() {
    const sectionID = document.getElementById('sectionSelect').value;
    const rowID = this.value;
    rowIdLabel.textContent =rowID;
    document.getElementById('sectionRowSelect').disabled = !this.value;
    //Fetch section rows for the selected section and row
    fetch(`/sectionRow?sectionID=${sectionID}&rowID=${rowID}`)
      .then(response => response.json())
      .then(sectionRows => {
        populateDropdown('sectionRowSelect', sectionRows, 'sectionRowID', 'sectionRowID', 'Select a section row');
      })
      .catch(error => {
        console.error('Error fetching section rows:', error);
      });
  });


  const formOld = document.getElementById('stadiumForm');
  const formOld2 = document.getElementById('eventForm');
  const formOld3 = document.getElementById('sectionForm');
  const formOld4 = document.getElementById('rowForm');
  const formOld5 = document.getElementById('sectionRowForm');
  formOld.style.display = 'none';
  formOld2.style.display = 'none';
  formOld3.style.display = 'none';
  formOld4.style.display = 'none';
  formOld5.style.display = 'none';
  event.preventDefault();
  const form = document.getElementById('seatForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function toggleSectionRowForm() {
  document.getElementById('sectionSelect5').disabled = true;
  document.getElementById('rowSelect5').disabled = true;
  const stadiumIdLabel = document.getElementById('stadiumIdLabel5');
  const sectionIdLabel = document.getElementById('sectionIdLabel5');
  const rowIdLabel = document.getElementById('rowIdLabel5');
  
  //Fetch and populate stadiums dropdown
  fetch('/stadiums')
    .then(response => response.json())
    .then(stadiums => {
      populateDropdown('stadiumSelect5', stadiums, 'name', 'stadiumID', 'Select a stadium');
    })
    .catch(error => {
      console.error('Error fetching stadiums:', error);
    });

  //Add event listener for when a stadium is selected to populate sections
  document.getElementById('stadiumSelect5').addEventListener('change', function() {
    const stadiumID = this.value;
    stadiumIdLabel.textContent = stadiumID;
    document.getElementById('sectionSelect5').disabled = !stadiumID;
    //Fetch sections for the selected stadium
    fetch(`/sections?stadiumID=${stadiumID}`)
      .then(response => response.json())
      .then(sections => {
        populateDropdown('sectionSelect5', sections, 'sectionNumber', 'sectionID', 'Select a section');
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
      });

      sectionIdLabel.textContent = 'ID';
      rowIdLabel.textContent ='ID';
      resetDropdown('rowSelect5', 'Select a row')
      document.getElementById('rowSelect5').disabled = true;
  });

  //Add event listener for when a section is selected to populate rows
  document.getElementById('sectionSelect5').addEventListener('change', function() {
    const stadiumID = document.getElementById('stadiumSelect5').value;
    sectionIdLabel.textContent = this.value;
    document.getElementById('rowSelect5').disabled = !this.value;
    fetch(`/rows?stadiumID=${stadiumID}`)
      .then(response => response.json())
      .then(rows => {
        populateDropdown('rowSelect5', rows, 'rowNumber', 'rowID', 'Select a row');
      })
      .catch(error => {
        console.error('Error fetching rows:', error);
      });
      rowIdLabel.textContent ='ID';
  });

  //Add event listener for when a row is selected to populate section rows
  document.getElementById('rowSelect5').addEventListener('change', function() {
    const rowID = this.value;
    rowIdLabel.textContent =rowID;
  });

  const formOld = document.getElementById('stadiumForm');
  const formOld2 = document.getElementById('eventForm');
  const formOld3 = document.getElementById('sectionForm');
  const formOld4 = document.getElementById('rowForm');
  const formOld5 = document.getElementById('seatForm');
  formOld.style.display = 'none';
  formOld2.style.display = 'none';
  formOld3.style.display = 'none';
  formOld4.style.display = 'none';
  formOld5.style.display = 'none';
  event.preventDefault();
  const form = document.getElementById('sectionRowForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function resetDropdown(dropdownId, defaultText) {
  const selectElement = document.getElementById(dropdownId);
  selectElement.innerHTML = ''; //Clear existing options
  selectElement.appendChild(new Option(defaultText, '', true, true)); //Add default option
  selectElement.disabled = true; //Disable the dropdown
}

function populateDropdown(dropdownId, items, textKey, valueKey, defaultText) {
  const selectElement = document.getElementById(dropdownId);
  selectElement.innerHTML = ''; //Clear existing options
  selectElement.appendChild(new Option(defaultText, '', false, false)); //Add default option
  selectElement.disabled = false; //Enable the dropdown
  
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueKey];
    option.textContent = item[textKey];
    selectElement.appendChild(option);
  });
}





function addStadium() {
  //Get values from the input fields
  const stadiumID = document.getElementById('stadiumID').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const province = document.getElementById('province').value;
  const country = document.getElementById('country').value;
  const name = document.getElementById('stadiumName').value;

  //Create a stadium object with the data
  const stadiumData = {
      stadiumID: stadiumID,
      address: address,
      city: city,
      province: province,
      country: country,
      name: name
  };

  //Use fetch to send a POST request to the server
  fetch('/stadiums', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(stadiumData),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); 
  })
  .then(data => {
      alert('Stadium added successfully!');
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function addEvent() {
  const eventID = document.getElementById('eventID').value;
  const name = document.getElementById('eventName').value;
  const date = document.getElementById('eventDate').value;
  const basePrice = document.getElementById('basePrice').value;
  const stadiumID = document.getElementById('stadiumSelect').value;

  const eventData = {
    eventID: eventID,
    name: name,
    date: date,
    basePrice: basePrice,
    stadiumID: stadiumID
  };

  fetch('/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    alert('Event added successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function addSection() {
  const sectionID = document.getElementById('sectionID').value;
  const sectionNumber = document.getElementById('sectionNumber').value;
  const sectionMultiplier = document.getElementById('sectionMultiplier').value;
  const stadiumID = document.getElementById('stadiumSelect2').value;

  const sectionData = {
    sectionID: sectionID,
    sectionNumber: sectionNumber,
    sectionMultiplier:sectionMultiplier,
    stadiumID: stadiumID
  };

  fetch('/sections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sectionData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    alert('Section added successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function addRow() {
  const rowID = document.getElementById('rowID').value;
  const rowNumber = document.getElementById('rowNumber').value;
  const rowMultiplier = document.getElementById('rowMultiplier').value;
  const stadiumID = document.getElementById('stadiumSelect4').value;

  const sectionData = {
    rowID: rowID,
    rowNumber: rowNumber,
    rowMultiplier:rowMultiplier,
    stadiumID: stadiumID
  };

  fetch('/rows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sectionData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    alert('Row added successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function addSeat() {
  const seatID = document.getElementById('seatID').value;
  const seatNumber = document.getElementById('seatNumber').value;
  const sectionRowID = document.getElementById('sectionRowSelect').value; //This should be the ID of the sectionRow, not the stadium

  const seatData = {
    seatID: seatID,
    seatNumber: seatNumber,
    sectionRowID: sectionRowID
  };

  fetch('/seats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(seatData),
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) });
    }
    return response.json();
  })
  .then(data => {
    alert('Seat added successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error);
  });
}

function addSectionRow() {
  const sectionRowID = document.getElementById('sectionRowID5').value;
  const sectionID = document.getElementById('sectionSelect5').value;
  const rowID = document.getElementById('rowSelect5').value;

  const sectionRowData = {
    sectionRowID: sectionRowID,
    sectionID: sectionID,
    rowID: rowID
  };

  fetch('/sectionRows', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sectionRowData),
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) });
    }
    return response.json();
  })
  .then(data => {
    alert('Section Row added successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error);
  });
}


  

getStadiums()
function getStadiums() {
  fetch('/stadiums')
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('stadiumTable');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the button column
              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);

              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a button
              var buttonCell = document.createElement('td');
              var button = document.createElement('button');
              var deleteBtn = document.createElement('button');
              button.textContent = 'Select';
              deleteBtn.textContent = 'Delete';
              button.onclick = function() {
                getEvents(item.stadiumID);
                getSections(item.stadiumID);
                    getRows(item.stadiumID);
              };
              deleteBtn.onclick = function() {
                deleteStadiums(item.stadiumID)
                
              };
              buttonCell.appendChild(button);
              buttonCell.appendChild(deleteBtn);
              row.appendChild(buttonCell);

              table.appendChild(row);
          });
      });
}

function deleteStadiums(stadiumID){
  fetch('/stadiums?stadiumID=' + stadiumID, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert('Stadium deleted successfully!');
})
.catch(error => {
    console.error('Error during deletion:', error);
});
};

function deleteEvent(eventID){
  fetch('/events?eventID=' + eventID, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert('Event deleted successfully!');
})
.catch(error => {
    console.error('Error during deletion:', error);
});
};

function deleteSection(sectionID){
  fetch('/sections?sectionID=' + sectionID, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert('Section deleted successfully!');
})
.catch(error => {
    console.error('Error during deletion:', error);
});
};

function deleteRow(rowID){
  fetch('/rows?rowID=' + rowID, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert('Row deleted successfully!');
})
.catch(error => {
    console.error('Error during deletion:', error);
});
};

function deleteSectionRow(sectionRowID){
  fetch('/sectionRows?sectionRowID=' + sectionRowID, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert('Section row deleted successfully!');
})
.catch(error => {
    console.error('Error during deletion:', error);
});
};

function deleteSeat(seatID){
  fetch('/seats?seatID=' + seatID, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert('Seat deleted successfully!');
})
.catch(error => {
    console.error('Error during deletion:', error);
});
};

function getEvents(stadiumID) {
  fetch('/events?stadiumID=' + stadiumID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('eventTable');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);
              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              var buttonCell = document.createElement('td');
              var deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Delete';
              deleteBtn.onclick = function() {
                deleteEvent(item.eventID)
              };
              buttonCell.appendChild(deleteBtn);
              row.appendChild(buttonCell);
              table.appendChild(row);
          });


          
      });
}
var selectedSectionID;
var selectedRowID;
function getSections(stadiumID) {
  fetch('/sections?stadiumID=' + stadiumID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('sectionTable');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the checkbox column
              var checkboxHeader = document.createElement('th');
              checkboxHeader.textContent = 'Select';
              header.appendChild(checkboxHeader);

              table.appendChild(header);

              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);
              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a checkbox
              var checkboxCell = document.createElement('td');
              var checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.onclick = function() {
                  selectedSectionID = item.sectionID;
              };
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              table.appendChild(row);

              var buttonCell = document.createElement('td');
              var deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Delete';
              deleteBtn.onclick = function() {
                deleteSection(item.sectionID)
              };
              buttonCell.appendChild(deleteBtn);
              row.appendChild(buttonCell);
              table.appendChild(row);
          });
      });
}

function getRows(stadiumID) {
  fetch('/rows?stadiumID=' + stadiumID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('rowTable');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the checkbox column
              var checkboxHeader = document.createElement('th');
              checkboxHeader.textContent = 'Select';
              header.appendChild(checkboxHeader);

              table.appendChild(header);

              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);
              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a checkbox
              var checkboxCell = document.createElement('td');
              var checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.onclick = function() {
                  selectedRowID = item.rowID;
              };
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              table.appendChild(row);

              var buttonCell = document.createElement('td');
              var deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Delete';
              deleteBtn.onclick = function() {
                deleteRow(item.rowID)
              };
              buttonCell.appendChild(deleteBtn);
              row.appendChild(buttonCell);
              table.appendChild(row);
          });
      });
}

function displaySectionRows() {
  if (selectedSectionID && selectedRowID) {
      getSectionRows(selectedSectionID, selectedRowID);
  } else {
      window.alert('Please select a section and a row.');
  }
}


function getSectionRows(sectionID, rowID) {
  fetch('/sectionRow?sectionID=' + sectionID + '&rowID=' + rowID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('sectionrowTable');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the button column
              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);

              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a button
              var buttonCell = document.createElement('td');
              var button = document.createElement('button');
              var deleteBtn = document.createElement('button');
              button.textContent = 'Select';
              deleteBtn.textContent = 'Delete';
              button.onclick = function() {
                  getSeats(item.sectionRowID);
              };
              deleteBtn.onclick = function() {
                deleteSectionRow(item.sectionRowID)
              };
              buttonCell.appendChild(button);
              buttonCell.appendChild(deleteBtn);
              row.appendChild(buttonCell);

              table.appendChild(row);
          });
      });
}

function getSeats(sectionRowID) {
  fetch('/seat?sectionRowID=' + sectionRowID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('seatTable');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              table.appendChild(header);

              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);
              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              table.appendChild(row);

              var buttonCell = document.createElement('td');
              var deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Delete';
              deleteBtn.onclick = function() {
                deleteSeat(item.seatID)
              };
              buttonCell.appendChild(deleteBtn);
              row.appendChild(buttonCell);
              table.appendChild(row);
          });
      });
}







getStadiumsCust()
function getStadiumsCust() {
  fetch('/stadiums')
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('stadiumTableCust');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the button column
              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);

              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a button
              var buttonCell = document.createElement('td');
              var button = document.createElement('button');
              button.textContent = 'Select';
              button.onclick = function() {
                getEventsCust(item.stadiumID);
                getSectionsCust(item.stadiumID);
                    getRowsCust(item.stadiumID);
              };
              
              buttonCell.appendChild(button);
              row.appendChild(buttonCell);

              table.appendChild(row);
          });
      });
}
function getEventsCust(stadiumID) {
  fetch('/events?stadiumID=' + stadiumID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('eventTableCust');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              
              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
             
              table.appendChild(row);
          });


          
      });
}
var selectedSectionIDCust;
var selectedRowIDCust;
function getSectionsCust(stadiumID) {
  fetch('/sections?stadiumID=' + stadiumID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('sectionTableCust');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the checkbox column
              var checkboxHeader = document.createElement('th');
              checkboxHeader.textContent = 'Select';
              header.appendChild(checkboxHeader);

              table.appendChild(header);

             
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a checkbox
              var checkboxCell = document.createElement('td');
              var checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.onclick = function() {
                  selectedSectionIDCust = item.sectionID;
              };
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              table.appendChild(row);

              
             
          });
      });
}

function getRowsCust(stadiumID) {
  fetch('/rows?stadiumID=' + stadiumID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('rowTableCust');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the checkbox column
              var checkboxHeader = document.createElement('th');
              checkboxHeader.textContent = 'Select';
              header.appendChild(checkboxHeader);

              table.appendChild(header);

             
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a checkbox
              var checkboxCell = document.createElement('td');
              var checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.onclick = function() {
                  selectedRowIDCust = item.rowID;
              };
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              table.appendChild(row);

              
          });
      });
}

function displaySectionRowsCust() {
  if (selectedSectionIDCust && selectedRowIDCust) {
      getSectionRowsCust(selectedSectionIDCust, selectedRowIDCust);
  } else {
      window.alert('Please select a section and a row.');
  }
}


function getSectionRowsCust(sectionID, rowID) {
  fetch('/sectionRow?sectionID=' + sectionID + '&rowID=' + rowID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('sectionrowTableCust');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              //Add header for the button column
              var buttonHeader = document.createElement('th');
              buttonHeader.textContent = 'Action';
              header.appendChild(buttonHeader);

              table.appendChild(header);
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });
              //Add a cell with a button
              var buttonCell = document.createElement('td');
              var button = document.createElement('button');
              button.textContent = 'Select';
              button.onclick = function() {
                  getSeatsCust(item.sectionRowID);
              };
              
              buttonCell.appendChild(button);
              row.appendChild(buttonCell);

              table.appendChild(row);
          });
      });
}

function getSeatsCust(sectionRowID) {
  fetch('/seat?sectionRowID=' + sectionRowID)
      .then(response => response.json())
      .then(data => {
          var table = document.getElementById('seatTableCust');
          table.innerHTML = '';

          //Create table header
          var header = document.createElement('tr');
          if (data.length > 0) {
              Object.keys(data[0]).forEach(key => {
                  var th = document.createElement('th');
                  th.textContent = key;
                  header.appendChild(th);
              });
              table.appendChild(header);

              
          }

          //Create table rows
          data.forEach(item => {
              var row = document.createElement('tr');
              Object.values(item).forEach(value => {
                  var cell = document.createElement('td');
                  cell.textContent = value;
                  row.appendChild(cell);
              });

              
              table.appendChild(row);
          });
      });
}


  