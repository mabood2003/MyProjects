//import all required dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './Footer';

const Admin = (onLogout) => { 
  //initialize all the use states
  const [users, setUsers] = useState([]);
  const [heroLists, setHeroLists] = useState([]);
  const [heroReviews, setHeroReviews] = useState([]);
  const [policyPages, setPolicyPages] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyContent, setPolicyContent] = useState('');
  const [dmcaToolsContent, setDmcaToolsContent] = useState('');
  const [dmcaEntryFormData, setDmcaEntryFormData] = useState({
    reviewId: '',
    dateRequestReceived: '',
    dateNoticeSent: '',
    dateDisputeReceived: '',
    notes: '',
  });

  
  const refreshUsers = () => { //function used for refreshing the users table
    axios.get('/users') //call the users api
      .then(response => setUsers(response.data)) //update the state of users
      .catch(error => console.error('Error fetching users:', error));
  };
  const refreshHeroReviews = () => { //function used for refreshing hero reviews table
    axios.get('/hero-reviews') //call the hero reviews api
      .then(response => setHeroReviews(response.data)) //update the state of hero reviews
      .catch(error => console.error('Error fetching hero reviews:', error));
  }

  const toggleAccountStatus = (email, isDisabled) => { //pass the email and whether the account is disabled or not as parameters
    const action = isDisabled ? 'enable' : 'disable'; //change the action depending on the state of isdisabled
    axios.post(`/${action}-account`, { email }) //call the action-account api with email
      .then(response => {
        console.log(`Account ${action}d for ${email}`); //log what has been done to the account whether its been disabled or enabled
        alert(`Account has been ${action}d`) //alert the user of whats been done
        refreshUsers(); //refresh the users table

      })
      .catch(error => {
        console.error(`Error ${action}ing account:`, error);
      });
  };
  const hideReview = (reviewId) => { //function for hiding a user review
    axios.post('/hide-review', { reviewId }) //pass the reviewId in the request
      .then(response => {
        alert(`Review with ID ${reviewId} hidden`); //alert the user of what happned
        refreshHeroReviews(); //refresh the hero reviews table
      })
      .catch(error => {
        console.error('Error hiding review:', error);
      });
  };
  
  const unhideReview = (reviewId) => {//function for unhiding a review
    axios.post('/unhide-review', { reviewId }) //send the review id in the request
      .then(response => {
        alert(`Review with ID ${reviewId} unhidden`); //alert the user of whats been done
        refreshHeroReviews();
      })
      .catch(error => {
        console.error('Error unhiding review:', error);
      });
  };
  useEffect(() => {
    //retrieve all the data for users table
    axios.get('/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
    //retrieve all the data for hero lists table
    axios.get('/hero-lists')
      .then(response => setHeroLists(response.data))
      .catch(error => console.error('Error fetching hero lists:', error));
    //retrieve all the data for hero reviews table
    axios.get('/hero-reviews')
      .then(response => setHeroReviews(response.data))
      .catch(error => console.error('Error fetching hero reviews:', error));
    //retrieve all the data for policy pages 
    axios.get('/api/policy-pages')
      .then(response => setPolicyPages(response.data))
      .catch(error => console.error('Error fetching policy pages:', error));
    //retrieve the data for the dmca_tools page
    axios.get('/api/policy/dmca_tools')
      .then(response => setDmcaToolsContent(response.data.content))
      .catch(error => console.error('Error fetching DMCA Tools content:', error));
  }, []);


  const giveAdminPermission = (email) => { //function used to give site manager permission to a user
    axios.post('/make-admin', { email }) //call the make-admin api
      .then(response => {
        alert(`Admin permission given to ${email}`); //alert the user of what has been done
      })
      .catch(error => { //error handling
        console.error('Error giving admin permission:', error);
      });
  };

 
  
  const handleEditPolicy = (type) => { //function used to handle editing a policy by an admin
    axios.get(`/api/policy/${type}`) //get request for the policy
      .then(response => {
        setPolicyContent(response.data.content); //set the policy content in the edit text to the data returned
        setSelectedPolicy(type);
      })
      .catch(error => console.error('Error fetching policy content:', error));
  };

  const handleUpdatePolicy = () => { //function used to handle when an admin changes the text in a policy
    axios.put(`/api/update-policy/${selectedPolicy}`, { content: policyContent }) //call the update policy api with the selectedpolicy sent in the query and the content in teh body
      .then(response => {
        alert('Policy updated successfully'); //alert the user of the update
        setSelectedPolicy(null);
        setPolicyContent('');
      })
      .catch(error => {
        console.error('Error updating policy:', error);
      });
  };
  
  const handleDmcaEntryFormChange = (e) => { //this handles when the form values change in the dmca form
    const { name, value } = e.target;
    setDmcaEntryFormData(prevData => ({ //set the dmca form value to the new one 
      ...prevData,
      [name]: value,
    }));
  };

  const handleDmcaEntryFormSubmit = (e) => { //function used to handle the dmca form submit button
    e.preventDefault();

    const formatDate = (dateString) => new Date(dateString).toISOString().split('T')[0];
    if(!dmcaEntryFormData.reviewId|| !dmcaEntryFormData.dateRequestReceived || !dmcaEntryFormData.dateNoticeSent || !dmcaEntryFormData.dateDisputeReceived ||!dmcaEntryFormData.notes){
      alert("please fill out all of the fields") //alert the user if any of the fields have not been filled in
      return
    }
    const formattedData = { //assign all the form data to formattedData so that the dates get entered correctly
      reviewId: dmcaEntryFormData.reviewId,
      dateRequestReceived: formatDate(dmcaEntryFormData.dateRequestReceived), //formatDate function used for proper data formatting
      dateNoticeSent: formatDate(dmcaEntryFormData.dateNoticeSent),
      dateDisputeReceived: formatDate(dmcaEntryFormData.dateDisputeReceived),
      notes: dmcaEntryFormData.notes,
    };

    axios.post('/api/insert-dmca-entry', formattedData) //call the insert dmca entry api with the data
      .then(response => {
        alert('DMCA entry added successfully'); //alert the user of a successful entry
        setDmcaEntryFormData({ //reset the form data
          reviewId: '',
          dateRequestReceived: '',
          dateNoticeSent: '',
          dateDisputeReceived: '',
          notes: '',
        });
      })
      .catch(error => { //error handling
        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
          console.error('No response received from the server');
        } else {
          console.error('Error setting up the request:', error.message);
        }
      });
  };
  const handleDatePickerChange = (name, date) => { //functionused to handle when the datepicker value is changed
    handleDmcaEntryFormChange({ target: { name, value: date } }, name); //call the dmcaformchange function to apply the change of the date
  };
  
  return (
    <div>
      <nav>
        <NavLink to="/">
            <button>
              Home
            </button>
          </NavLink>
        <NavLink to="/loggedUser">
            <button>
              My Account 
            </button>
          </NavLink>
      </nav>
      <h2>Users</h2>
      <table className='superhero-table'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nickname</th>
            <th>isDisabled?</th>
            <th>Verified</th>
            <th>Admin</th>
            <th>Make Admin</th>
            <th>Disable Account</th>

          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.nickname}</td>
              <td>{user.isDisabled}</td>
              <td>{user.verified}</td>
              <td>{user.isAdmin}</td>
              <td>
                <button onClick={() => giveAdminPermission(user.email)}>
                  Give Admin
                </button>
              </td>
              <td>
                {user.isDisabled ? (
                  <button onClick={() => toggleAccountStatus(user.email, true)}>
                    Enable Account
                  </button>
                ) : (
                  <button onClick={() => toggleAccountStatus(user.email, false)}>
                    Disable Account
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Hero Lists</h2>
      <table className='superhero-table'>
        <thead>
          <tr>
            <th>List Name</th>
            <th>Description</th>
            <th>Creator Email</th>
            <th>Visibility</th>
          </tr>
        </thead>
        <tbody>
          {heroLists.map(heroList => (
            <tr key={heroList.name}>
              <td>{heroList.name}</td>
              <td>{heroList.description}</td>
              <td>{heroList.creatorEmail}</td>
              <td>{heroList.visibility}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Hero Reviews</h2>
      <table className='superhero-table'>  
        <thead>
          <tr>
            <th>Review ID</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>List Name</th>
            <th>Reviewer Email</th>
            <th>Hide</th>
          </tr>
        </thead>
        <tbody>
          {heroReviews.map(review => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
              <td>{review.listName}</td>
              <td>{review['reviewer_email']}</td>
              <td>
                {review.isHidden ? (
                  <button onClick={() => unhideReview(review.id)}>
                    Unhide
                  </button>
                ) : (
                  <button onClick={() => hideReview(review.id)}>
                    Hide
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Policy Pages</h2>
      <div>
        <h2>DMCA Tools <Link to="/DMCA_tools"><button>Show DMCA Tools</button></Link>
        </h2>
      </div>
      <h2>Create DMCA Entry</h2>
      <form onSubmit={handleDmcaEntryFormSubmit} id='forms'>
        <label>
          Review ID:
          <input
            type="text"
            name="reviewId"
            value={dmcaEntryFormData.reviewId}
            onChange={handleDmcaEntryFormChange}
          />
        </label>
        <br />
        <label>
          Date Request Received:
          <DatePicker
            selected={dmcaEntryFormData.dateRequestReceived}
            onChange={(date) => handleDatePickerChange('dateRequestReceived', date)}
          />
        </label>
        <br />
        <label>
          Date Notice Sent:
          <DatePicker
            selected={dmcaEntryFormData.dateNoticeSent}
            onChange={(date) => handleDatePickerChange('dateNoticeSent', date)}
          />
        </label>
        <br />
        <label>
          Date Dispute Received:
          <DatePicker
            selected={dmcaEntryFormData.dateDisputeReceived}
            onChange={(date) => handleDatePickerChange('dateDisputeReceived', date)}
          />
        </label>
        <br />
        <label>
          Notes:
          <textarea
            name="notes"
            value={dmcaEntryFormData.notes}
            onChange={handleDmcaEntryFormChange}
          />
        </label>
        <br />
        <button type="submit">Submit DMCA Entry</button>
      </form>
      <table className='superhero-table'>
        <thead>
          <tr>
            <th>Type</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {policyPages.map(policy => (
            <tr key={policy.type}>
              <td>{policy.type}</td>
              <td>
                <button onClick={() => handleEditPolicy(policy.type)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPolicy && (
        <div>
          <h2>Edit Policy: {selectedPolicy}</h2>
          <textarea
            value={policyContent}
            onChange={(e) => setPolicyContent(e.target.value)}
            rows={10}
            cols={50}
          />
          <br />
          <button onClick={handleUpdatePolicy}>Update Policy</button>
        </div>
      )}
      <div>
      <Footer />
      </div>
    </div>
    
  );
};

export default Admin;