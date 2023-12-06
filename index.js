import express from "express";
import http from "http";
import { webSocket } from "./src/controller/webSocket.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();


app.use(express.json({ limit: '500mb' }));

// import web socket..
webSocket();

app.use(function (req, res, next) {
    next(createError(404));
});


app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})