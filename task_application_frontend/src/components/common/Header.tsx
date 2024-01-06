/* eslint-disable import/no-extraneous-dependencies */
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Header() {
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
            <p>
              <UserButton afterSignOutUrl="/" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
