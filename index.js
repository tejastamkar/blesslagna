import express from "express";
import dotenv from "dotenv";

import fcmAPi from "./src/routes/fcmtokenRoute.js";

import cors from "cors";
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { webSocketFun } from "./src/controller/webSocket.js";
// import packages
import https from 'https';
import http from 'http';
import fs from 'fs';


// import scoreRoute from './src/routes/score.js';
const app = express();
const port = 3003;
dotenv.config(); // added .env data
app.use(express.static("public"));
app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.urlencoded({ limit: "600mb", extended: true }));
app.use(bodyParser.json({ limit: '600mb' }));
app.use(cors())
app.use(express.json({ limit: '600mb' }));

app.use("/api/v1/fcm", fcmAPi); //? users route binding


// this is the port listner
app.listen(port, () => {
    webSocketFun();
    console.log(`Blesslagna Backend is listening on port ${port}`);
});


app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.removeHeader("X-Powered-By");
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.locals.message = err.message;
    // console.log('Error MSG : : ',err.message);
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send({ success: false, message: "Api Not Found", data: [] });
});

export default app; 