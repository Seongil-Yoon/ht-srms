import express from "express";
import morgan from "morgan"; //(log관리)개발 : dev, 배포 : combined
import ejs from "ejs";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

import v1 from "./routes/secure-layer/v1";
import authRouter from "./routes/secure-layer/auth";
import indexRouter from "./routes";

const app = express();

app.set('port', process.env.PORT || 3000); //(논리단축평가)환경변수_포트 속성에 값이 이미 있으면 그것을쓰고 없으면 3000을 사용
app.set('view engine', 'ejs');
//connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public/static')));
app.use('views', path.join(__dirname, 'views'));
app.use(express.json()); //json요청 파싱모듈
app.use(express.urlencoded({
    extended: false
})); //url쿼리요청 파싱
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키자체서명 비밀키
app.use(session({ //세션관리시 클라이언트에 쿠키를 전송
    resave: false, //false:요청올시 세션에 수정 사항 생겨도 다시저장X
    saveUninitialized: false, //false:세션에 저장내역 없어도 다시저장X
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, //배포시에는 true
    },
}));

app.use('/v1', v1);
app.use('/auth', authRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; //(3항 연산자)스택트레이스를 배포환경이 아닐때만 err표시
    res.status(err.status || 500); //상태값이 있으면 그것을쓰고 없으면 500번
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});