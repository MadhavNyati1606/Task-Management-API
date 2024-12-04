const { StatusCodes } = require("http-status-codes");
const Task = require("../models/task");
const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ tasks, number: tasks.length });
};

const createTask = async (req, res) => {
  const { userId: id, name } = req.user;
  req.body.createdBy = id;
  const task = await Task.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ task });
};

const getTask = async () => {
  res.send("login User");
};

const updateTask = async () => {
  res.send("login User");
};

const deleteTask = async () => {
  res.send("login User");
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
