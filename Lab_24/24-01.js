require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const session = require("express-session")({
  resave: false,
  saveUninitialized: false,
  secret: "some-secret-string",
});

passport.serializeUser((user, done) => {
  done(null, user); 
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "696822154135-eki2vvmd52p4kctq7doneeu06vk8fknb.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (token, refreshToken, profile, done) => {
      done(null, { profile: profile, token: token });
    }
  )
);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account", 
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/resource",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout((error) => {
    console.log(error);
    res.send("<h1>Logged out</h1><hr>");
  });
});

app.get("/resource", (req, res) => {
  if (req.user === undefined) {
    res.redirect("/login");
  } else {
    console.log(req.user);
    res.send(
      `<h1>RESOURCE</h1><hr><p>ID: ${req.user.profile.id}</p><p>Name: ${req.user.profile.name.givenName} ${req.user.profile.name.familyName}</p>`
    );
  }
});

app.use((req, res) => {
  res.status(404).send("<h1>Not found</h1><hr>");
});

app.listen(3000, () => {
  console.log(`Server started on port (http://localhost:3000/login)`);
});
