const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

// Connect to database
require("./db");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));
app.use("/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));