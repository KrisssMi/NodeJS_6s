require("dotenv").config({ path: ".env" });
const methodOverride = require("method-override");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const bodyParser = require("body-parser");
const express = require("express");
const hbs = require("hbs");
const expressHbs = require("express-handlebars").create({ extname: ".hbs" });

const app = express();
const port = 3000;

app.engine(".hbs", expressHbs.engine);
app.set("view engine", ".hbs");

const departmentRouter = require("./routers/departmentRouter");
const officialInformationRouter = require("./routers/officialInformationRouter");
const personalInformationRouter = require("./routers/personalInformationRouter");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use("/personalInformation", personalInformationRouter);
app.use("/officialInformation", officialInformationRouter);
app.use("/department", departmentRouter);

app.listen(3000, () => {
  console.log("Приложение запущено: http://localhost:" + port);
});
