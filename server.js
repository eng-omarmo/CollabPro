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

app.use("/api/user", require("./routes/userRoute"));

app.use('/api/organization', require('./routes/orgRoute'))

app.use('/api/project', require('./routes/projectRoute'))

app.use('/api/team', require('./routes/teamRoute'))

app.use('/api/project/manager', require('./routes/projectManagerRoute'))


app.use = (req, res, next) => {
  res.status(404).send("Error: Endpoint not found");
};
