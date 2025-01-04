const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const authRouter = require('./src/Routers/authRouter');
const artworkRouter = require('./src/Routers/artworkRouter');
const coupleRouter = require('./src/Routers/coupleRouter');
const diaryRouter = require('./src/Routers/diaryRouter');

dotenv.config();

const app = express();

app.set("port", 3001);
app.set("host", "0.0.0.0");

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// router
app.use('/auth', authRouter);
app.use('/artwork', artworkRouter);
app.use('/couple', coupleRouter);
app.use('/diary', diaryRouter);

const server = http.createServer(app);
server.listen(app.get("port"), app.get("host"), () =>
    console.log(
      "Server is running on : " + app.get("host") + ":" + app.get("port")
    )
);

app.get('/', (req, res) => {
    res.send('Hello World');
});