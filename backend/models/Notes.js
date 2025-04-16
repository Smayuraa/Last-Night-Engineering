import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgSrc: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
    },
  },
  downloadNotesSrc: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
    },
  },
});

const Notes = mongoose.model("Note", noteSchema);
export default Notes;