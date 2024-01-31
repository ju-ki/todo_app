import { useAuth } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Command as CommandPrimitive } from "cmdk";
import { X } from 'lucide-react';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useForm } from 'react-hook-form';
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
  users: z.array(z.string()).nonempty("ユーザーは最低でも一人は必要です"),
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, any>[]>([]);
  const [inputValue, setInputValue] = useState("");

  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      title: "",
      description: "",
      users: [],
      status: "TODO",
      label: "OPTIONAL",
      dueDate: new Date(),
    },
  });

  const { watch, setValue } = form;

  // selected配列を監視し、変更があるたびにフォームのusersフィールドを更新
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'users' && selected.length > 0) {
      // user.userIdがstring型であることを確認または型アサーションを使用
        const userIds = selected.map((user: Record<string, any>) => user.userId as string);
        setValue('users', userIds);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, selected]);

  // デフォルトでログインユーザーをタスクAssignmentに指定する
  useEffect(() => {
    if (isModalOpen && data && userId) {
      const myUserObject = data?.workSpace?.workSpace?.userWorkSpaces?.filter(
        (user: Record<string, any>) => user?.user?.userId === userId,
      );

      setSelected([myUserObject[0].user]);
    }
  }, [isModalOpen, data, userId]);

  const onSubmit = async (values: any) => {
    console.log(values);

    const userIds = selected.map((user) => ({ userId: user.userId }));
    console.log(userIds);

    // userIdsをvalues.usersに設定
    const submissionValues = {
      ...values,
      users: userIds,
    };

    try {
      await axios.post("/tasks", { ...submissionValues, userId, ...data });
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleUnselect = useCallback((framework: Record<string, any>) => {
    setSelected((prev: Record<string, any>[]) => prev.filter((
      s: Record<string, any>,
    ) => s !== framework));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev:Record<string, any>[]) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

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
                      <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
                        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <div className="flex gap-1 flex-wrap">
                            {selected?.map((user:Record<string, any>) => (
                              <Badge key={user?.userId} className="bg-indigo-500">
                                <button
                                  className=" ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  type="button"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleUnselect(user?.userId);
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() => handleUnselect(user?.userId)}
                                >
                                  <div className="flex items-center">
                                    <Avatar className="w-5 h-5">
                                      <AvatarImage src={user?.imageUrl} />
                                      <AvatarFallback>C</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm ms-3">
                                      {user?.name}
                                    </div>
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground text-black" />
                                  </div>
                                </button>
                              </Badge>
                            ))}
                            <CommandPrimitive.Input
                              ref={inputRef}
                              value={inputValue}
                              onValueChange={setInputValue}
                              onBlur={() => setOpen(false)}
                              onFocus={() => setOpen(true)}
                              placeholder="Select frameworks..."
                              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                            />
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
                                user: Record<string, any>,
                              ) => (
                                <CommandItem
                                  key={user?.user?.userId}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={() => {
                                    setInputValue("");
                                    setSelected((prev) => {
                                      // すでに追加されているユーザーは追加しない
                                      if (prev.some((p) => p.userId === user?.user?.userId)) {
                                        return prev;
                                      }
                                      return [...prev, user?.user];
                                    });
                                  }}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={user?.user?.imageUrl} />
                                      <AvatarFallback>N</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm ms-3">
                                      {user?.user?.name}
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
