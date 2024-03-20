//import all required dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
const DMCA = () => {
  const [policyContent, setPolicyContent] = useState(''); //initialize the state of the policy content

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('/api/policy/dmca_policy'); //call the policy api to retrieve the dmca policy

        if (response.data && response.data.content) {
          console.log(response.data.content);
          setPolicyContent(response.data.content); //set the policy content the data recieved
        } else {
          console.error('Invalid response data:', response.data); //handle any errors in teh console
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

export default DMCA;