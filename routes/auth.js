const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { asyncFor } = require('../utils/asyncForEach');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schemas/user');
const Topster = require('../schemas/topster');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ email });
    console.log(exUser);
    if (exUser === []) {
      return res.status(400).json({ message: "해당 이메일은 이미 존재합니다." })
    }
    const exNickUser = await User.find({ nick });
    if (exNickUser === []) {
      return res.status(400).json({ message: "해당 닉네임은 이미 존재합니다." })
    }
    console.log(nick);
    const hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      nick,
      password: hash,
    });
    await asyncFor(5, async (index) => {
      const userTopster = await Topster.create({
        name: `topster${index + 1}`,
        type: '3x3',
        albums: [],
        owner: newUser._id
      })
    })
    return res.json({ email, nick })
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(500).json({
        code: 500,
        message: info.message
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json({
        id: user._id,
        email: user.email,
        nick: user.nick
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({
    message: '정상적으로 로그아웃 했습니다.'
  });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
