import { useParams } from "react-router-dom";
import { useModal } from "src/hook/use-modal";
import TaskItem from "./TaskItem";

export default function TaskComp(workSpace:Record<string, any>) {
  const { onOpen } = useModal();
  const { workspaceId } = useParams();

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
          未着手
          <TaskItem />
        </div>
        <div>
          保留
          <TaskItem />
        </div>
        <div>
          進行中
          <TaskItem />
        </div>
        <div>
          完了
          <TaskItem />
        </div>
      </div>
    </div>

  );
}
