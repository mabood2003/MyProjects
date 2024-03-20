//import all needed dependecies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const AcceptableUsePolicy = () => {
  const [policyContent, setPolicyContent] = useState(''); //initialize a policy content use state

  useEffect(() => { //use the useeffect so if content changes it can be updated 
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('/api/policy/acceptable_use_policy'); //call the backend api for retrieving the policy

        if (response.data && response.data.content) { //if the response has data and content
          console.log(response.data.content);
          setPolicyContent(response.data.content); //set the policy content to the data response content
        } else {
          console.error('Invalid response data:', response.data);
        }
      } catch (error) { //error handling
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

export default AcceptableUsePolicy;