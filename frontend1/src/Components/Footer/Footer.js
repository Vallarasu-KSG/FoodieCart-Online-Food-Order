import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import linkedin from '../../assets/Logo/linkedin_logo.png'
import github from '../../assets/Logo/github_icon.png'
import portfolia from '../../assets/Logo/portfolia.png'



const Footer = () => {

  const handleFooterClick = () => {
    // Scroll to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Optional: If content is dynamically hidden/collapsed, show it here
    const hiddenSections = document.querySelectorAll(".hidden-section");
    hiddenSections.forEach((section) => {
      section.style.display = "block"; // Or adjust the class to show it
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About Section */}
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>We deliver delicious meals right to your doorstep, focusing on quality and convenience.</p>
        </div>
        {/* Quick Links Section */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/Home" onClick={handleFooterClick}>Home</Link></li>
            <li><Link to="/About" onClick={handleFooterClick}>About</Link></li>
            <li><Link to="/Contact" onClick={handleFooterClick}>Contact</Link></li>
            <li><Link to="/PrivacyPolicy" onClick={handleFooterClick}>PrivacyPolicy</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: kvallarasu2003@gmail.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: Usilampatti, Madurai - 625527, TamilNadu, India </p>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <a href="https://www.linkedin.com/in/vallarasu-kasimayan-083b51292/" target="_blank" rel="noopener noreferrer">
            <img src={linkedin} alt="linkedin" title="linkedin" />
          </a>
          <a href="https://github.com/Vallarasu-KSG" target="_blank" rel="noopener noreferrer">
            <img src={github} alt="github" title="github"  w="true" />
          </a>
          <a href="https://portfolio-for-vallarasu.netlify.app/" target="_blank" rel="noopener noreferrer">
            <img src={portfolia} alt="portfolio" title="portfolio" />
          </a>
         {/* <h3> <Link to="https://portfolio-for-vallarasu.netlify.app/" target="_blank" rel="noopener noreferrer">Check My Portfolio </Link> </h3> */}

        </div>
          
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Food Order Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
