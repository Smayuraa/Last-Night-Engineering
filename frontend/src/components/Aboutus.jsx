import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Aboutus.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import aboutImg from "../assets/aboutusImg.png";
import aboutImg1 from "../assets/aboutusImg1.png";
import Footer from './footer'
import { FaLaptopCode, FaCode, FaShoppingCart, FaClock, FaUsers, FaHeadset } from "react-icons/fa";
import FloatingIcons from "./FloatingIcons";

const AboutUs = () => {
  const navigate=useNavigate()
  return (
    <div className="about-container">
      <div style={{height: '100vh', width: '100%'}} className="d-flex align-items-center">
        <Container className="business-banner py-5" style={{width: '100%'}}>
          <Row className="align-items-center">
            <Col md={6} className="text-section">
              <h1 className="title">About <span className="text-warning">LNE</span></h1>
              <br />
              <p className="description">
  Welcome to our agency – a hub of innovation, creativity, and excellence. We are a passionate team of developers,
  designers, and digital experts committed to delivering top-notch solutions that empower businesses to grow in the digital age.
</p>
<p className="description">
  At the heart of our work lies a deep belief in transparency, collaboration, and continuous learning.
  We don’t just build projects – we build long-term partnerships based on trust and results.
</p>
<p className="description">
 <b> Let’s grow together. 🚀</b>
</p>

              <Button 
                variant="warning" 
                className="mt-3 project-btn"
                onClick={() => navigate("/contactus")}
              >
                Get In Touch
              </Button>
            </Col>
            <Col md={6} className="image-section d-flex justify-content-end">
              <div className="image-wrapper">
                <img src={aboutImg} alt="Business" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Second Page - Services with aligned icons */}
      <Container className="text-center my-5 py-5">
        <h2 className="fw-bold">Save time managing your business with our services</h2>
        <p className="text-muted">
        We make tech simple — so you save time, boost your presence, and focus on what matters most: growing your business.

        </p>
        
        <Row className="mt-4 g-4">
          <Col md={4}>
            <Card className="service-card web-design h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <FaLaptopCode size={30} className="icon me-3" />
                  <Card.Title className="mb-0">Web Design</Card.Title>
                </div>
                <Card.Text>
                We design beautiful and easy-to-use websites. Whether it's a personal blog,
                 business site, or online shop – we make sure your website looks great on all
                  devices and is simple for visitors to use. Our goal is to help your brand stand
                   out and attract more people.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="service-card development h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <FaCode size={30} className="icon me-3" />
                  <Card.Title className="mb-0">Development</Card.Title>
                </div>
                <Card.Text>
                We build websites that are fast, secure, and easy to manage.
                 From simple static sites to full-featured dynamic websites,
                  we use modern technologies to bring your ideas to life. No apps
                   – just websites that work smoothly and help your business grow online.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="service-card ecommerce h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <FaShoppingCart size={30} className="icon me-3" />
                  <Card.Title className="mb-0">Teaching & Notes</Card.Title>
                </div>
                <Card.Text>
                We teach full MERN stack – MongoDB, Express.js, React, and Node.js – 
                with simple and easy-to-follow notes. Whether you're a beginner or want
                 to level up, our notes cover everything from basics to advanced concepts. 
                 Perfect for self-study or classroom learning.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Third Page - Why Us with image border and aligned icons */}
      <Container className="about-us-section my-5 py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img 
              src={aboutImg1} 
              alt="About Us" 
              className="img-fluid about-img" 
              style={{border: "5px solid #f5b820"}} 
            />
          </Col>
          <Col md={6}>
            <h2 className="fw-bold mb-4">
              <strong>Why Choose Us?</strong>
            </h2>
            <p className="mb-4">
            We don’t just build websites – we build your brand’s digital identity.
             What makes us different is our strong dedication, technical skills, and
              genuine focus on client satisfaction.
            </p>
            <div className="about-details mb-4">
              <div className="d-flex align-items-center">
                <FaClock size={24} className="icon me-3" />
                <h3 className="mb-0">Timely Delivery</h3>
              </div>
              <p className="mt-2 ms-5">
                We understand that time is money. Our project management methodology ensures we deliver quality work 
                on schedule, every time. Over 95% of our projects are completed by the agreed deadline without 
                compromising on quality.
              </p>
            </div>
            <div className="about-details mb-4">
              <div className="d-flex align-items-center">
                <FaUsers size={24} className="icon me-3" />
                <h3 className="mb-0">Client-Centric Approach</h3>
              </div>
              <p className="mt-2 ms-5">
                Your success is our success. We take time to understand your business objectives, target audience, 
                and competitive landscape. This deep understanding allows us to create solutions that truly move 
                the needle for your organization.
              </p>
            </div>
            <div className="about-details">
              <div className="d-flex align-items-center">
                <FaHeadset size={24} className="icon me-3" />
                <h3 className="mb-0">24/7 Support</h3>
              </div>
              <p className="mt-2 ms-5">
              Technical issues can happen anytime – and we’re always here for you.
               Whether it’s a small issue or an urgent one, our team is ready to support 
               you anytime, day or night.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Fourth Page - Projects without image */}
      <Container className="projects-section py-5 my-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2 className="section-title mb-4">Explore Our Projects</h2>
            <p className="section-text mb-4">
           Discover the work that <strong>defines us</strong>.  
           Each project we build is more than just code it’s a carefully crafted <strong>solution</strong> backed by <strong>creativity</strong>, <strong>strategy</strong>, and <strong>purpose</strong>.  
           As <strong>MERN stack specialists</strong>, we develop full-stack web applications that are <strong>fast</strong>, <strong>scalable</strong>, and tailored to <strong>real-world needs</strong>.

          From sleek <strong>portfolios</strong> and <strong>business tools</strong> to dynamic <strong>learning platforms</strong>, our work reflects <strong>clean design</strong>, <strong>robust functionality</strong>, and a <strong>user-first approach</strong>.

          We don’t just develop websites <em><strong>we bring ideas to life</strong></em>.  
          Take a closer look at our projects and see the <strong>impact</strong> we create.
          </p>

            <Button
              className="project-btn"
              onClick={() => navigate("/projects")}
            >
              View All Projects
            </Button>
          </Col>
        </Row>
      </Container>

      <FloatingIcons/>
      <Footer/>
    </div>
  );
};

export default AboutUs;