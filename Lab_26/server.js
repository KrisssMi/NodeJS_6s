const express = require("express");
require("dotenv").config({ path: ".env" });
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");

const app = express();
const key = fs.readFileSync("./key/res-mkv.key");
const cert = fs.readFileSync("./key/res-mkv.crt");

const options = {
  key: key,
  cert: cert,
};

app.get("/", (req, res) => {
  res.send("HTTPS server-MKV is running!");
});

const httpsServer = https
  .createServer(options, app)
  .listen(process.env.PORT, () => {
    console.log(
      `Server started at https://mkv:${process.env.PORT} or https://lab26-mkv:${process.env.PORT}`
    );
  });
