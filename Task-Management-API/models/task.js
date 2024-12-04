const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the task"],
      minlength: 3,
    },

    description: {
      type: String,
      //   required: [true, "Please provide a description for the task"],
      minlength: 3,
      maxlength: 70,
    },

    dueDate: {
      type: Date,
      //   required: [true, "Please provide a date for the task"],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Please provide a valid date",
      },
    },

    completed: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      required: [true, "Please provide a category for the task"],
      minlength: 3,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The task should have a user"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
