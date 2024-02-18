import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import { PrismaClient } from "@prisma/client";


const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });

router.patch("/", async (req: Request, res: Response) => { 
  try {
    const db = new PrismaClient();
    const userId = req.body.userId;
    const notificationId = req.body.unReadNotificationsId;
    console.log(notificationId);

    if (!userId) {
      res.status(400).send({ "message": "UserId is Missing" });
      return;
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(401).send({ "message": "Unauthorized" });
      return;
    }

    await db.notification.updateMany({
      where: {
        id: {
          in: notificationId
        }
      },
      data: {
        isRead: true
      }
    });

    res.status(200).send({ "message": "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ "message": "Internal Server Error" });
  }
})

module.exports = router;