// src/index.js
import express from "express";
import cors from "cors";
import type { Express} from "express";

const app:Express = express();
const port: number = 3001;
const userRouter = require("./routes/user");
const workSpaceRouter = require("./routes/workspace");


// CORS設定を追加
app.use(cors());
// リクエストボディを解析するためのミドルウェアを追加
app.use(express.json());

app.use("/users", userRouter);
app.use("/workspaces", workSpaceRouter);



app.listen(port, () => console.log("listening on port 3001!"));