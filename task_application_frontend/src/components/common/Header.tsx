import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useModal } from "src/hook/use-modal";
import { useTaskRefresher } from "src/hook/use-task-refresher";
import axios from "src/lib/axios";
import NotificationItem from "../notification/NotificationItem";
import WorkSpaceItem from "../workspace/workspace-item";

type WorkSpaceProps = {
  id: string,
  title: string,
  userId: string,
  inviteCode: string
};

export default function Header() {
  const { onOpen } = useModal();
  const { userId } = useAuth();
  const { isSignedIn, isLoaded } = useUser() as { isSignedIn: Boolean; isLoaded: Boolean };
  const [workspaces, setWorkspaces] = useState<WorkSpaceProps[]>([]);
  const [notifications, setNotifications] = useState([]);
  const { refreshTasks, triggerRefresh } = useTaskRefresher();

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const response = await axios.get("/workspaces", {
          params: {
            userId,
          },
        });
        console.log(response.data);
        setWorkspaces(response.data.workSpaces);
        setNotifications(response.data.notifications);
      } catch (err) {
        console.log(err);
      }
    }
    if (userId) {
      fetchWorkspaces();
    }
  }, [userId, refreshTasks]);

  if (!isLoaded) {
    return null;
  }
  return (
    <div className="bg-gray-800 fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-xl">
          <Link className="text-white" to="/">
            タスクメモ
          </Link>
        </div>
        <div>
          {!isSignedIn ? (
            <>
              <Link to="/sign-in" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Sign In
              </Link>
              <Link to="/sign-up" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <div
              className="flex items-center"
            >
              <div className="me-10">
                <WorkSpaceItem workspaces={workspaces} />
              </div>
              <div className="me-10">
                <button
                  type="button"
                  onClick={() => onOpen("createWorkSpace")}
                  className="flex items-center bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  <Plus className="h-4 w-4" />
                  新規ワークスペースを作成
                </button>
              </div>
              <div>
                <NotificationItem notifications={notifications} triggerRefresh={triggerRefresh} />
              </div>
              <div
                className="me-8"
              >
                <UserButton
                  afterSignOutUrl="/"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
