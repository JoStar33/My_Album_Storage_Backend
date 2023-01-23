const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { asyncFor } = require("../utils/asyncForEach");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../schemas/user");
const Topster = require("../schemas/topster");
const DailyInfo = require("../schemas/dailyInfo");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/join", async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ email: email });
    console.log(exUser);
    if (exUser !== []) {
      return res
        .status(400)
        .json({ message: "해당 이메일은 이미 존재합니다." });
    }
    const exNickUser = await User.find({ nick: nick });
    if (exNickUser !== []) {
      return res
        .status(400)
        .json({ message: "해당 닉네임은 이미 존재합니다." });
    }
    console.log(nick);
    const hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      nick,
      password: hash,
    });
    await asyncFor(5, async (index) => {
      await Topster.create({
        name: `topster${index + 1}`,
        type: "3x3",
        albums: [],
        owner: newUser._id,
      });
    });
    return res.json({ email, nick });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/join/email", async (req, res, next) => {
  const { email } = req.body;
  try {
    const exUser = await User.find({ email: email });
    console.log(exUser);
    if (exUser.length !== 0) {
      return res
        .status(400)
        .json({ message: "해당 이메일은 이미 존재합니다." });
    }
    return res.json({message: "ok"});
  } catch (error) {
    console.error(error);
    return next(error);
  }
})
router.post("/join/nick", async (req, res, next) => {
  const { nick } = req.body;
  try {
    const exUser = await User.find({ nick: nick });
    console.log(exUser);
    if (exUser !== []) {
      return res
        .status(400)
        .json({ message: "해당 닉네임은 이미 존재합니다." });
    }
    return res.json({ ok });
  } catch (error) {
    console.error(error);
    return next(error);
  }
})

router.post("/login", isNotLoggedIn, async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(500).json({
        code: 500,
        message: info.message,
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      DailyInfo.find({}).length
      const token = jwt.sign(
        {
          id: user._id,
          nick: user.nick,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "3h",
          issuer: "토큰 발급자",
        }
      );
      res.setHeader("Authorization", token);
      return res.json({
        id: user._id,
        email: user.email,
        nick: user.nick,
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy(function (err) {
    req.logout();
    res.json({
      message: "정상적으로 로그아웃 했습니다.",
    });
  });
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
