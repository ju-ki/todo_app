import { PrismaClient } from "@prisma/client";

const fetchNotifications = async (userId: string ) => {
  const db = new PrismaClient();
  const tasks = await db.taskAssignments.findMany({
    where: {
      userId: userId
    },
    include: {
      task: true
    }
  });
  //taskのステータスがTODOまたはDOINGのタスクを取得する
  const tasksClassifiedByStatus: Record<string, any>[] = [];

  tasks.forEach((task) => {
    if (task.task.status === "TODO" || task.task.status === "DOING" ) {
      tasksClassifiedByStatus.push(task.task);
    }
  });

  //取得したtaskの情報をnotificationテーブルにない場合、取得してきたtaskの情報をnotificationテーブルに追加する
  const notifications = await db.notification.findMany({
    where: {
      userId: userId
    },
    select: {
      taskId: true
    }
  });

  tasksClassifiedByStatus.forEach(async (task) => {
    if (!(notifications.some((notification) => notification.taskId === task.taskId))) {
      await db.notification.create({
        data: {
          taskId: task.taskId,
          userId: userId
        }
      });
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 4);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const displayedNotifications = await db.notification.findMany({
    where: {
      userId: userId,
      OR: [
        {
          isRead:false
        },
        {
          isRead: true,
          createdAt: {
            gte:sevenDaysAgo
          }
        }
      ],
      task: {
        dueDate: {
          gte: today,
          lte: threeDaysLater
        }
      }
    },
    include: {
      task: {
        select: {
          title: true,
          status: true,
          dueDate:true
        }
      },
    },
  });

  return displayedNotifications;
}

module.exports = {
  fetchNotifications
};