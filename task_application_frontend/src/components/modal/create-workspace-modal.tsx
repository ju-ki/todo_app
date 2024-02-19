import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useModal } from "src/hook/use-modal";
import axios from "src/lib/axios";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "../ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formScheme = z.object({
  title: z.string().min(1, {
    message: "ワークスペース名は必須です",
  }),
});

export default function CreateWorkSpaceModal(
  { triggerRefresh }:{ triggerRefresh: () => void },
) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "createWorkSpace";
  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    try {
      const workspace = await axios.post("/workspaces", { ...values, userId });
      form.reset();// フォームの中身を空の状態にする
      onClose();// モーダルを閉じる
      navigate(`/workspace/${workspace.data.workspace.id}`);// リダイレクト
      triggerRefresh();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Your WorkSpace
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-900">ワークスペース名</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Input WorkSpace Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button>
                作成
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
