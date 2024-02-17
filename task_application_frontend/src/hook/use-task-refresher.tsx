import { useCallback, useState } from "react";
// タスクが追加された際に使用するhook
export const useTaskRefresher = () => {
  const [refreshTasks, setRefreshTasks] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshTasks((prev) => !prev);
  }, []);

  return { refreshTasks, triggerRefresh };
};
