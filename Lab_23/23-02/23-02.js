require("dotenv").config({ path: ".env" });
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const prismaClient = new PrismaClient();
const redisClient = redis.createClient();

redisClient.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      name,
    },
  });

  if (user) {
    return res.status(400).send("This user already exists");
  }

  await prismaClient.user.create({
    data: {
      name,
      password: await bcrypt.hash(password, 10),
    },
  });

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", async (req, res) => {
  const { username: name, password } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      name,
    },
  });

  if (user === null || !(await bcrypt.compare(password, user.password))) {
    return res.redirect("/login");
  }

  const { accessToken, refreshToken } = await createTokens(user.id, res);

  res.cookie("accessToken", accessToken, {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict", // куки должны отправляться только в случае, если запрос идет с того же домена, что и сервер
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, // куки не доступны для изменения на стороне клиента
    path: "/", // куки доступны для всех страниц сайта
  });

  await redisClient.set(`${user.id}`, refreshToken);
  res.redirect("/resource");
});

const createTokens = async (id, res) => {
  const accessToken = jwt.sign({ id }, "qwerty", {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ id }, "zxcvbn", {
    expiresIn: "24h",
  });

  return { accessToken, refreshToken };
};

app.get("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken === undefined) {
      return res.status(401).send("Invalid token");
    }

    const { id } = jwt.verify(refreshToken, "zxcvbn");

    const savedRefreshToken = await redisClient.get(`${id}`, (error) => {
      if (error) {
        console.log(error);
      }
    });

    if (savedRefreshToken !== refreshToken) {
      return res.status(401).send("Invalid token");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await createTokens(id);

    res.cookie("accessToken", newAccessToken, {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
    });

    await redisClient.set(`${id}`, newRefreshToken);

    res.send("<h1>Refreshed token</h1>");
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
});

app.get("/logout", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const { id } = jwt.verify(refreshToken, "zxcvbn");

    await redisClient.del(`${id}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }

  res.send("<h1>Logged out</h1>");
});

app.get("/resource", (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const { id } = jwt.verify(accessToken, "qwerty");
    res.send(`<h1>Resource</h1><p> -> user id: ${id}</p>`);
  } catch (error) {
    return res.status(401).send(`<h1>Not authenticated (Error 401)</h1>`);
  }
});

app.use((req, res, next) => {
  res.status(404).send("<h1>Not found</h1>");
});

app.listen(3000, () => {
  console.log("http://localhost:3000/login");
});
