//import the needed dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css'
const Footer = () => {
  return (
    <footer>
      <p>© 2023 Superhero Central</p>
      <Link to="/SecurityPrivacyPage">Security and Privacy</Link>
      <Link to="/AcceptableUsePolicy">Acceptable Use Policy</Link>
      <Link to="/DMCA">DMCA notice & takedown</Link>
    </footer>
  );
};

export default Footer;