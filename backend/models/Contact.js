import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["projects", "notes", "teaching", "other"],
  },

  projects: {
    subCategory: {
      type: String,
      required: function () {
        return this.category === "projects";
      },
      enum: ["E-commerce Website", "MERN Application", "Custom Software", "UI/UX Design", "Other"],
    },
    requirements: {
      type: String,
      required: function () {
        return this.category === "projects";
      },
    },
    budget: {
      type: Number,
      required: function () {
        return this.category === "projects";
      },
      min: 300,
    },
    timeline: {
      type: String,
      required: function () {
        return this.category === "projects";
      },
      enum: ["less than 1 month", "1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "Flexible"],
    },
    audience: {
      type: String,
      required: function () {
        return this.category === "projects";
      },
      enum: ["General Public", "Business Professionals", "Students", "Tech Enthusiasts", "Other"],
    },
    designPreferences: {
      type: [String],
      required: function () {
        return this.category === "projects";
      },
      enum: ["Modern", "Minimalistic", "Corporate", "Creative", "User-Friendly", "Responsive Design", "Other"],
    },
    technicalSpecs: {
      type: String,
      required: function () {
        return this.category === "projects";
      },
    },
    competitorReferences: {
      type: String,
      required: function () {
        return this.category === "projects";
      },
    },
    keyContacts: {
      type: Number,
      required: function () {
        return this.category === "projects";
      },
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
      },
    },
  },

  notes: {
    selectedNoteType: {
      type: String,
      required: function () {
        return this.category === "notes";
      },
      enum: ["Web Development Notes", "Programming Notes", "Engineering Notes", "DSA", "Other"],
    },
    subject: {
      type: String,
      required: function () {
        return this.category === "notes" && this.notes.selectedNoteType === "Other";
      },
    },
    requirements: {
      type: String,
      required: function () {
        return this.category === "notes";
      },
    },
    keyContacts: {
      type: Number,
      required: function () {
        return this.category === "notes";
      },
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
      },
    },
  },

  teaching: {
    userType: {
      type: String,
      required: function () {
        return this.category === "teaching";
      },
      enum: ["Freelancer", "Startup", "Small Business", "Enterprise", "Student", "Other"],
    },
    learningTopic: {
      type: String,
      required: function () {
        return this.category === "teaching";
      },
      enum: ["MERN Development", "Full Stack Development", "Programming Language", "DSA", "Other"],
    },
    message: {
      type: String,
      required: function () {
        return this.category === "teaching";
      },
    },
    contact: {
      type: Number,
      required: function () {
        return this.category === "teaching";
      },
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
      },
    },
  },

  other: {
    requirements: {
      type: String,
      required: function () {
        return this.category === "other";
      },
    },
    keyContacts: {
      type: Number,
      required: function () {
        return this.category === "other";
      },
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
      },
    },
  },
});

const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;