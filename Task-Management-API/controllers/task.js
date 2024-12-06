const { StatusCodes } = require("http-status-codes");
const Task = require("../models/task");
const { NotFoundError, BadRequestError } = require("../errors");
const sendEmail = require("../utils/emailService");
const getAllTasks = async (req, res) => {
  const { category, sort, completed, numericFilters } = req.query;
  const queryObject = { createdBy: req.user.userId };
  if (category) {
    queryObject.category = category;
  }

  if (completed) {
    queryObject.completed = completed;
  }

  const operatorMap = {
    ">": "$gt",
    ">=": "$gte",
    "=": "$eq",
    "<=": "$lte",
    "<": "$lt",
    "!=": "$ne",
  };

  if (numericFilters) {
    const filters = numericFilters
      .split(",")
      .map((item) => item.replace(/([a-zA-Z]+)([<>=!]+)(.+)/, "$1_$2_$3"));
    for (let i = 0; i < filters.length; i++) {
      const [field, operator, value] = filters[i].split("_");
      queryObject[field] = { [operatorMap[operator]]: value }; //The one more bracket in the key area of the object is done so as to evaluate the inside expression. Without this, it will take the expression as the key which is not right
      console.log(queryObject);
    }
  }

  let result = Task.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const tasks = await result;

  res.status(StatusCodes.OK).json({ tasks, number: tasks.length });
  // res.status(StatusCodes.OK).json({ msg: "The response has been done" });
};

const createTask = async (req, res) => {
  const { userId: id, email } = req.user;
  req.body.createdBy = id;
  const task = await Task.create({ ...req.body });
  try {
    await sendEmail(
      email,
      "Task created successfully",
      `Your task  ${task.title} has been created and is due on ${task.dueDate}`
    );
  } catch (error) {
    console.error("Failed to send task creation email: ", error.message);
  }
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
