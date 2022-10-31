import express from 'express';
import morgan from 'morgan'; //(log관리)개발 : dev, 배포 : combined
import path from 'path';
import dotenv from 'dotenv';

import connect from './schemas/index.js';
import indexRouter from './routes/index.js';

dotenv.config();
const app = express();

const __dirname = path.resolve();
app.set('port', process.env.PORT || 3000); //(논리단축평가)환경변수_포트 속성에 값이 이미 있으면 그것을쓰고 없으면 3000을 사용
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.json()); //json요청 파싱모듈
app.use(express.urlencoded({extended: false})); //url쿼리요청 파싱

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
