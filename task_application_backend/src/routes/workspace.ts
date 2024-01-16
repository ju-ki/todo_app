import {v4 as uuidv4} from "uuid";
import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import {MemberRole, PrismaClient } from "@prisma/client";

const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });


/**
 * ワークスペース一覧の取得
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const userId = req.query.userId as string;
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      res.status(401).send({
        "message": "Unauthorized"
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


/**
 * ワークスペースの詳細情報の取得
 */
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


    const workSpace = await db.workSpace.findFirst({
      where: {
        id:workSpaceId
      },
      include: {
        tasks: true,
        userWorkSpaces: {
          select: {
            user: true,
            role:true
          }
        }
      },
    })

    if (!workSpace) {
      res.status(404).send({
        "message":"WorkSpace is Missing"
      })
    }

    res.status(200).send({ workSpace:workSpace});

  } catch (err) {
    res.status(500).send({
      error:err
    })
  }
})


/**
 * ワークスペースの作成
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();

    const title = req.body.title;
    const userId = req.body.userId;
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(400).send({
        "message": "User Not Found"
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
            { userId: userId, role: MemberRole.ADMIN }
          ]
        }
      }
    })
    //作成されたworkspaceIDをもとにリダイレクトを行うためデータの返却
    res.status(201).send({ workspace: newWorkspace });
  } catch (err) {
    console.log("[CREATE_WORKSPACE_ERROR]", err);
    res.status(500).send({ error: err });
  }
});


/**
 * 招待コードを更新する
 */
router.patch("/invite", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const userId = req.body.userId as string;
    const user = await clerkClient.users.getUser(userId);
    const workSpaceId = req.body.workSpaceId as string;

    if (!user) {
      res.status(401).send({
        "message": "Unauthorized"
      })
    }

    if (!workSpaceId) {
      res.status(404).send({
        "message": "WorkSpaceId is Missing"
      })
    }

    const newWorkSpace = await db.workSpace.update({
      where: {
        id: workSpaceId
      },
      data: {
        inviteCode: uuidv4()
      }
    })

    res.status(200).send({ newWorkSpace: newWorkSpace });
  } catch (err) {
    console.log("UPDATE_INVITE_CODE_ERR:" + err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.patch("/invite/:inviteCode", async (req: Request, res: Response) => {
  try {
    try {
    const db = new PrismaClient();
    const userId = req.body.userId as string;
      const user = await clerkClient.users.getUser(userId);
      const inviteCode = req.params.inviteCode;

      if (!user) {
        res.status(401).send({ "message": "Unauthorized" });
      }

      if (!inviteCode) {
        res.status(400).send({
          "message":"InviteCode is Missing"
        })
      }

      //
      const workSpace = await db.workSpace.findFirst({
        where: {
          inviteCode:inviteCode,
        }
      })

      if (!workSpace) {
        res.status(404).send({
          "message":"WorkSpace Not Found"
        })
      }

      //中間テーブルの更新について調べる
      // const newWorkSpace = await db.workSpace.update({
      //   where: {
      //     inviteCode:inviteCode
      //   },
      //   data: {
      //     userWorkSpaces: {
      //       update: {
      //         data: {
      //         }
      //       }
      //     }
      //   }
      // })



  } catch (err) {
    console.log("UPDATE_WORKSPACE_ERROR:", err);
    res.status(500).send({ "message": "Internal Server Error" });
  }
})


module.exports = router;