import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
            <p>Gloss Mart is your one-stop destination for quality products and unbeatable prices. Whether you're shopping for everyday essentials or unique finds, we bring the best to your doorstep with convenience and trust.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91 8072363074</li>
                <li>glossmart@gmail.com</li>
            </ul>
        </div> 
      </div>
      <hr />
      <p className="footer-copyright">&copy; 2024 Gloss Mart. All rights reserved. | Terms of Service | Privacy Policy</p>
    </div>
  );
};

export default Footer;
