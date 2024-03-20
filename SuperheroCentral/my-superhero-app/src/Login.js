//import the needed dependencies
import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';  


const Login = ({ onLogin, setIsLoggedIn, setUserInfo, setIsAdmin }) => {
  //initialize all the use states
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showRegistration, setShowRegistration] = useState(false); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  const handleSubmit = async (event) => { //function handling submit for registration
    event.preventDefault();

    if (!email || !password || !nickname) { //check that all the registration fields have been entered
      alert('Please fill in all fields.');
      return;
    }
    try {
      const response = await fetch('/register', { //call the register api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ //send the info in the request body
          email,
          password,
          nickname
        })
      });

      if (response.ok) {
        alert('Registration successful! A verification email has been sent. Please check your email and enter the verification token below.'); //alert the user that a token has been sent
        setIsRegistered(true); //set the registered to true so the token box appears
      } else { //error handling
        const errorData = await response.text();
        alert(`Registration failed: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVerify = async () => {
    const response = await fetch(`/verify-email?token=${verificationToken}`); //make a request to the verify-email api

    if (response.ok) {
      alert('Email verified successfully!'); //alert if the verification was successful
      setIsRegistered(false); //set the registered to false
    } else { //error handline
      const data = await response.json();
      alert(data.message);
    }
  };

  const handleLogin = async () => { //function for handling the login 
    if (!credentials.email) { //if no email 
      alert("Please enter an email"); //alert user to enter email
      return;
    } else if (!isValidEmail(credentials.email)) { //if the email does not meet the valid function
      alert("Please enter a valid email address"); //tell user their email is not valid
      return;
    } else if (!credentials.password) { //if no password
      alert("Please enter a password"); //rell user to enter password
      return;
    }
    try {
      const response = await axios.post('/login', { //call the login api 
        email: credentials.email, //pass the email and password
        password: credentials.password,
      });
  
      if (response && response.data) {
        console.log(response.data);
  
        if (response.status === 401) { //if its a 401 then fields havent been filled in
          alert("Please fill out the fields");
        } else if (response.data.isDisabled) { //if the account is disabled tell the user to contact the admin
          alert("Account is deactivated. Please contact the administrator.");
        } else if (!response.data.isVerified) { //if its not verified ask the user if they want the verification email resent
          const shouldResend = window.confirm('Account is not verified. Would you like to resend the verification email?');
          if (shouldResend) { //if user confirms
            setIsVerification(true); //open up the token input box next to login
            const resendResponse = await fetch('/resendVerificationEmail', { //call the resend verification email api
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({email: credentials.email}) //send the email 
            });
            if (resendResponse.ok) {
              window.alert('Verification email sent.'); //alert the user of a successful verification
            } else {
              window.alert('Error resending verification email.'); //alert if the email couldnt be sent
            }
          }       
         } else if (response.data.isAdmin === 1) { //if the user is an admin
          setIsAdmin(true); //set the admin to true and logged in to true
          setIsLoggedIn(true);
          setUserInfo(response.data) 
          alert("Admin Login Successful"); //alert the user that an admin login was approved
        } else {
          alert("Login Successful"); //anything else means it was just a user login
          setUserInfo(response.data) //set the user info
          setIsLoggedIn(true); //set the login to true
        }
      } else { //error handling
        console.error('Login failed: Invalid response');
        onLogin(false);
        setIsLoggedIn(false);
        alert('Login failed: Invalid response');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
        
      if (error.response && error.response.status === 401) {
        alert('Incorrect email or password. Please try again.');
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

   const isValidEmail = (email) => { //function for checking if its a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  //looks for an @ a . and com
    return emailRegex.test(email);
  };

  const toggleRegistration = () => { //toggle registration used to hide and display registration form 
    setShowRegistration(!showRegistration);
  };

  return (
    <div>
      <nav>
      <NavLink to="/">
            <button>
              Home
            </button>
          </NavLink>
      </nav>
      <div>
      <h1>Login</h1>
      <label>Email:</label>
      <input type="text" name="email" value={credentials.email} onChange={handleInputChange} />

      <label>Password:</label>
      <input type="password" name="password" value={credentials.password} onChange={handleInputChange} />

      <button onClick={handleLogin}>Login</button>
      {isVerification && (
        <>
          <label>
            Verification Token:
            <input type="text" value={verificationToken} onChange={e => setVerificationToken(e.target.value)} required />
          </label>
          <button onClick={handleVerify}>Verify Email</button>
        </>
      )} 
    </div>

      {/* Register button */}
      <button onClick={toggleRegistration}>Register</button>

      {/* Registration form */}
      {showRegistration && (
         <form onSubmit={handleSubmit} className="form register">
      <h2>Register</h2>
      <p>Please click the register button once and give time to allow registation to occur</p>
      <label>
        Email:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>
      <label>
        Nickname:
        <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} required />
      </label>
      <input type="submit" value="Register" />
      {isRegistered && (
        <>
          <label>
            Verification Token:
            <input type="text" value={verificationToken} onChange={e => setVerificationToken(e.target.value)} required />
          </label>
          <button onClick={handleVerify}>Verify Email</button>
        </>
      )}
    </form>
      )}
    </div>
  );
};

export default Login;