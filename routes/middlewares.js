const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인한 상태입니다.');
  }
};

exports.verifyToken = (req, res, next) => {
  // 인증 완료
  try {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    next();
  }
  // 인증 실패 
  catch(error) {
    console.log(error)
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.'
    });
  }
};
