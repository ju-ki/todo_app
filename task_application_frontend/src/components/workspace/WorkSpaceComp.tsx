import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useModal } from 'src/hook/use-modal';
import { useTaskRefresher } from 'src/hook/use-task-refresher';
import axios from 'src/lib/axios';
import CreateTaskModal from '../modal/create-task-modal';
import TaskModal from '../modal/task-modal';
import TaskComp from '../task/TaskComp';

export default function WorkSpaceComp() {
  const { userId } = useAuth();
  const { workspaceId } = useParams();
  const { refreshTasks, triggerRefresh } = useTaskRefresher();
  const { onOpen } = useModal();
  const [workSpace, setWorkSpace] = useState({});

  useEffect(() => {
    async function fetchWorkSpacesDetail() {
      try {
        const response = await axios.get("/workspaces/details", {
          params: {
            userId,
            workSpaceId: workspaceId,
          },
        });
        setWorkSpace(response.data.workSpace);
      } catch (err) {
        console.log(err);
      }
    }
    if (userId && workspaceId) {
      fetchWorkSpacesDetail();
    }
  }, [workspaceId, userId, refreshTasks]);
  return (
    <div className="my-60 md:container md:mx-auto container mx-auto">
      <button
        type="button"
        onClick={() => onOpen("members", { workSpace })}
      >
        メンバー一覧
      </button>
      <TaskComp workSpace={workSpace} />
      <CreateTaskModal triggerRefresh={triggerRefresh} />
      <TaskModal triggerRefresh={triggerRefresh} />
    </div>
  );
}
