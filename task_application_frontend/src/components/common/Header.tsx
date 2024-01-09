import { UserButton, useUser } from "@clerk/clerk-react";
import { Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useModal } from "src/hook/use-modal";

export default function Header() {
  const { onOpen } = useModal();
  const { isSignedIn, isLoaded } = useUser() as { isSignedIn: Boolean; isLoaded:Boolean };

  if (!isLoaded) {
    return null;
  }
  return (
    <div className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-xl">
          <Link to="/">
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
                <button
                  type="button"
                  onClick={() => onOpen("createWorkSpace")}
                  className="flex items-center bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  <Plus className="h-4 w-4" />
                  新規ワークスペースを作成
                </button>
              </div>
              <div
                className="me-8"
              >
                <UserButton
                  afterSignOutUrl="/"
                />
              </div>
              <Bell className="h-8 w-8 me-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
