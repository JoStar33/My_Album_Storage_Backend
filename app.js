const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connect = require('./schemas');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const albumRouter = require('./routes/album');
const topsterRouter = require('./routes/topster');
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


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // 출처 허용 옵션
  credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  exposedHeaders: ["set-cookie"],
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: false,
    secure: false,
  },
  name: 'access_token',
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/album', albumRouter);
app.use('/topster', topsterRouter);

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
