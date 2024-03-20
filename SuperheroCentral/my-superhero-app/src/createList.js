//import all needed dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateListForm = ({ userInfo }) => {
  //initialize all the usestates
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [superHeros, setSuperHeros] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [nickname, setNickname] = useState('');

  useEffect(() => { //use the use effect function for getting the nickname
    const fetchNickname = async () => {
      try {
        const response = await axios.get('/getNickname', { //call the getnicnkname api
        params: { email: userInfo.email }, //pass the users email 
        });
        if (response.data && response.data.nickname) { //if the response contains a nickname
          setNickname(response.data.nickname); //update the state of nickname to the nickname returned
        }
      } catch (error) {
        console.error('Error fetching nickname:', error);
      }
    };

    fetchNickname();
  }, [userInfo.email]); 

  const handleSubmit = async (e) => { //function used for handling the submit of a create list
    e.preventDefault();

    const formData = { //get all the data in the form
      name: listName,
      description,
      superHeros,
      visibility,
      creatorEmail: userInfo.email, 
      creatorNickname: nickname,
    };

    try {
      console.log(userInfo);
    
      const response = await axios.post('/create-list', formData, { //call the create list api and pass the form data
        validateStatus: function (status) {
          return status >= 200 && status < 401; 
        },
      });
    
      console.log(response.data);
    
      if (response.status === 201) {
        alert("List has been created!"); //alert user if the list has been created
      } else {
        alert(`Error: ${response.data.message}`); //alert if the user has 20 lists already or one of the superheros doesnt exist
      }
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }
  return (
      <form onSubmit={handleSubmit} >
      <label>List Name:</label>
      <input type="text" value={listName} onChange={(e) => setListName(e.target.value)} required />

      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Super Heroes:</label>
      <input type="text" value={superHeros} onChange={(e) => setSuperHeros(e.target.value)} required />

      <label>Visibility:</label>
      <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>

      <button type="submit">Create List</button>
    </form>
    
  );
};

export default CreateListForm;