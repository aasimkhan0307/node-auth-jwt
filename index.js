const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

const app = express();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

//Middlewares
app.use(express.json()); // to send post requests(contains body)

app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("server listening..."));
