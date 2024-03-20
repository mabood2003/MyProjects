//import all the dependencies and needed components
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import LoggedUser from './LoggedUser';
import Admin from './Admin';
import SecurityPrivacyPage from './SecurityPrivacyPage';
import AcceptableUsePolicy from './AcceptableUsePolicy';
import DMCA from './DMCA'
import DMCA_tools from './DMCA_tools';
const App = () => {
  //initiate all the use states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
<Router>
  <Switch>
    <Route //define the route to login
      path="/login" //the path is /login
      render={(props) => (
        isLoggedIn && !isAdmin ? ( //if the user is logged in and is not an admin redirect to loggedUser page
          <Redirect to="/loggedUser" />
        ) : isAdmin ? ( //if the user is an admin, redirect to admin home page
          <Redirect to="/Admin" />
        ) : (
          <Login {...props} onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} setIsAdmin={setIsAdmin} /> //otherwise no one is logged in so redirect to the login page
        )
      )}
    />
    <Route //define the route to loggedUser
      path="/loggedUser" //path name is /loggedUser
      render={(props) => ( //render all the props
        isLoggedIn ? ( //check if the user is logged in
          <LoggedUser {...props} onLogout={handleLogout} userInfo={userInfo} /> //pass the user info and handling logout function to loggedUser
        ) : (
          <Redirect to="/login" /> //if the user is not logged in redirect them to login page
        )
      )}
    />
    <Route //route to admin page
      path="/Admin" //path is /admin
      render={(props) => ( //render all the props
        isAdmin ? ( //check that the user is an admin
          <Admin {...props} onLogout={handleLogout} userInfo={userInfo} /> //pass the user info and logout handling to Admin page
        ) : (
          <Redirect to="/loggedUser" /> //otherwise redirect them to logged user since not an admin
        )
      )}
    />
    
    <Route path="/securityPrivacyPage" component={SecurityPrivacyPage} /> {'define all the routes to the policy pages'}
    <Route path="/AcceptableUsePolicy" component={AcceptableUsePolicy} />
    <Route path="/DMCA" component={DMCA} />  
    <Route path="/DMCA_tools" component={DMCA_tools} />       
     
    <Route path="/" render={(props) => ( //path to the home page
      <Home {...props} isLoggedIn={isLoggedIn} onLogout={handleLogout} userInfo={userInfo} /> //render userinfo logged in and out fucntions
    )} />
  </Switch>
</Router>
  );
    }

export default App;