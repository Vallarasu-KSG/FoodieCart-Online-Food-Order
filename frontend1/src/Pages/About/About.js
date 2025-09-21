import React from 'react';
import './About.css'; // Import a CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Us</h1>
        <p>Welcome to Foodie's Paradise, where cravings meet satisfaction!</p>
      </header>
      <section className="about-content">
        <h2>Our Story</h2>
        <p>
          At Foodie's Paradise, we believe food is not just a necessity but an emotion. 
          Our journey began with a passion for bringing people closer to the flavors they love.
          From local delicacies to international cuisines, we've got it all.
        </p>
        <h2>What We Do</h2>
        <p>
          We connect you with the best restaurants and chefs in your area, offering a seamless 
          online ordering experience. Whether you're craving a spicy biryani, a cheesy pizza, 
          or a healthy salad, we've got you covered.
        </p>
        <h2>Why Choose Us</h2>
        <ul>
          <li>Wide variety of cuisines to explore.</li>
          <li>Fast and reliable delivery services.</li>
          <li>Easy-to-use platform for ordering food.</li>
          <li>Secure payment options and exciting offers.</li>
        </ul>
      </section>
      <footer className="about-footer">
        <p>We are dedicated to delivering happiness on a plate. Thank you for choosing Foodie's Paradise!</p>
      </footer>
    </div>
  );
};

export default About;
