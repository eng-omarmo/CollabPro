const express = require("express");
const dotenv = require("dotenv").config();
const color = require("colors");
const connectDB = require('./config/connection')
const app = express();

const Port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.listen(Port, () => {
  console.log(`server is running on port http://localhost:${Port}`.cyan);
});

app.use("/api/users", require("./routes/userRoute"));

app.use('/api/organizations', require('./routes/orgRoute'))

app.use('/api/projects', require('./routes/projectRoute'))


app.use = (req, res, next) => {
    res.status(404).send("Error: Endpoint not found");
  };
