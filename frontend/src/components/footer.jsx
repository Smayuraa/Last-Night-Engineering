import { FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhoneAlt, FaFacebook } from "react-icons/fa";
import "../styles/footer.css";
import Logo from "../assets/Logo.png"; 

const Footer = () => {
  // Get contact info from environment variables
  const phoneNumber = import.meta.env.VITE_PhoneNumber || "+91 9307103123";
  const email = import.meta.env.VITE_Email || "work4rudrakudale@gmail.com";

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section social">
          <img src={Logo} alt="Company Logo" className="footer-logo" />
          <p className="footer-connect-text">Let's connect with our socials</p>
          <div className="footer-icons">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
          </div>
        </div>

        <div className="footer-section company-links">
          <h2 className="footer-heading">COMPANY</h2>
          <ul className="footer-links-list">
            <li><a href="/aboutus">About Us</a></li>
            <li><a href="/">Home</a></li>
            <li><a href="/contactus">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h2 className="footer-heading">Get In Touch</h2>
          <p className="contact-item">
            <FaPhoneAlt className="contact-icon" /> {phoneNumber}
          </p>
          <p className="contact-item">
            <FaEnvelope className="contact-icon" /> {email}
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Last Night Engineering. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;