// src/index.js
import {v4 as uuidv4} from "uuid";
import express from "express";
import cors from "cors";
import type { Express, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import { PrismaClient } from "@prisma/client";

const app:Express = express();
const port: number = 3001;
const secretKey="sk_test_rKEI19ao1ojaGdp8lTzWFivEndK11iCPG4PmV1lRDS";


// CORS設定を追加
app.use(cors());
// リクエストボディを解析するためのミドルウェアを追加
app.use(express.json());

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
  });
});



app.post("/save-profile", async (req: Request, res: Response) => {
  const clerkClient = Clerk({ secretKey: secretKey });
  const userId = req.body.userId;
  try {
    const db = new PrismaClient();
    const user = await clerkClient.users.getUser(userId);

    const profile = await db.user.findUnique({
      where: {
        userId: userId
      }
    });

    if (profile) {
      res.status(200).send({
        profile: profile
      })
      return;
    }


    const newProfile = await db.user.create({
      data: {
        userId: userId,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress
      },
    });
    res.status(200).send({
      profile: newProfile
    });
  } catch (err) {
    console.error(err); // エラー時のログ
    res.status(500).send({ error: err });
  }
});

app.post("/create/workspace", async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const db = new PrismaClient();
    const title = req.body.title;
    const userId = req.body.userId;

    const newWorkspace = await db.workSpace.create({
      data: {
        title: title,
        userId: userId,
        inviteCode: uuidv4(),
        userWorkSpaces: {
          create: {
            userId: userId,
          },
        }
      }
    })
    res.status(201).send({ workspace: newWorkspace });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err });
  }


  // const workspace = await db
})




app.listen(port, () => console.log("listening on port 3001!"));