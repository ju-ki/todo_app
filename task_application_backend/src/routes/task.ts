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
    const users = req.body.users;
    const user = await clerkClient.users.getUser(userId);
    console.log(req.body);

    if (!user) {
      res.status(401).send({ "message": "Unauthorized" });
    }

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

    await db.taskAssignments.createMany({
      data: users.map((userData:{userId:string, name:string, imageUrl:string}) => ({
        taskId: newTask.taskId,
        userId:userData.userId
      }))
    })



    res.status(200).send({ "task": newTask });
  } catch (err) {
    console.log("CREATE_TASK_ERROR:", err);
    res.status(500).send({ "message": "Internal Server Error" });
  }
})

module.exports = router;


router.get("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const workSpaceId = req.body.workSpaceId as string;
    if (!workSpaceId) {
      res.status(404).send({
        "message": "WorkSpaceId is Missing"
      });
    }

    const tasks = await db.task.findMany({
      where: {
        workSpaceId: workSpaceId
      },
      include: {
        taskAssignments: true
      }
    })

    res.status(200).send({ tasks: tasks });
  } catch (err) {
    console.log("[FETCHING_TASKS_ERROR]", err);
    res.status(500).send({ error: err });
  }
});

router.get("/details", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();
    const taskId = req.query.taskId as string;
    const userId = req.query.userId as string;
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(401).send({
        "message": "Unauthorized"
      });
      return;
    }

    if (!taskId) {
      res.status(404).send({
        "message": "TaskId is Missing"
      });
      return;
    }

    const taskDetail = await db.task.findUnique({
      where: {
        taskId: taskId
      },
      include: {
        taskAssignments: {
          include: {
            user: true
          }
        }
      }
    });

    if (!taskDetail) {
      res.status(404).send({
        "message": "Task is Missing"
      })
      return;
    }

    res.status(200).send({ task: taskDetail });
  } catch (err) {
    console.log("FETCHING_TASK_DETAIL:" + err);
    res.status(500).send({ error: err })
  }
});

router.patch("/", async (req: Request, res: Response) => {
  try {
    const db = new PrismaClient();

    const title = req.body.title as string;
    const userId = req.body.userId as string;
    const taskId = req.body.taskId as string;
    const description = req.body.description;
    const status = req.body.status;
    const label = req.body.label;
    const dueDate = req.body.dueDate;

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      res.status(401).send({ "message": "Unauthorized" });
    }

    if (!taskId) {
      res.status(400).send({ "message": "TaskId is Missing" });
    }

    const newTask = await db.task.update({
      where: {
        taskId:taskId
      },
      data: {
        title,
        description,
        status,
        label,
        dueDate
      }
    })

    res.status(200).send({task:newTask})
  } catch (err) {
    console.log("UPDATE_TASK_ERROR:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
})