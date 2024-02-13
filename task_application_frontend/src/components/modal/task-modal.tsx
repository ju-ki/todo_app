import { useAuth, useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  BookText, Calendar as CalendarIcon, Tag, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useModal } from "src/hook/use-modal";
import axios from "src/lib/axios";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader,
} from "../ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

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

interface FormValue {
  title: string;
  description: string;
  users: {
    userId: string;
    name: string;
    imageUrl: string;
  }[];
  status: string;
  label: string;
  dueDate: Date;
}

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
  label: z.enum(["HIGH", "MEDIUM", "LOW"], {
    required_error: "優先度を指定してください",
  }),
  dueDate: z.date({
    required_error: "期日は設定してください",
  }),
});

export default function TaskModal() {
  const { userId } = useAuth();
  const { user } = useUser();
  const {
    isOpen, onClose, type, data,
  } = useModal();
  const isModalOpen = isOpen && type === "task";
  const handleClose = () => {
    onClose();
  };

  const [task, setTask] = useState<TaskProps>();
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  const [open, setOpen] = useState<Boolean>(false);
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
      label: "MEDIUM",
      dueDate: new Date(),
    },
  });
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
        const response = await axios.get("/tasks/details", {
          params: {
            userId,
            taskId: data.taskId,
          },
        });
        setTask(response.data.task);
      } catch (err) {
        console.log(err);
      }
    }

    if (userId && data.taskId) {
      fetchTaskDetail();
    }
  }, [data]);

  // taskがセット後formの中身をリセット
  useEffect(() => {
    const userData: Record<string, any>[] = [];
    task?.taskAssignments.forEach((elem: Record<string, any>) => {
      userData.push(elem.user);
    });
    form.reset({
      title: task?.title,
      description: task?.description || "",
      users: userData,
      status: task?.status,
      label: task?.label,
      dueDate: new Date(task?.dueDate || "") || new Date(),
    });

    console.log(userData);
  }, [task]);

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()は0から始まるため+1
    const day = date.getDate();
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  }

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  // ユーザー選択の処理
  const handleSelectUser = (userData: Record<string, any>) => {
    // すでに選択されているユーザーは追加しない
    if (!fields.some((field: Record<string, any>) => field.userId === userData.userId)) {
      append({ userId: userData.userId, name: userData.name, imageUrl: userData.imageUrl });
    }
    setOpen(false); // 選択UIを閉じる
  };

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  // ユーザー削除の処理
  const handleUnselectUser = (index: number) => {
    remove(index);
  };

  // ユーザー追加の欄からカーソルを外した際の処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const commandEl = document.getElementById("commandGroup"); // CommandGroupに一意のIDを割り当てる
      if (commandEl && !commandEl.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const newTask = await axios.patch("/tasks", { ...values, userId, ...data });
      console.log(newTask);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[80%] max-w-4xl mx-auto my-30 p-6 bg-white rounded shadow-lg">
          <DialogHeader>
            <div className="flex items-center">
              <DialogTitle className="text-5xl font-semibold">{task?.title}</DialogTitle>
              <Button
                className="ms-7"
                onClick={() => setIsEdit((prev) => !prev)}
              >
                編集
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="h-5/6">
            {isEdit ? (
              <div>
                <div className="mt-4">
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
                                    <RadioGroupItem value="HIGH" id="label1" />
                                    <Label htmlFor="label1">高め</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="MEDIUM" id="label2" />
                                    <Label htmlFor="label2">通常</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="LOW" id="label3" />
                                    <Label htmlFor="label3">低め</Label>
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
                              <FormLabel className="text-base font-bold text-black">ユーザー</FormLabel>
                              <FormMessage />
                              <FormControl>
                                <Command className="overflow-visible bg-transparent">
                                  <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                    <div className="flex gap-1 flex-wrap">
                                      {fields.length
                                        ? fields.map((
                                          field: Record<string, any>,
                                          index: number,
                                        ) => (
                                          <Badge key={field.id} className="bg-indigo-500">
                                            <button
                                              type="button"
                                              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                              onClick={() => handleUnselectUser(index)}
                                            >
                                              <div className="flex items-center">
                                                <Avatar className="w-5 h-5">
                                                  <AvatarImage src={field?.user ? field?.user?.imageUrl : ""} />
                                                  <AvatarFallback>C</AvatarFallback>
                                                </Avatar>
                                                <div className="text-sm ms-3">{field?.user ? field?.user?.name : ""}</div>
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground text-black" />
                                              </div>
                                            </button>
                                          </Badge>
                                        )) : (
                                          <div className="text-slate-500">
                                            ユーザーを選択してください
                                          </div>
                                        )}
                                    </div>
                                    <div
                                      className="relative mt-2"
                                      id="commandGroup"
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
                                  key={userData?.user ? userData?.user?.userId : ""}
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
                                      <AvatarImage src={userData?.user?.imageUrl ? userData?.user?.imageUrl : ""} />
                                      <AvatarFallback>N</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm ms-3">
                                      {userData?.user?.name ? userData?.user?.name : ""}
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
                              <FormLabel className="text-base font-bold text-black">期日</FormLabel>
                              <FormMessage />
                              <FormControl>
                                <Calendar
                                  selected={new Date(field.value)}
                                  onDayClick={field.onChange}
                                  mode="single"
                                  disabled={(date:Date) => date <= new Date()}
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
                </div>
              </div>
            )
              : (
                <div>
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
                      <CalendarIcon className="me-2" />
                      <h3 className="text-xl font-semibold">期日</h3>
                    </div>
                    <p className="mt-2 text-gray-700">{formatDate(new Date(task?.dueDate || new Date()))}</p>
                  </div>
                  {/* 作成日 */}
                  <div className="mt-4">
                    <div className="flex items-center">
                      <CalendarIcon className="me-2" />
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
                </div>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>

  );
}
