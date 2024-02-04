import { useParams } from "react-router-dom";
import { useModal } from "src/hook/use-modal";
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
  const { onOpen } = useModal();
  const { workspaceId } = useParams();

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
      <div>タスク一覧</div>
      <div>
        <button
          type="button"
          onClick={() => onOpen("createTask", { workSpaceId: workspaceId, workSpace })}
        >
          タスク追加
        </button>
      </div>
      <div className="flex justify-around">
        <div>
          <div>未着手</div>
          {tasksClassifiedByStatus.TODO.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem {...task} />
            </div>
          ))}
        </div>
        <div>
          <div>保留</div>
          {tasksClassifiedByStatus.WAITING.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem {...task} />
            </div>
          ))}
        </div>
        <div>
          <div>進行中</div>
          {tasksClassifiedByStatus.DOING.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem {...task} />
            </div>
          ))}
        </div>
        <div>
          <div>完了</div>
          {tasksClassifiedByStatus.DONE.map((task:TaskProps) => (
            <div key={task.taskId}>
              <TaskItem {...task} />
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
