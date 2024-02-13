import { useModal } from "src/hook/use-modal";

interface TaskProps {
  taskId: string;
  title: string;
  label: string;
  dueDate: Date;
}

interface TaskItemProps {
  taskItems: TaskProps;
  workSpace: Record<string, any>;
}

export default function TaskItem({ taskItems, workSpace }:TaskItemProps) {
  const { onOpen } = useModal();
  const {
    dueDate, taskId, title, label,
  } = taskItems;
  // 期日までの残り日数を計算
  const calculateDaysLeft = (date: Date) => {
    const today = new Date();
    const difference = date.getTime() - today.getTime();
    const daysLeft = Math.ceil(difference / (1000 * 3600 * 24));
    return daysLeft;
  };

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()は0から始まるため+1
    const day = date.getDate();
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  }

  const dueDateObj = new Date(dueDate);
  const formattedDueDate = formatDate(dueDateObj);

  const daysLeft = calculateDaysLeft(new Date(dueDate));
  return (
    <div
      key={taskId}
      className="max-w-md p-4 bg-white rounded-lg border shadow-md"
      onClick={() => onOpen("task", { taskId, workSpace })}
      onKeyDown={() => onOpen("task", { taskId, workSpace })}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 overflow-hidden overflow-ellipsis">
          {title}
        </h5>
        <span className="px-3 py-1 text-sm font-semibold text-gray-100 bg-blue-600 rounded-full">
          {label}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-700">
          期限:
          {formattedDueDate}
        </p>
        <p className={`text-sm ${daysLeft < 0 ? 'text-red-500' : 'text-green-600'}`}>
          {daysLeft < 0 ? '期限切れ' : `あと${daysLeft}日`}
        </p>
      </div>
    </div>
  );
}
