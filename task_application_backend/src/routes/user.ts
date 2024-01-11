import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import {PrismaClient } from "@prisma/client";

const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });


router.post("/", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const db = new PrismaClient();
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


module.exports = router;