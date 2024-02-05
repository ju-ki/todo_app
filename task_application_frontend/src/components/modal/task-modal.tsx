import { useAuth } from "@clerk/clerk-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { useModal } from "src/hook/use-modal";
import axiosClient from "src/lib/axios";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

export default function TaskModal() {
  const { userId } = useAuth();
  const {
    isOpen, onClose, type, data,
  } = useModal();
  const isModalOpen = isOpen && type === "task";
  const handleClose = () => {
    onClose();
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
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    if (userId && data.taskId) {
      fetchTaskDetail();
    }
  }, [data]);

  return (
    <div className="w-full">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[80%]">
          <DialogHeader>
            <DialogTitle>
              タスクモーダル
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
