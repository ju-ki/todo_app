import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import {PrismaClient } from "@prisma/client";

const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });


router.post("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const userId = req.body.userId;
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

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(400).send({
        "message":"User Not Found"
      });
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
    console.error("[CREATE_PROFILE_ERROR]", err); // エラー時のログ
    res.status(500).send({ error: err });
  }
});

router.patch("/authority", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const targetAuthority = req.body.targetAuthority;
  const targetUserId = req.body.targetUserId;
  const workSpaceId = req.body.workSpaceId;

  try {
    const db = new PrismaClient();
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(401).send({ "message": "Unauthorized" });
    }

    if (!targetUserId) {
      res.status(400).send({"message": "Target UserId is Missing"});
    }

    if (!workSpaceId) {
      res.status(400).send({ "message": "WorkSpaceId is Missing" });
    }

    if (!targetAuthority) {
      res.status(400).send({ "message": "target Authority is Missing" });
    }

    //TODO:ここに権限変更のコードを書く
    await db.userWorkSpace.update({
      where: {
        userId_workSpaceId: {
          workSpaceId: workSpaceId as string,
          userId: targetUserId as string
        }
      },
      data: {
        role: targetAuthority
      }
    });

    const workSpace = await db.workSpace.findFirst({
      where: {
        id: workSpaceId
      },
      include: {
        tasks: true,
        userWorkSpaces: {
          select: {
            user: true,
            role: true
          }
        }
      },
    });

    if (!workSpace) {
      res.status(404).send({
        "message":"WorkSpace is Missing"
      })
    }

    res.status(200).send({ workSpace: workSpace });


  } catch (err) {
    console.log("UPDATE_USER_AUTHORITY_ERROR:", err);
    res.status(500).send({ "message": "Internal Server Error" });
  }
})


module.exports = router;