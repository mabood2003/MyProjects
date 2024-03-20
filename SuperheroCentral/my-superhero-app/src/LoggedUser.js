//import all needed dependencies
import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import CreateListForm from './createList'; 
import axios from 'axios';
import './css/LoggedUser.css'
import Footer from './Footer';
//initialize all the use states
const LoggedUser = ({ onLogout, userInfo }) => {
  const [userLists, setUserLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [expandedHeroInfo, setExpandedHeroInfo] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editList, setEditList] = useState({
    name: '',
    description: '',
    superHeros: '',
    visibility: '',
  });

  useEffect(() => {
    if (userInfo && userInfo.email) { //check that userinfo has an email and is not undefined
      fetchUserLists();
    } else { //if no user email means they are not logged in so redirect to login page
      return <Redirect to="/login" />;
    }
  }, [userInfo.email]);


  const handleLogout = () => { //logout function
    onLogout();
  };
  const handlePasswordChange = (e) => { //handle password change form change
    const { name, value } = e.target;
    if (name === 'newPassword') { //if its new password set the new password
      setNewPassword(value);
    } else if (name === 'confirmPassword') { //otherwise set the confirm password
      setConfirmPassword(value);
    }
  };
  const handleUpdatePassword = async () => {
    try {
      
      if (newPassword !== confirmPassword) { //check if the passwords in both boxes match
        setPasswordUpdateMessage('Passwords do not match');
        return;
      }

      // make a request to the backend API to update the password
      const response = await axios.post('/update-password', {
        email: userInfo.email,
        newPassword: newPassword,
      });

      if (response.data === 'Password updated') {
        setPasswordUpdateMessage('Password updated successfully'); //alert the user of the change
      } else {
        setPasswordUpdateMessage('Error updating password');
      }
    } catch (error) { //error handline
      console.error('Error updating password:', error);
      setPasswordUpdateMessage('Error updating password');
    }
  };
  const fetchUserLists = async () => {
    try {
      const response = await axios.get('/getMyLists', { //call the get my lists api
        params: { email: userInfo.email }, //pass the user email
      });

      if (response.data) {
        setUserLists(response.data); //set the users lists to the data
      }
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };



  const fetchHeroInfoById = async (superheroId) => { //fetch ther heros by id
    try {
      const response = await axios.get(`/api/superheroinfo/${superheroId}`); //call teh api for getting hero info by id
      setExpandedHeroInfo(response.data); //set the expanded table info to the hero info
    } catch (error) {
      console.error('Error fetching superhero information:', error);
    }
  };

  const toggleExpand = (rowId) => { //function used to handle the expand button toggle
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleExpandToggle = async (listId, superheroId) => { //function for handling the expand toggle
    setSelectedListId(selectedListId === listId ? null : listId);
    if (selectedListId !== listId) {
      // Fetch superhero information only if expanding the row
      await fetchHeroInfoById(superheroId);
    } else {
      setExpandedHeroInfo(null);
    }
  };

  // Function to open the edit modal
  const openEditModal = (list) => {
    setEditList(list);
    setEditModalOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditChange = (e) => { //function to handle the change of the form in the edit pop up
    const { name, value } = e.target;
    setEditList((prevList) => ({ //update the input boexes
      ...prevList,
      [name]: value,
    }));
  };

  const handleUpdateList = async () => { //function used to handle updating lists
    try {
      const response = await axios.put('/update-lists', editList); //call the update list api with the list being editted

      if (response.data) { //if the response has data update the userlists
        setUserLists((prevLists) =>
          prevLists.map((list) =>
            list.name === editList.name ? { ...list, ...editList } : list
          )
        );

        closeEditModal();
        alert("List updated Successfully!") //alert the user of a successful update
      } else {
        alert('Error updating list: The heros you updated do not exist');
      }
    } catch (error) { //err
      alert('Error updating list: The heros you updated do not exist');
    }
  };

  const handleDeleteList = async (listName) => { //handling deleting a list 
    const isConfirmed = window.confirm(`Are you sure you want to delete the list "${listName}"?`); //ask the user to confirm the deletion of the list

    if (!isConfirmed) { //return if it is not confirmed
      return;
    }

    try {
      const response = await axios.delete('/delete-list', { //call the delete list api
        data: { name: listName }, //send the list name to the backend
      });

      if (response.data.success) {
        setUserLists((prevLists) => //update the user lists
          prevLists.filter((list) => list.name !== listName)
        );
        alert("List has been removed!"); //alert the user that list has been removed
      } else {
        console.error('Error deleting list:', response.data.message);
      }
    } catch (error) { //error handling
      console.error('Error deleting list:', error);
    }
  };

  const handleRefresh = () => { //refresh user lists
    fetchUserLists();
  };

  return (
    <div>
      <nav>
        <NavLink to="/">
          <button>
            Home
          </button>
        </NavLink>
        <button onClick={handleLogout}>Logout</button>

        <input
          type="password"
          name="newPassword"
          value={newPassword}
          placeholder="New Password"
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={handlePasswordChange}
        />
        <button onClick={handleUpdatePassword}>Update Password</button>
        {passwordUpdateMessage && <p>{passwordUpdateMessage}</p>}
      </nav>

      <h1>Welcome</h1>

      <CreateListForm userInfo={userInfo} />

      <div>
        <h2>
          My Lists
          <button onClick={handleRefresh}>Refresh</button>
        </h2>
        <table className="superhero-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Heroes Count</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Expand</th>
            </tr>
          </thead>
          <tbody>
            {userLists.map((list) => (
              <React.Fragment key={list.name}>
                <tr>
                  <td>{list.name}</td>
                  <td>{list.superHeros.split(',').length}</td>
                  <td>
                    <button onClick={() => openEditModal(list)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteList(list.name)}>Delete</button>
                  </td>
                  <td>
                    <button onClick={() => handleExpandToggle(list.name, list.superHeros)}>
                      {selectedListId === list.name ? 'Collapse' : 'Expand'}
                    </button>
                  </td>
                </tr>
                {selectedListId === list.name && (
                  <tr>
                    <td colSpan="6">
                      {expandedHeroInfo && (
                        <>
                          <p>Description: {list.description}</p>
                          <p>List of Heroes:</p>
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Powers</th>
                                <th>Publisher</th>
                                <th>Expand</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expandedHeroInfo.map((hero) => (
                                <React.Fragment key={hero.id}>
                                  <tr>
                                    <td>{hero.name}</td>
                                    <td>{hero.powers.join(', ')}</td>
                                    <td>{hero.Publisher}</td>
                                    <td>
                                      <button onClick={() => toggleExpand(hero.id)}>
                                        {expandedRowId === hero.id ? 'Collapse' : 'Expand'}
                                      </button>
                                    </td>
                                  </tr>
                                  {expandedRowId === hero.id && (
                                    <tr>
                                      <td colSpan="4">
                                        {/* Display additional information for the expanded row */}
                                        <strong>ID:</strong> {hero.id}<br />
                                        <strong>Gender:</strong> {hero.Gender}<br />
                                        <strong>Eye Color:</strong> {hero['Eye color']}<br />
                                        <strong>Race:</strong> {hero.Race}<br />
                                        <strong>Hair color:</strong> {hero['Hair color']}<br />
                                        <strong>Height:</strong> {hero.Height}<br />
                                        <strong>Skin Color:</strong> {hero['Skin color']}<br />
                                        <strong>Alignment:</strong> {hero.Alignment}<br />
                                        <strong>Weight:</strong> {hero.Weight}<br />
                                        {/* Add other attributes as needed */}
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>


      {editModalOpen && (
        <div className="overlay">
          <div className="modal-content">
            <h2>Edit List</h2>
            <label>
              Name:
              <input type="text" name="name" value={editList.name} onChange={handleEditChange} readOnly />
            </label>
            <br />
            <label>
              Description:
              <input type="text" name="description" value={editList.description} onChange={handleEditChange} />
            </label>
            <br />
            <label>
              Superheros:
              <input type="text" name="superHeros" value={editList.superHeros} onChange={handleEditChange} />
            </label>
            <br />
            <label>
              Visibility:
              <input type="text" name="visibility" value={editList.visibility} onChange={handleEditChange} />
            </label>
            <button onClick={closeEditModal}>Cancel</button>
            <button onClick={handleUpdateList}>Update</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default LoggedUser;