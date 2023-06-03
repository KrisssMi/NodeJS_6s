const express = require("express");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session")({
  resave: false,
  saveUninitialized: false,
  secret: "123456789",
});
const bodyParser = require("body-parser");
const users = require("./users.json");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new localStrategy((username, password, done) => { 
    let findedUser;
    users.find((user) => {
      if (username === user.login && password === user.password) {
        findedUser = user;
        return true;
      }
    });

    return findedUser
      ? done(null, findedUser)
      : done(null, false, { message: "Wrong login or password" });
  })
);

app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/login.html");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/resource",
    failureRedirect: "/login",
  })
);

app.get(
  "/resource",
  (request, response, next) => {
    request.user  //  если он был аутентифицирован
      ? next()
      : response.send(
          `Error 401`
        );
  },
  (request, response) => {
    response.send(
      `Login: ${request.user.login}, password length: ${request.user.password.length}`
    );
  }
);

app.get("/logout", (request, response) => {
  request.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  response.redirect("/login");
});

app.use((req, res) => {
  res.status(404).send("<h1>Not found</h1><hr>");
});


app.listen(3000, () => {
  console.log("http://localhost:3000/login");
});
