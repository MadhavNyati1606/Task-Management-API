const { StatusCodes } = require("http-status-codes");
const Task = require("../models/task");
const { NotFoundError, BadRequestError } = require("../errors");
const getAllTasks = async (req, res) => {
  const { category } = req.query;
  const queryObject = { createdBy: req.user.userId };
  if (category) {
    queryObject.category = category;
  }
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(queryObject).limit(limit).skip(skip);

  res.status(StatusCodes.OK).json({ tasks, number: tasks.length });
};

const createTask = async (req, res) => {
  const { userId: id, name } = req.user;
  req.body.createdBy = id;
  const task = await Task.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ task });
};

const getTask = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;
  const task = await Task.findOne({ _id: id, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`Task not found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    body: { title, category },
    user: { userId },
  } = req;

  if (title === "" || category === "") {
    throw new BadRequestError(
      `Please provide a title and category for the task`
    );
  }
  const task = await Task.findOneAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new NotFoundError(`Task not found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  const task = await Task.findOneAndDelete({ _id: id, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`Task not found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
