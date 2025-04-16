import express from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";
import dotenv from "dotenv";
import axios from "axios";
import { isLoggedIn, validateContact } from "../middlewares.js";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/contacts", isLoggedIn, validateContact, async (req, res) => {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const userResponse = await axios.get(`${backendUrl}/api/auth/user`, {
      headers: { Cookie: req.headers.cookie },
      withCredentials: true,
    });
    if (userResponse.status !== 200) {
      return res.status(401).json({ message: "Unauthorized: Failed to fetch user" });
    }
    const { user } = userResponse.data;
    const { category, ...restData } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const categoryData = restData[category] || restData;
    if (category === "notes" && categoryData.selectedNoteType !== "Other") {
      if (req.body.notes) {
        req.body.notes.subject = undefined;
      }
    }
    if (categoryData.keyContacts) {
      categoryData.keyContacts = Number(categoryData.keyContacts);
    }
    if (categoryData.contact) {
      categoryData.contact = Number(categoryData.contact);
    }
    if (categoryData.budget) {
      categoryData.budget = Number(categoryData.budget);
    }

    const contactData = {
      category,
      userId: user._id,
      [category]: categoryData
    };

    const newContact = new Contact(contactData);
    await newContact.save();

    let emailContent = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #ff8c00; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ff8c00; padding-bottom: 10px;">📩 New Contact Form Submission</h2>
      <p style="font-size: 16px; color: #555;"><strong>From:</strong> ${user.fullName} (${user.email})</p>
      <p style="font-size: 16px; color: #555;"><strong>Category:</strong> ${category}</p>`;

    if (category === "projects") {
      emailContent += `
      <h3 style="color: #333; border-bottom: 1px solid #ff8c00; padding-bottom: 10px;">Project Details</h3>
      <p style="font-size: 14px; color: #555;"><strong>Sub-Category:</strong> ${categoryData.subCategory || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Requirements:</strong> ${categoryData.requirements || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Budget:</strong> ${categoryData.budget || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Timeline:</strong> ${categoryData.timeline || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Audience:</strong> ${categoryData.audience || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Design Preferences:</strong> ${categoryData.designPreferences?.join(", ") || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Technical Specs:</strong> ${categoryData.technicalSpecs || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Competitor References:</strong> ${categoryData.competitorReferences || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Contact Number:</strong> ${categoryData.keyContacts || "N/A"}</p>`;
    } else if (category === "notes") {
      emailContent += `
      <h3 style="color: #333; border-bottom: 1px solid #ff8c00; padding-bottom: 10px;">Notes Details</h3>
      <p style="font-size: 14px; color: #555;"><strong>Note Type:</strong> ${categoryData.selectedNoteType || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Subject:</strong> ${categoryData.subject || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Requirements:</strong> ${categoryData.requirements || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Contact Number:</strong> ${categoryData.keyContacts || "N/A"}</p>`;
    } else if (category === "teaching") {
      emailContent += `
      <h3 style="color: #333; border-bottom: 1px solid #ff8c00; padding-bottom: 10px;">Teaching Details</h3>
      <p style="font-size: 14px; color: #555;"><strong>User Type:</strong> ${categoryData.userType || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Learning Topic:</strong> ${categoryData.learningTopic || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Message:</strong> ${categoryData.message || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Contact Number:</strong> ${categoryData.contact || "N/A"}</p>`;
    } else if (category === "other") {
      emailContent += `
      <h3 style="color: #333; border-bottom: 1px solid #ff8c00; padding-bottom: 10px;">Other Inquiry</h3>
      <p style="font-size: 14px; color: #555;"><strong>Requirements:</strong> ${categoryData.requirements || "N/A"}</p>
      <p style="font-size: 14px; color: #555;"><strong>Contact Number:</strong> ${categoryData.keyContacts || "N/A"}</p>`;
    }

    emailContent += `
      <hr style="border: 0; border-top: 1px solid #ff8c00; margin: 20px 0;">
      <p style="font-size: 14px; color: #555; text-align: center;">Please respond to this inquiry at your earliest convenience.</p>
      <p style="font-size: 14px; color: #555; text-align: center;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>`;

    await transporter.sendMail({
      from: `"${user.fullName}" <${user.email}>`,
      to: process.env.EMAIL_USER,
      subject: categoryData.subject || `New ${category} Inquiry`,
      html: emailContent,
    });
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error:", err);   
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ 
        message: "Validation failed",
        errors 
      });
    }    
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});

export default router;