import express from "express";
import Project from "../models/Project.js";
import Teaching from "../models/Teaching.js";
import Notes from "../models/Notes.js";
import supportQuestions from "../config/support.js";
import {
  validateNote,
  validateProject,
  validateTeaching,
  isLoggedIn,
  isAdmin
} from "../middlewares.js";

const router = express.Router();

router.get("/support", (req, res) => {
  try {
    res.status(200).json({ success: true, data: supportQuestions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch support data" });
  }
});

const selectValidator = (req, res, next) => {
  const { category } = req.params;
  switch (category) {
    case "projects":
      return validateProject(req, res, next);
    case "teaching":
      return validateTeaching(req, res, next);
    case "notes":
      return validateNote(req, res, next);
    default:
      return res.status(400).json({ error: "Invalid category" });
  }
};

router.post("/:category", 
  isLoggedIn,
  isAdmin,
  selectValidator,
  async (req, res) => {
    const { category } = req.params;
    const data = req.body;
    
    try {
      let newData;
      switch (category) {
        case "projects":
          newData = new Project(data);
          break;
        case "teaching":
          newData = new Teaching(data);
          break;
        case "notes":
          newData = new Notes(data);
          break;
        default:
          return res.status(400).json({ error: "Invalid category" });
      }
      
      await newData.save();
      res.status(201).json({ 
        message: `${category} created successfully`, 
        data: newData 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ 
        error: "Failed to create post", 
        details: error.message 
      });
    }
  }
);

router.get("/:category", async (req, res) => {
  const { category } = req.params;
  try {
    let data;
    switch (category) {
      case "projects":
        data = await Project.find();
        break;
      case "teaching":
        data = await Teaching.find();
        break;
      case "notes":
        data = await Notes.find();
        break;
      default:
        return res.status(400).json({ error: "Invalid category" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
});

export default router;