import express from "express";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import Notes from "../models/Notes.js";
import Project from "../models/Project.js";
import Teaching from "../models/Teaching.js";
import { isLoggedIn, isAdmin, validateUser, validateNote, validateProject, validateTeaching } from "../middlewares.js";

const router = express.Router();

router.get("/users", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpires -otp -otpExpires');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires -otp -otpExpires');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { fullName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      console.log("User deleted");
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});


router.get("/contacts", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    console.log("hiii")
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.delete("/contacts/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      await contact.remove();
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/notes", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const notes = await Notes.find({});
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.put("/notes/:id", isLoggedIn, isAdmin, validateNote, async (req, res, next) => {
  try {
    const { title, description, imgSrc, downloadNotesSrc } = req.body;
    const note = await Notes.findById(req.params.id);
    if (note) {
      note.title = title || note.title;
      note.description = description || note.description;
      note.imgSrc = imgSrc || note.imgSrc;
      note.downloadNotesSrc = downloadNotesSrc || note.downloadNotesSrc;
      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/notes/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const result = await Notes.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Delete error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }

    res.status(500).json({
      message: 'Server error during deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


router.get("/projects", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.put("/projects/:id", isLoggedIn, isAdmin, validateProject, async (req, res, next) => {
  try {
    const { title, description, technologies, liveDemoSrc, snapshotSrc, imgSrc } = req.body;
    const project = await Project.findById(req.params.id);
    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.technologies = technologies || project.technologies;
      project.liveDemoSrc = liveDemoSrc || project.liveDemoSrc;
      project.snapshotSrc = snapshotSrc || project.snapshotSrc;
      project.imgSrc = imgSrc || project.imgSrc;
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/projects/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    // Option 1: Using deleteOne() (recommended)
    const result = await Project.deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    
    res.status(500).json({ 
      message: 'Server error during deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get("/teaching", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const teachings = await Teaching.find({});
    res.json(teachings);
  } catch (error) {
    next(error);
  }
});

router.put("/teaching/:id", isLoggedIn, isAdmin, validateTeaching, async (req, res, next) => {
  try {
    console.log("pochlo")
    const { title, description, youtube } = req.body;
    const teaching = await Teaching.findById(req.params.id);
    if (teaching) {
      teaching.title = title || teaching.title;
      teaching.description = description || teaching.description;
      teaching.youtube = youtube || teaching.youtube;
      const updatedTeaching = await teaching.save();
      res.json(updatedTeaching);
    } else {
      res.status(404).json({ message: 'Teaching not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/teaching/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    // Option 1: Using findByIdAndDelete (recommended approach)
    const deletedTeaching = await Teaching.findByIdAndDelete(req.params.id);
    
    if (!deletedTeaching) {
      return res.status(404).json({ message: 'Teaching video not found' });
    }
    res.json({ 
      message: 'Teaching video deleted successfully',
      deletedTeaching: {
        id: deletedTeaching._id,
        title: deletedTeaching.title
      }
    });

  } catch (error) {
    console.error('Delete error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid teaching ID format' });
    }
    
    // General error handling
    res.status(500).json({ 
      message: 'Error deleting teaching video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
export default router;