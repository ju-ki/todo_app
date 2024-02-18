import TaskItem from "./TaskItem";

interface TaskProps {
  taskId: string;
  title: string;
  description: string | null;
  status: string;
  label: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function TaskComp(workSpace:Record<string, any>) {
  const classifyTasksByStatus = (tasks:Record<string, any>) => {
    const classified: { [key:string]:any } = {
      TODO: [],
      WAITING: [],
      DOING: [],
      DONE: [],
    };

    tasks.forEach((task:Record<string, string>) => {
      if (classified[task?.status]) {
        classified[task?.status].push(task);
      }
    });

    return classified;
  };

  const tasksClassifiedByStatus = classifyTasksByStatus(workSpace?.workSpace?.tasks || []);

  return (
    <div>
      <div className="text-3xl my-10">タスク一覧</div>
      <div className="flex justify-around">
        <div>
          <div className="font-bold">未着手</div>
          {tasksClassifiedByStatus.TODO.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem taskItems={task} workSpace={workSpace} />
            </div>
          ))}
        </div>
        <div>
          <div className="font-bold">保留</div>
          {tasksClassifiedByStatus.WAITING.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem taskItems={task} workSpace={workSpace} />
            </div>
          ))}
        </div>
        <div>
          <div className="font-bold">進行中</div>
          {tasksClassifiedByStatus.DOING.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem taskItems={task} workSpace={workSpace} />
            </div>
          ))}
        </div>
        <div>
          <div className="font-bold">完了</div>
          {tasksClassifiedByStatus.DONE.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem taskItems={task} workSpace={workSpace} />
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
