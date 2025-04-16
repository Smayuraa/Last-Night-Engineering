import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";
import ContactImg from "../assets/contact.png";

const ContactForm = () => {
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    projects: {
      subCategory: "",
      requirements: "",
      budget: "",
      timeline: "",
      audience: "",
      designPreferences: [],
      technicalSpecs: "",
      competitorReferences: "",
      keyContacts: ""
    },
    notes: {
      selectedNoteType: "",
      subject: "",
      requirements: "",
      keyContacts: ""
    },
    teaching: {
      userType: "",
      learningTopic: "",
      message: "",
      contact: ""
    },
    other: {
      requirements: "",
      keyContacts: ""
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectOptions = ["E-commerce Website", "MERN Application", "Custom Software", "UI/UX Design", "Other"];
  const teachingOptions = ["MERN Development", "Full Stack Development", "Programming Language", "DSA", "Other"];
  const userTypes = ["Freelancer", "Startup", "Small Business", "Enterprise", "Student", "Other"];
  const timelineOptions = ["less than 1 month", "1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "Flexible"];
  const audienceOptions = ["General Public", "Business Professionals", "Students", "Tech Enthusiasts", "Other"];
  const designPreferencesOptions = ["Modern", "Minimalistic", "Corporate", "Creative", "User-Friendly", "Responsive Design", "Other"];
  const noteTypes = ["Web Development Notes", "Programming Notes", "Engineering Notes", "DSA", "Other"];

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value
      }
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: checked
          ? [...prev[category][name], value]
          : prev[category][name].filter(item => item !== value)
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!category) {
      newErrors.category = "Category is required";
      return newErrors;
    }

    if (category === "projects") {
      if (!formData.projects.subCategory) newErrors.subCategory = "Sub-category is required";
      if (!formData.projects.requirements) newErrors.requirements = "Requirements are required";
      if (!formData.projects.budget || formData.projects.budget < 300) newErrors.budget = "Budget must be at least 300";
      if (!formData.projects.timeline) newErrors.timeline = "Timeline is required";
      if (!formData.projects.audience) newErrors.audience = "Audience is required";
      if (formData.projects.designPreferences.length === 0) newErrors.designPreferences = "At least one design preference is required";
      if (!formData.projects.technicalSpecs) newErrors.technicalSpecs = "Technical specs are required";
      if (!formData.projects.competitorReferences) newErrors.competitorReferences = "Competitor references are required";
      if (!/^\d{10}$/.test(formData.projects.keyContacts)) newErrors.keyContacts = "Valid 10-digit phone number is required";
    }

    if (category === "notes") {
      if (!formData.notes.selectedNoteType) newErrors.selectedNoteType = "Note type is required";
      if (formData.notes.selectedNoteType === "Other" && !formData.notes.subject) newErrors.subject = "Subject is required for 'Other' type";
      if (!formData.notes.requirements) newErrors.requirements = "Requirements are required";
      if (!/^\d{10}$/.test(formData.notes.keyContacts)) newErrors.keyContacts = "Valid 10-digit phone number is required";
    }

    if (category === "teaching") {
      if (!formData.teaching.userType) newErrors.userType = "User type is required";
      if (!formData.teaching.learningTopic) newErrors.learningTopic = "Learning topic is required";
      if (!formData.teaching.message) newErrors.message = "Message is required";
      if (!/^\d{10}$/.test(formData.teaching.contact)) newErrors.contact = "Valid 10-digit phone number is required";
    }

    if (category === "other") {
      if (!formData.other.requirements) newErrors.requirements = "Requirements are required";
      if (!/^\d{10}$/.test(formData.other.keyContacts)) newErrors.keyContacts = "Valid 10-digit phone number is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/LNE/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category,
          [category]: formData[category]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      alert("Form submitted successfully!");
      setCategory("");
      setFormData({
        projects: {
          subCategory: "",
          requirements: "",
          budget: "",
          timeline: "",
          audience: "",
          designPreferences: [],
          technicalSpecs: "",
          competitorReferences: "",
          keyContacts: ""
        },
        notes: {
          selectedNoteType: "",
          subject: "",
          requirements: "",
          keyContacts: ""
        },
        teaching: {
          userType: "",
          learningTopic: "",
          message: "",
          contact: ""
        },
        other: {
          requirements: "",
          keyContacts: ""
        }
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message || "An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
            <img src={ContactImg} alt="Contact Illustration" style={{ maxWidth: "75%" }} />
          </div>

          <div className="col-md-6">
            <h3 className="fw-bold text-center mb-2">📩 Get in Touch</h3>
            <p className="text-muted text-center mb-4">We'd love to hear from you!</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select a Category</label>
                <select
                  className={`form-control ${errors.category ? "is-invalid" : ""}`}
                  style={{ borderColor: "#ff8c00" }}
                  value={category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">-- Select an Option --</option>
                  <option value="projects">Projects</option>
                  <option value="teaching">Teaching</option>
                  <option value="notes">Notes</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              {category === "projects" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Project Type</label>
                    <select
                      className={`form-control ${errors.subCategory ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="subCategory"
                      value={formData.projects.subCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Project Type --</option>
                      {projectOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.subCategory && <div className="invalid-feedback">{errors.subCategory}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Requirements</label>
                    <textarea
                      className={`form-control ${errors.requirements ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="requirements"
                      rows="3"
                      value={formData.projects.requirements}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.requirements && <div className="invalid-feedback">{errors.requirements}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Budget (Minimum ₹300)</label>
                    <input
                      type="number"
                      className={`form-control ${errors.budget ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="budget"
                      min="300"
                      value={formData.projects.budget}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Timeline</label>
                    <select
                      className={`form-control ${errors.timeline ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="timeline"
                      value={formData.projects.timeline}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Timeline --</option>
                      {timelineOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.timeline && <div className="invalid-feedback">{errors.timeline}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Target Audience</label>
                    <select
                      className={`form-control ${errors.audience ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="audience"
                      value={formData.projects.audience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Audience --</option>
                      {audienceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.audience && <div className="invalid-feedback">{errors.audience}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Design Preferences</label>
                    <div className="d-flex flex-wrap gap-3">
                      {designPreferencesOptions.map(option => (
                        <div key={option} className="form-check">
                          <input
                            className="form-check-input custom-checkbox"
                            type="checkbox"
                            name="designPreferences"
                            value={option}
                            checked={formData.projects.designPreferences.includes(option)}
                            onChange={handleCheckboxChange}
                            id={`design-${option}`}
                            required={formData.projects.designPreferences.length === 0}
                          />
                          <label className="form-check-label" htmlFor={`design-${option}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.designPreferences && <div className="text-danger small">{errors.designPreferences}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Technical Specifications</label>
                    <input
                      type="text"
                      className={`form-control ${errors.technicalSpecs ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="technicalSpecs"
                      value={formData.projects.technicalSpecs}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.technicalSpecs && <div className="invalid-feedback">{errors.technicalSpecs}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Competitor References</label>
                    <input
                      type="text"
                      className={`form-control ${errors.competitorReferences ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="competitorReferences"
                      value={formData.projects.competitorReferences}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.competitorReferences && <div className="invalid-feedback">{errors.competitorReferences}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.keyContacts ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="keyContacts"
                      value={formData.projects.keyContacts}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      required
                    />
                    {errors.keyContacts && <div className="invalid-feedback">{errors.keyContacts}</div>}
                  </div>
                </>
              )}

              {category === "notes" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Note Type</label>
                    <select
                      className={`form-control ${errors.selectedNoteType ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="selectedNoteType"
                      value={formData.notes.selectedNoteType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Note Type --</option>
                      {noteTypes.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.selectedNoteType && <div className="invalid-feedback">{errors.selectedNoteType}</div>}
                  </div>

                  {formData.notes.selectedNoteType === "Other" && (
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                        style={{ borderColor: "#ff8c00" }}
                        name="subject"
                        value={formData.notes.subject}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Requirements</label>
                    <textarea
                      className={`form-control ${errors.requirements ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="requirements"
                      rows="3"
                      value={formData.notes.requirements}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.requirements && <div className="invalid-feedback">{errors.requirements}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.keyContacts ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="keyContacts"
                      value={formData.notes.keyContacts}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      required
                    />
                    {errors.keyContacts && <div className="invalid-feedback">{errors.keyContacts}</div>}
                  </div>
                </>
              )}

              {category === "teaching" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Who are you?</label>
                    <select
                      className={`form-control ${errors.userType ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="userType"
                      value={formData.teaching.userType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select User Type --</option>
                      {userTypes.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.userType && <div className="invalid-feedback">{errors.userType}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">What do you want to learn?</label>
                    <select
                      className={`form-control ${errors.learningTopic ? "is-invalid" : ""}`}
                      name="learningTopic"
                      value={formData.teaching.learningTopic}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Learning Topic --</option>
                      {teachingOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.learningTopic && <div className="invalid-feedback">{errors.learningTopic}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="message"
                      rows="3"
                      value={formData.teaching.message}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.contact ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="contact"
                      value={formData.teaching.contact}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      required
                    />
                    {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                  </div>
                </>
              )}

              {category === "other" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Requirements</label>
                    <textarea
                      className={`form-control ${errors.requirements ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="requirements"
                      rows="3"
                      value={formData.other.requirements}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.requirements && <div className="invalid-feedback">{errors.requirements}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.keyContacts ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ff8c00" }}
                      name="keyContacts"
                      value={formData.other.keyContacts}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      required
                    />
                    {errors.keyContacts && <div className="invalid-feedback">{errors.keyContacts}</div>}
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="btn btn-orange w-100 mt-3 create-form-save-btn"
                disabled={isSubmitting}
                style={{ backgroundColor: "#ff8c00", color: "white" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;