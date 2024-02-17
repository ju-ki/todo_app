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
  tasks.forEach(async (task) => {
    if (!(task.taskId in notifications)) {
      await db.notification.create({
        data: {
          taskId: task.taskId,
          userId: userId
        }
      });
    }
  });
}

module.exports = {
  fetchNotifications
};