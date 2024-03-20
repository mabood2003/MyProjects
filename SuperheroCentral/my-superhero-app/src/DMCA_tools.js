//import all the needed dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
const DMCA_tools = () => {
  const [policyContent, setPolicyContent] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('/api/policy/dmca_tools'); //call the policy for dmca_tools api

        if (response.data && response.data.content) {
          console.log(response.data.content);
          setPolicyContent(response.data.content); //set the policy content to the response data
        } else {
          console.error('Invalid response data:', response.data); //handle any errors in the console
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPolicy();
  }, []);

  return (
    
    <div>
      <nav id="main-nav">
        <NavLink to="/admin">
            <button>
              Back to admin
            </button>
          </NavLink>
      </nav>
      <div dangerouslySetInnerHTML={{ __html: policyContent }} />
    </div>
  );
};

export default DMCA_tools;