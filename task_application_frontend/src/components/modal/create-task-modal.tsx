import { useAuth, useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useModal } from 'src/hook/use-modal';
import axios from 'src/lib/axios';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Command, CommandGroup, CommandItem } from '../ui/command';
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
  users: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    imageUrl: z.string().optional(),
  })).nonempty("ユーザーは最低でも一人は必要です"),
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

interface FormValue {
  title: string;
  description: string;
  users: {
    userId: string;
    name?: string;
    imageUrl?: string;
  }[];
  status: string;
  label: string;
  dueDate: Date;
}

export default function CreateTaskModal() {
  const { userId } = useAuth();
  const { user } = useUser();

  const {
    isOpen, onClose, type, data,
  } = useModal();
  const isModalOpen = isOpen && type === "createTask";
  const [open, setOpen] = useState(false);
  const defaultUser = user ? [{
    userId: user.id,
    name: user.fullName || "",
    imageUrl: user.imageUrl || "",
  }] : [];

  const form = useForm<FormValue>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      title: "",
      description: "",
      users: defaultUser,
      status: "TODO",
      label: "OPTIONAL",
      dueDate: new Date(),
    },
  });
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  // ユーザー選択の処理
  const handleSelectUser = (userData: Record<string, any>) => {
    // すでに選択されているユーザーは追加しない
    if (!fields.some((field:Record<string, any>) => field.userId === userData.userId)) {
      append({ userId: userData.userId, name: userData.name, imageUrl: userData.imageUrl });
    }
    setOpen(false); // 選択UIを閉じる
  };

  // ユーザー削除の処理
  const handleUnselectUser = (index:number) => {
    remove(index);
  };

  // デフォルトでログインユーザーをタスクAssignmentに指定する
  useEffect(() => {
    if (isModalOpen && user) {
      append({ userId: user.id, name: user.fullName || "", imageUrl: user.imageUrl });
    }
  }, [isModalOpen, user]);

  const onSubmit = async (values: any) => {
    console.log(values);

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

  // const handleUnselect = useCallback((framework: Record<string, any>) => {
  //   setSelected((prev: Record<string, any>[]) => prev.filter((
  //     s: Record<string, any>,
  //   ) => s !== framework));
  // }, []);

  // const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
  //   const input = inputRef.current;
  //   if (input) {
  //     if (e.key === "Delete" || e.key === "Backspace") {
  //       if (input.value === "") {
  //         setSelected((prev:Record<string, any>[]) => {
  //           const newSelected = [...prev];
  //           newSelected.pop();
  //           return newSelected;
  //         });
  //       }
  //     }
  //     // This is not a default behaviour of the <input /> field
  //     if (e.key === "Escape") {
  //       input.blur();
  //     }
  //   }
  // }, []);

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
                name="users"
                render={() => (
                  <FormItem className="mx-4 mt-3">
                    <FormLabel className="text-base font-bold">ユーザー</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Command className="overflow-visible bg-transparent">
                        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <div className="flex gap-1 flex-wrap">
                            {fields.map((field: Record<string, any>, index:number) => (
                              <Badge key={field.id} className="bg-indigo-500">
                                <button
                                  type="button"
                                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  onClick={() => handleUnselectUser(index)}
                                >
                                  <div className="flex items-center">
                                    <Avatar className="w-5 h-5">
                                      <AvatarImage src={field?.imageUrl} />
                                      <AvatarFallback>C</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm ms-3">{field?.name}</div>
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground text-black" />
                                  </div>
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div
                            className="relative mt-2"
                          >
                            {open
                              ? (
                                <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                  <CommandGroup>
                                    {data.workSpace
                              && data.workSpace?.workSpace?.userWorkSpaces?.map((
                                userData: Record<string, any>,
                              ) => (
                                <CommandItem
                                  key={userData?.user?.userId}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={() => {
                                    handleSelectUser(userData?.user);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={userData?.user?.imageUrl} />
                                      <AvatarFallback>N</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm ms-3">
                                      {userData?.user?.name}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                                  </CommandGroup>
                                </div>
                              )
                              : null}
                          </div>
                        </div>
                      </Command>
                    </FormControl>
                    <Button type="button" onClick={() => setOpen(true)}>ユーザーを追加</Button>
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
