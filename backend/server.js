const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const authRouter = require('./src/Routers/authRouter');
const mainRouter = require('./src/Routers/mainRouter');
const galleryRouter = require('./src/Routers/galleryRouter');

dotenv.config();

const app = express();

app.set("port", 3001);
app.set("host", "0.0.0.0");

const corsOptions = {
    origin: "http://localhost:3001",
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// router
app.use('/auth', authRouter);
app.use('/main', mainRouter);
app.use('/gallery', galleryRouter);

const server = http.createServer(app);
server.listen(app.get("port"), app.get("host"), () =>
    console.log(
      "Server is running on : " + app.get("host") + ":" + app.get("port")
    )
);

app.get('/', (req, res) => {
    res.send('Hello World');
});