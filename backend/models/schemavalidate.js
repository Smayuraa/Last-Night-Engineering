import Joi from "joi";

// Contact Schema Validation
export const contactValidationSchema = Joi.object({
  category: Joi.string()
    .valid("projects", "notes", "teaching", "other")
    .required()
    .messages({
      "any.required": "Category is required.",
      "any.only": "Category must be one of: projects, notes, teaching, other.",
    }),

  projects: Joi.object({
    subCategory: Joi.string()
      .valid("E-commerce Website", "MERN Application", "Custom Software", "UI/UX Design", "Other")
      .required()
      .messages({
        "any.required": "Sub-category is required for projects.",
        "any.only": "Invalid sub-category selected.",
      }),
    requirements: Joi.string().required().messages({
      "any.required": "Project requirements are required.",
    }),
    budget: Joi.number().min(300).required().messages({
      "any.required": "Budget is required.",
      "number.min": "Budget must be at least 300.",
    }),
    timeline: Joi.string()
      .valid("less than 1 month", "1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "Flexible")
      .required()
      .messages({
        "any.required": "Timeline is required.",
        "any.only": "Invalid timeline selected.",
      }),
    audience: Joi.string()
      .valid("General Public", "Business Professionals", "Students", "Tech Enthusiasts", "Other")
      .required()
      .messages({
        "any.required": "Audience is required.",
        "any.only": "Invalid audience selected.",
      }),
    designPreferences: Joi.array()
      .items(Joi.string().valid("Modern", "Minimalistic", "Corporate", "Creative", "User-Friendly", "Responsive Design", "Other"))
      .required()
      .messages({
        "any.required": "Design preferences are required.",
      }),
    technicalSpecs: Joi.string().required().messages({
      "any.required": "Technical specifications are required.",
    }),
    competitorReferences: Joi.string().required().messages({
      "any.required": "Competitor references are required.",
    }),
    keyContacts: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Contact details are required.",
        "string.pattern.base": "Contact details must be a 10-digit number.",
      }),
  }).when("category", { is: "projects", then: Joi.required() }),

  notes: Joi.object({
    selectedNoteType: Joi.string()
      .valid("Web Development Notes", "Programming Notes", "Engineering Notes", "DSA", "Other")
      .required()
      .messages({
        "any.required": "Note type is required.",
        "any.only": "Invalid note type selected.",
      }),
    subject: Joi.string()
      .allow('') // Allow empty string
      .when('selectedNoteType', {
        is: 'Other',
        then: Joi.string().required().messages({
          'any.required': "Subject is required when 'Other' is selected.",
          'string.empty': "Subject cannot be empty when 'Other' is selected."
        }),
        otherwise: Joi.string().allow('').optional() // Explicitly allow empty when not "Other"
      }),
    requirements: Joi.string().required().messages({
      "any.required": "Requirements are required.",
    }),
    keyContacts: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Contact details are required.",
        "string.pattern.base": "Contact details must be a 10-digit number.",
      }),
  }).when("category", { is: "notes", then: Joi.required() }),

  teaching: Joi.object({
    userType: Joi.string()
      .valid("Freelancer", "Startup", "Small Business", "Enterprise", "Student", "Other")
      .required()
      .messages({
        "any.required": "User type is required.",
      }),
    learningTopic: Joi.string()
      .valid("MERN Development", "Full Stack Development", "Programming Language", "DSA", "Other")
      .required()
      .messages({
        "any.required": "Learning topic is required.",
      }),
    message: Joi.string().required().messages({
      "any.required": "Message is required.",
    }),
    contact: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Contact details are required.",
        "string.pattern.base": "Contact details must be a 10-digit number.",
      }),
  }).when("category", { is: "teaching", then: Joi.required() }),

  other: Joi.object({
    requirements: Joi.string().required().messages({
      "any.required": "Requirements are required.",
    }),
    keyContacts: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Contact details are required.",
      }),
  }).when("category", { is: "other", then: Joi.required() }),
});

// Note Schema Validation
export const noteValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
  }),
  imgSrc: Joi.string().uri().required().messages({
    "any.required": "Image source URL is required.",
  }),
  downloadNotesSrc: Joi.string().uri().required().messages({
    "any.required": "Download notes source URL is required.",
  }),
  _id: Joi.string().optional(),
  __v: Joi.optional()
});

// Project Schema Validation
export const projectValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
  }),
  technologies: Joi.string().required().messages({
    "any.required": "Technologies are required.",
  }),
  liveDemoSrc: Joi.string().uri().required().messages({
    "any.required": "Live demo source URL is required.",
  }),
  snapshotSrc: Joi.string().uri().required().messages({
    "any.required": "Snapshot source URL is required.",
  }),
  imgSrc: Joi.string().uri().required().messages({
    "any.required": "Image source URL is required.",
  }),
  _id: Joi.string().optional(),
  __v: Joi.optional()
});

// Teaching Schema Validation
export const teachingValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
  }),
  youtube: Joi.string()
    .pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)
    .required()
    .messages({
      "any.required": "YouTube link is required.",
      "string.pattern.base": "YouTube link must be a valid URL.",
    }),
  _id: Joi.string().optional(),
  __v: Joi.optional()
});

export const userValidationSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "any.required": "Full name is required.",
  }),
  email: Joi.string().email().when("googleId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Email is required.",
      "string.email": "Email must be a valid email address.",
    }),
  }),
  password: Joi.string().when("googleId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Password is required.",
    }),
  }),
  googleId: Joi.string().optional(),
  reasonToJoin: Joi.string()
    .valid("I need a project", "I want to explore notes", "I want to start learning", "Other", "Google User")
    .required()
    .messages({
      "any.required": "Reason to join is required.",
    }),
   otp: Joi.string().optional()
});
