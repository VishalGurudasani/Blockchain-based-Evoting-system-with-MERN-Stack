const connectToMongo = require("./DB");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Available Routes

app.use("/api/auth", require("./Routes/auth"));
app.use("/api/otp", require("./Routes/otp"));
app.use("/api/vote", require("./Routes/vote"));

app.listen(port, () => {
  console.log(`Evoting backend listening at http://localhost:${port}`);
});
