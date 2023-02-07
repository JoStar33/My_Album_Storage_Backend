const express = require('express');
const { v4 } = require('uuid');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const albumRouter = require('./routes/album');
const topsterRouter = require('./routes/topster');
const adminRouter = require('./routes/admin');
const adminAlbumRouter = require('./routes/adminAlbum');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 3030);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
connect();

/*
{
  origin: 'http://localhost:3000', // 출처 허용 옵션
  credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  exposedHeaders: ["Authorization"],
}
*/

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
//전체 허용의 경우는 origin: true를 주자.
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5173'], // 출처 허용 옵션
  credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  exposedHeaders: ["Authorization"],
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  /*
  // Use UUIDs for session IDs
  genid: (req) => {
      return v4()
  },
  // Define the session secret in env variable or in config file
  */
  secret: process.env.COOKIE_SECRET || config.sessionSecretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/album', albumRouter);
app.use('/topster', topsterRouter);
app.use('/admin', adminRouter);
app.use('/adminAlbum', adminAlbumRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
