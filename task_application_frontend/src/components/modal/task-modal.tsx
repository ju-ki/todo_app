import { useAuth } from "@clerk/clerk-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BookText, Calendar, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useModal } from "src/hook/use-modal";
import axiosClient from "src/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface TaskProps {
  taskId: string;
  title: string;
  description: string | null;
  label: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  taskAssignments: Record<string, any>;
}

export default function TaskModal() {
  const { userId } = useAuth();
  const {
    isOpen, onClose, type, data,
  } = useModal();
  const isModalOpen = isOpen && type === "task";
  const handleClose = () => {
    onClose();
  };
  const [task, setTask] = useState<TaskProps>();
  const statusStyles: { [key: string]: string } = {
    WAITING: "bg-gray-400",
    TODO: "bg-orange-300",
    DOING: "bg-blue-500",
    DONE: "bg-green-500",
  };
  const labelStyles: { [key: string]: string } = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-orange-300",
    LOW: "bg-blue-500",
  };
  useEffect(() => {
    async function fetchTaskDetail() {
      try {
        const response = await axiosClient.get("/tasks/details", {
          params: {
            userId,
            taskId: data.taskId,
          },
        });
        console.log(response.data.task);
        setTask(response.data.task);
      } catch (err) {
        console.log(err);
      }
    }

    if (userId && data.taskId) {
      fetchTaskDetail();
    }
  }, [data]);

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()は0から始まるため+1
    const day = date.getDate();
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  }

  return (
    <div className="w-full">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[80%] max-w-4xl mx-auto my-8 p-6 bg-white rounded shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl font-semibold">{task?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-5/6">
            {/* 説明 */}
            <div className="mt-4">
              <div className="flex items-center">
                <BookText className="me-2" />
                <h3 className="text-xl font-semibold">内容</h3>
              </div>
              <p className="mt-2 text-gray-700">{task?.description}</p>
            </div>
            {/* ラベル */}
            <div className="mt-4">
              <div className="flex items-center">
                <Tag className="me-2" />
                <h3 className="text-xl font-semibold">優先度</h3>
              </div>
              <p className={`mt-2 px-4 py-2 inline-flex rounded-md text-slate-700 ${labelStyles[task?.label || "MEDIUM"]}`}>
                {task?.label}
              </p>
            </div>
            {/* ステータス */}
            <div className="mt-4">
              <div className="flex items-center">
                <Tag className="me-2" />
                <h3 className="text-xl font-semibold">ステータス</h3>
              </div>
              <p className={`mt-2 px-4 py-2 inline-flex rounded-md text-slate-700 ${statusStyles[task?.status || "TODO"]}`}>
                {task?.status}
              </p>
            </div>
            {/* 期日 */}
            <div className="mt-4">
              <div className="flex items-center">
                <Calendar className="me-2" />
                <h3 className="text-xl font-semibold">期日</h3>
              </div>
              <p className="mt-2 text-gray-700">{formatDate(new Date(task?.dueDate || new Date()))}</p>
            </div>
            {/* 作成日 */}
            <div className="mt-4">
              <div className="flex items-center">
                <Calendar className="me-2" />
                <h3 className="text-xl font-semibold">作成日</h3>
              </div>
              <p className="mt-2 text-gray-700">{formatDate(new Date(task?.createdAt || new Date()))}</p>
            </div>
            {/* 更新日 */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">更新日</h3>
              <p className="mt-2 text-gray-700">{formatDate(new Date(task?.updatedAt || new Date()))}</p>
            </div>
            {/* 担当者 */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">担当者</h3>
              <div className="mt-2 flex flex-wrap">
                {task?.taskAssignments.map((assignment: Record<string, any>) => (
                  <div key={assignment.user.userId} className="mr-4 mb-4 flex items-center">
                    <Avatar className="bg-gray-200 rounded-full overflow-hidden w-10 h-10">
                      <AvatarImage src={assignment?.user?.imageUrl} alt="profile image" className="w-full h-full object-cover" />
                      <AvatarFallback className="flex justify-center items-center text-sm">CN</AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
            <div>
              test
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>

  );
}
