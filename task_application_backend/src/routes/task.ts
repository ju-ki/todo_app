import express from "express";
import type { IRouter, Request, Response } from "express";
import { Clerk } from "@clerk/backend";
import { PrismaClient, TaskLabel, TaskStatus } from "@prisma/client";

const router: IRouter = express.Router();
const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = Clerk({ secretKey: secretKey });

/**
 * タスクの追加
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const userId = req.body.userId as string;
    const workSpaceId = req.body.workSpaceId as string;
    const title = req.body.title as string;
    const description = req.body.description != null ? req.body.description as string  : "";
    const status = req.body.status as TaskStatus;
    const label = req.body.label as TaskLabel;
    const dueDate = req.body.dueDate as Date;
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(401).send({ "message": "Unauthorized" });
    }
    console.log(req.body);

    const newTask = await db.task.create({
      data: {
        title: title,
        description: description,
        status: status,
        label: label,
        dueDate: dueDate,
        workSpaceId: workSpaceId,
      },
    })

    await db.taskAssignments.create({
      data: {
        taskId: newTask.taskId,
        userId:userId
      }
    })


    res.status(200).send({ "task": newTask });
  } catch (err) {
    console.log("CREATE_TASK_ERROR:", err);
    res.status(500).send({ "message": "Internal Server Error" });
  }
})

module.exports = router;