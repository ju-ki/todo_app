import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from 'src/hook/use-modal';
import { useTaskRefresher } from 'src/hook/use-task-refresher';
import axios from 'src/lib/axios';
import CreateTaskModal from '../modal/create-task-modal';
import TaskModal from '../modal/task-modal';
import TaskComp from '../task/TaskComp';
import { Button } from '../ui/button';

type WorkSpaceProps = {
  id: string;
  title: string;
  inviteCode: string;
  tasks: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  userWorkSpaces: Record<string, any>;
};

export default function WorkSpaceComp() {
  const { userId } = useAuth();
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { refreshTasks, triggerRefresh } = useTaskRefresher();
  const { onOpen } = useModal();
  const [workSpace, setWorkSpace] = useState<WorkSpaceProps>();
  const [user, setUser] = useState<{ role:string } | null>(null);

  useEffect(() => {
    async function fetchWorkSpacesDetail() {
      try {
        const response = await axios.get("/workspaces/details", {
          params: {
            userId,
            workSpaceId: workspaceId,
          },
        });
        setUser(response.data.workSpace.userWorkSpaces.find((
          userData: Record<string, any>,
        ) => userData.user.userId === userId));

        setWorkSpace(response.data.workSpace);
      } catch (err) {
        console.log(err);
      }
    }
    if (userId && workspaceId) {
      fetchWorkSpacesDetail();
    }
  }, [workspaceId, userId, refreshTasks]);

  const onDeleteWorksSpace = async () => {
    try {
      if (window.confirm("削除しますか?")) {
        await axios.delete("/workspaces", {
          params: {
            userId,
            workSpaceId: workspaceId,
          },
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="my-36 md:container md:mx-auto container mx-auto">
      <div className="flex justify-start items-center">
        <p className="text-5xl">{workSpace?.title}</p>
        {user && user?.role === "ADMIN" ? (
          <Button
            variant="destructive"
            className="mx-3"
            onClick={() => onDeleteWorksSpace()}
          >
            ワークスペースの削除
          </Button>

        ) : (
          <div />
        )}
      </div>
      <div className="flex justify-end">
        <Button
          className="mx-1"
          type="button"
          onClick={() => onOpen("members", { workSpace })}
        >
          メンバー一覧
        </Button>
        <Button
          className="mx-1"
          variant="primary"
          type="button"
          onClick={() => onOpen("createTask", { workSpaceId: workspaceId, workSpace })}
        >
          タスク追加
        </Button>
      </div>
      <TaskComp workSpace={workSpace} />
      <CreateTaskModal triggerRefresh={triggerRefresh} />
      <TaskModal triggerRefresh={triggerRefresh} />
    </div>
  );
}
