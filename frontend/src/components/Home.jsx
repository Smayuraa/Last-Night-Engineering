import React, { useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Footer from "./footer";
import { 
  FaSearch, FaBullhorn, FaUsers, FaEllipsisH,  FaBuilding, FaEnvelope,
  FaClock, FaUser, FaLightbulb, FaTrophy 
} from "react-icons/fa";
import heroImg from "../assets/homeImg.gif";
import missionImg from "../assets/mission.png";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const services = [
  { icon: <FaSearch />, title: "Website Development", desc: "We create beautiful, fast, and mobile-friendly websites for students, creators, and businesses. Just share your idea, and we’ll build it into a live, working website that gets noticed.", color: "bg-warning" },
  { icon: <FaBullhorn />, title: "Teaching & Training", desc: "Want to learn real coding? We offer a friendly learning environment to help you grow confidently in tech from basics to advanced.", color: "bg-success" },
  { icon: <FaUsers />, title: "Notes & Study Materials", desc: "Struggling with study material? We’ve got your back with clean, to-the-point notes made specially for engineering students. Learn smart, not hard.", color: "bg-primary" },
  { icon: <FaEllipsisH />, title: "Tech Support", desc: "Website down? Need quick fixes? We’re here for all your technical issues — from bugs to backups — so you can focus on your goals, not glitches.", color: "bg-danger" }
];

const missionPoints = [
  { icon: <FaUsers />, title: "Expert Team", text: "Creative minds building smart digital solutions." },
  { icon: <FaBuilding />, title: "Scaling Startups", text: "Tech-driven growth for modern startups." },
  { icon: <FaEnvelope />, title: "24/7 Support", text: "Dedicated, round-the-clock customer service." }
];

const features = [
  { icon: <FaClock size={24} />, title: "Time Efficient", desc: "We value your time — delivering every project with speed, precision, and punctuality." },
  { icon: <FaUser size={24} />, title: "User Friendly", desc: "Designed with users in mind — intuitive, smooth, and easy-to-navigate experiences." },
  { icon: <FaLightbulb size={24} />, title: "Creative Designs", desc: "We blend creativity with functionality to craft visually stunning and impactful designs." },
  { icon: <FaTrophy size={24} />, title: "Achievements", desc: "Recognized for our dedication, innovation, and consistently delivering excellence." },
];

const Home = () => {
  const navigate = useNavigate();
  const servicesRef = useRef(null);
  const handleGetStartedClick = useCallback(() => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section container d-flex flex-column flex-md-row align-items-center justify-content-between py-5">
        <motion.div 
          className="col-md-6 pe-md-5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-4 fw-bold text-dark mb-4 ">
          You Dream It. <span className="text-gradient">We Make It.</span>

          </h1>
          <p className="hero-text text-muted mb-4">
          <p>
           At <b>LNE (Last Night Engineering)</b>, we turn your ideas into powerful digital solutions — whether it’s a custom website, a student project, smart notes, or real-world coding sessions.
         </p>
        <p>
  We help you build, learn, and grow — with clean design, quality code, and human support that actually makes sense.
       </p>
        <p>
          <b>     Let’s create something meaningful, together.
          </b>
        </p>
        <p>
        We’re not just another agency — we’re your creative partner. Whether you're a student looking to upskill or a business aiming to stand out online, we bring passion, precision, and late-night dedication to every project.
      </p>

          </p>
          <div className="mt-4 d-flex gap-3 hero-btns">
            <motion.button 
              className="custom-btn primary-btn" 
              onClick={handleGetStartedClick} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button 
              className="custom-btn secondary-btn" 
              onClick={() => navigate('/aboutus')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-6 d-flex justify-content-center mt-4 mt-md-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={heroImg} alt="Creative brainstorming illustration" className="hero-image img-fluid rounded-3 shadow" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="services-section text-center py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="fw-bold section-title mb-3">
              We Provide The Best <span className="text-gradient">Services</span>
            </h2>
            <p className="section-subtitle text-muted mb-5">
            We believe great ideas deserve great execution.
            So we help you bring those ideas to life — with proper design, solid code, and a team that actually listens.            </p>
          </motion.div>
          
          <Row className="g-4">
            {services.map((service, index) => (
              <Col key={index} lg={3} md={6}>
                <motion.div 
                  className="service-card p-4 h-100"
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`icon-box ${service.color} text-white p-3 rounded-circle mb-4 mx-auto`}>
                    {service.icon}
                  </div>
                  <h5 className="fw-semibold mb-3">{service.title}</h5>
                  <p className="text-muted mb-0">{service.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>

          <motion.button 
            className="custom-btn primary-btn mt-5" 
            onClick={() => navigate('/projects')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore More
          </motion.button>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="mission-section py-5">
        <Container>
          <Row className="align-items-center text-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="mission-title mb-4 text-center">
                  Our <span className="highlight">Mission</span>
                </h2>
                <p className="mission-text mb-4">
                  <p>
                At <b>LNE (Last Night Engineering)</b>, our mission is to spark curiosity, fuel innovation, and empower every learner and entrepreneur to turn ideas into impact.
                We are passionate about blending education and technology to create meaningful digital solutions that inspire growth, learning, and transformation.
               </p>
            <p>
               Whether it's building modern websites, offering expert training, or sharing valuable study resources — we aim to be a trusted force driving digital excellence and accessible education for all.
            </p>
            </p>
                <p className="mission-text mb-5">
                  With a focus on quality, creativity, and customer satisfaction, we aim to be a trusted partner for businesses striving in the digital era.
                </p>
                <img 
                  src={missionImg} 
                  alt="Mission statement illustration" 
                  className="img-fluid rounded-3 shadow" 
                  style={{ maxWidth: "80%" }} 
                />
              </motion.div>
            </Col>

            <Col lg={6}>
              {missionPoints.map((info, index) => (
                <motion.div 
                  key={index} 
                  className="mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="info-card h-100 border-0">
                    <Card.Body className="p-4">
                      <span className="icon mb-5">{info.icon}</span>
                      <Card.Title className="mb-3 fw-bold">{info.title}</Card.Title>
                      <Card.Text className="text-muted">{info.text}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold section-title mb-3">
              Why Choose <span className="text-gradient">Us</span>
            </h2>
            <p className="section-subtitle text-muted">
            We blend innovation, quality, and passion to deliver impactful digital solutions that help you grow with confidence.            </p>
          </motion.div>
          
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3}>
                <motion.div
                  className="feature-card p-4 h-100 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon mb-3 text-warning">
                    {feature.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-dark text-white">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="fw-bold mb-4">Ready to Transform Your Digital Presence?</h2>
            <p className="mb-5 mx-auto" style={{ maxWidth: "600px" }}>
              Let's discuss how we can help your business grow with our tailored digital solutions.
            </p>
            <Link to="/contactus" className="custom-btn primary-btn">
              Get In Touch
            </Link>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Home;