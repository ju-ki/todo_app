import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

export default function TopPageComp() {
  const { userId } = useAuth();
  useEffect(() => {
    async function saveProfile() {
      try {
        const response = await axios.post("http://localhost:3001/save-profile", { userId });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
    if (userId) {
      saveProfile();
    }
  }, [userId]);

  return (
    <div className="my-60 md:container md:mx-auto container mx-auto">
      <div className="md:flex justify-around my-24">
        <div className="md:w-2/4 me4">
          <h1 className="text-4xl font-bold my-4">Welcome to Our Application!</h1>
          <p className="text-xl mb-4">
            タスク管理をもっと簡単に、もっと便利に。
          </p>
          <p className="text-xl mb-4">
            タスクメモは、あなたのタスク管理をサポートするアプリケーションです。
          </p>
          <div className="my-64">
            <button
              type="button"
              className="font-semibold bg-gray-900 hover:bg-gray-600 text-white py-3 px-3 rounded-md"
            >
              タスクメモを使ってみよう
            </button>
          </div>
        </div>
        <div className="md:w-2/4">
          <img src="https://placehold.jp/640x480.png" alt="タスク一覧イメージ" />
        </div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card">
          <img src="https://placehold.jp/640x480.png" alt="タスク作成イメージ" />
          <div className="card-body">
            <h5 className="card-title">タスクの作成</h5>
            <p className="card-text">
              タスクを簡単に作成できます。
            </p>
          </div>
        </div>
        <div className="card">
          <img src="https://placehold.jp/640x480.png" alt="タスク検索イメージ" />
          <div className="card-body">
            <h5 className="card-title">タスクの検索</h5>
            <p className="card-text">
              タスクを簡単に検索できます。
            </p>
          </div>
        </div>
        <div className="card">
          <img src="https://placehold.jp/640x480.png" alt="タスク通知イメージ" />
          <div className="card-body">
            <h5 className="card-title">タスクの通知</h5>
            <p className="card-text">
              タスクの期限が近づくと通知されます。
            </p>
          </div>
        </div>
        <div className="card">
          <img src="https://placehold.jp/640x480.png" alt="タスク共有イメージ" />
          <div className="card-body">
            <h5 className="card-title">タスクの共有</h5>
            <p className="card-text">
              タスクを他のユーザーと共有できます。
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}
