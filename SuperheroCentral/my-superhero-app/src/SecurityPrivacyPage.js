//import needed dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
const SecurityPrivacyPage = () => {
  const [policyContent, setPolicyContent] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('/api/policy/privacy_policy'); //call the policy page retrieval api
        
        if (response.data && response.data.content) {
          console.log(response.data.content);
          setPolicyContent(response.data.content); //set the policy content to the data recieved in the reply
        } else {
          console.error('Invalid response data:', response.data);
        }
      } catch (error) {//error handling
        console.error(error);
      }
    };
  
    fetchPolicy();
  }, []);

  return (
    <div>
      <nav id="main-nav">
        <NavLink to="/">
            <button>
              Home
            </button>
          </NavLink>
      </nav>
      <div dangerouslySetInnerHTML={{ __html: policyContent }} />
    </div>
  );
};

export default SecurityPrivacyPage;