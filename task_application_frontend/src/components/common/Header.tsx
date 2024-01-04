export default function Header() {
  return (
    <div className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-xl">タスクメモ</div>
        <div>
          <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Sign In
          </button>
          <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
