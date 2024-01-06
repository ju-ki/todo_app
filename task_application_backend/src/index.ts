// src/index.js
import express from "express";
import type { Express, Request, Response } from "express";

const app:Express = express();
const port:number = 3001;

app.get("/", async (req: Request, res: Response) => {
  console.log("test");

  console.log(Array.from("foo"));

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("sleep");
    }, 500);
  });

  res.status(200).send({
    msg: "hello world!",
    elaptime: Date.now(),
  });
});




app.listen(port, () => console.log("listening on port 3001!"));