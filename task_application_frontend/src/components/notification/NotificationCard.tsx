import React from 'react';

type NotificationProps = {
  id: string;
  // isRead: boolean;
  task: Record<string, any>;
};

function NotificationCard({
  id,
  // isRead,
  task,

}: NotificationProps) {
  console.log(task);

  const calculateDaysLeft = (date: Date) => {
    const today = new Date();
    const difference = date.getTime() - today.getTime();
    const daysLeft = Math.ceil(difference / (1000 * 3600 * 24));
    return daysLeft;
  };
  return (
    <div key={id}>
      <p>
        <span className="font-bold">
          {task.title}
        </span>
        の期日が近づいています
      </p>
      <p className="my-2">
        期日まで
        <span className="font-bold text-red-500">
          {calculateDaysLeft(new Date(task.dueDate))}
        </span>
        日です
      </p>
    </div>
  );
}

export default NotificationCard;
