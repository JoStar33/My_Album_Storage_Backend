const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/login", isNotLoggedIn, (req, res, next) => {
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

module.exports = router;
