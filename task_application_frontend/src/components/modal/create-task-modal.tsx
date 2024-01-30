import { useAuth } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Command as CommandPrimitive } from "cmdk";
import { X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'src/hook/use-modal';
import axios from 'src/lib/axios';
import { z } from 'zod';
import { AvatarImage } from '../ui/avatar';
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
  users: z.array(z.string()).default([]),
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
  const [selected, setSelected] = useState<[string]>([]);
  const [inputValue, setInputValue] = useState("");

  data?.workSpace?.workSpace?.userWorkSpaces?.map(() => (
    console.log("test")
  ));

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

  // const handleUnselect = useCallback((framework: string) => {
  //   setSelected((prev) => prev.filter((s) => s !== framework));
  // }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected as [string];
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
                            {selected?.map((user:any) => (
                              <Badge key={user?.user?.id}>
                                <button
                                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  type="button"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleUnselect(user?.user?.id);
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() => handleUnselect(user?.user?.id)}
                                >
                                  <AvatarImage src={user?.user?.imageUrl} />
                                  {user?.user?.name}
                                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
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
                                user: any,
                              ) => (
                                <CommandItem
                                  key={user?.user?.name}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={() => {
                                    setInputValue("");
                                    setSelected((prev:string[]) => [...prev, user?.user?.id]);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {user?.user?.name}
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
