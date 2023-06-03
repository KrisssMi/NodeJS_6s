require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const { serverSign } = require("./EDS");
const app = express();

app.use(bodyParser.json());
app.get("/", (req, res) => {
  try {
    const rs = fs.createReadStream(`${__dirname}/server.txt`, {
      encoding: "utf8",
    });

    serverSign(rs, (signContext) => {
      res.json(signContext);
    });
  } catch (e) {
    res.status(409).json({ error: "Something run wrong" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
