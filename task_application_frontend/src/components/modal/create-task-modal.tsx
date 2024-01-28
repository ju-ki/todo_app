import { useAuth } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useModal } from 'src/hook/use-modal';
import axios from 'src/lib/axios';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '../ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';

const formScheme = z.object({
  title: z.string().min(1, {
    message: "タイトルは必須です",
  }),
  description: z.string(),
  status: z.enum(["TODO", "WAITING", "DOING", "DONE"], {
    required_error: "ステータスタイプを指定してください ",
  }),
  label: z.enum(["OPTIONAL", "IMPORTANT", "PRIORITY", "REQUIRED"], {
    required_error: "優先度を指定してください",
  }),
  dueDate: z.date({
    required_error: "期日は設定してください",
  }),
});

export default function CreateTaskModal() {
  const { userId } = useAuth();
  const {
    isOpen, onClose, type, data,
  } = useModal();
  const isModalOpen = isOpen && type === "createTask";

  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      label: "OPTIONAL",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await axios.post("/tasks", { ...values, userId, ...data });
      handleClose();
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
      <DialogContent className="w-screen">
        <DialogHeader>
          <DialogTitle>
            タスク作成
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className=""
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ScrollArea className="h-72 w-full rounded-md border">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem
                    className="mx-4 mt-3"
                  >
                    <FormLabel className="text-black text-base font-bold">
                      タイトル
                      {' '}
                      <span className="text-red-500 mx-1">*</span>
                    </FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="タイトルを入力してください"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mx-4 mt-3">
                    <FormLabel className="text-base font-bold">内容</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Textarea
                        placeholder="TODO"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mx-4 mt-3">
                    <FormLabel className="text-base font-bold">ステータス</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <RadioGroup
                        className="flex"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="TODO" id="status1" />
                          <Label htmlFor="status1">未着手</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="WAITING" id="status2" />
                          <Label htmlFor="status2">保留中</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="DOING" id="status3" />
                          <Label htmlFor="status3">進行中</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="DONE" id="status4" />
                          <Label htmlFor="status4">完了</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="mx-4 mt-3">
                    <FormLabel className="text-base font-bold">優先度</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <RadioGroup
                        className="flex"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="OPTIONAL" id="label1" />
                          <Label htmlFor="label1">任意</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="IMPORTANT" id="label2" />
                          <Label htmlFor="label2">重要</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="REQUIRED" id="label3" />
                          <Label htmlFor="label3">必須</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PRIORITY" id="label4" />
                          <Label htmlFor="label4">優先</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="mx-4 mt-3">
                    <FormLabel className="text-base font-bold">期日</FormLabel>
                    <FormControl>
                      <Calendar
                        selected={new Date(field.value)}
                        onDayClick={field.onChange}
                        mode="single"
                        disabled={(date) => date <= new Date()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </ScrollArea>

            <DialogFooter>
              <Button className="mt-4" variant="primary">
                作成
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
