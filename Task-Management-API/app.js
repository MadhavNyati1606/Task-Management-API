require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");
const adminRouter = require("./routes/admin");

const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const tokenAuthentication = require("./middleware/authentication");
const adminAuth = require("./middleware/adminAuth");

app.use(express.json());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin/task", adminAuth, adminRouter);
app.use("/api/v1/user/task", tokenAuthentication, taskRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
