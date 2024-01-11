import {v4 as uuidv4} from "uuid";
import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import {MemberRole, PrismaClient } from "@prisma/client";

const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });


router.post("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();

    const title = req.body.title;
    const userId = req.body.userId;
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(400).send({
        "message":"User Not Found"
      });
    }

    const newWorkspace = await db.workSpace.create({
      data: {
        title: title,
        inviteCode: uuidv4(),
        user: {
          connect: {
            userId: userId,
          },
        },
        //中間テーブルの作成
        userWorkSpaces: {
          create: [
            { userId:userId, role: MemberRole.ADMIN }
          ]
        }
      }
    })
    //作成されたworkspaceIをもとにリダイレクトを行うためデータの返却
    res.status(201).send({ workspace: newWorkspace });
  } catch (err) {
    console.log("[CREATE_WORKSPACE_ERROR]", err);
    res.status(500).send({ error: err });
  }
})


module.exports = router;