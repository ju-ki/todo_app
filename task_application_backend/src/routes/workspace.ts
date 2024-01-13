import {v4 as uuidv4} from "uuid";
import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import {MemberRole, PrismaClient } from "@prisma/client";

const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });


router.get("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const userId = req.query.userId as string;
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(400).send({
        "message": "User Not Found"
      });
    }

    const workSpaces = await db.workSpace.findMany({
      where: {
        userId:userId
      }
    });

    res.status(200).send({ workSpaces: workSpaces });
  } catch (err) {
    console.log("[FETCHING_WORKSPACE_ERROR]", err);
    res.status(500).send({ error: err });
  }
})


router.get("/details", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const userId = req.query.userId as string;
    const workSpaceId = req.query.workSpaceId as string;
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      res.status(401).send({
        "message": "Unauthorized"
      });
    }

    if (!workSpaceId) {
      res.status(404).send({
        "message": "WorkSpaceId is Missing"
      });
    }

    //workspaceに一致するtaskの取得
    const task = await db.task.findMany({
      where: {
        workSpaceId: workSpaceId
      }
    });

    //workspaceに属しているユーザーの取得
    const users = await db.user.findMany({
      where: {
        workSpaces: {
          some: {
            id:workSpaceId
          }
        }
      }
    });

    res.status(200).send({ task:task, users:users});

  } catch (err) {
    res.status(500).send({
      error:err
    })
  }
})


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