import { useAuth } from '@clerk/clerk-react';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import axios from 'src/lib/axios';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import NotificationCard from './NotificationCard';

type NotificationProps = {
  id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  task: Record<string, any>;
  userId: string;
};

function NotificationItem(
  {
    notifications,
    triggerRefresh,
  }:
  {
    notifications: NotificationProps[],
    triggerRefresh: () => void
  },
) {
  const { userId } = useAuth();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleOnOpenNotification = async () => {
    setIsOpenDropdown((prev) => !prev);
    if (!isOpenDropdown) {
      const unReadNotificationsId:Record<string, string>[] = [];
      notifications.forEach((notification:Record<string, any>) => {
        if (!notification.isRead) {
          unReadNotificationsId.push(notification.id);
        }
      });
      try {
        await axios.patch("/notifications", { userId, unReadNotificationsId });
      } catch (error) {
        console.log(error);
      }
    } else if (notifications.length) {
      triggerRefresh();
    }
  };
  return (
    <div>
      <DropdownMenu onOpenChange={handleOnOpenNotification}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Bell className="h-8 w-8 me-8 text-white" />
            {notifications.filter((notification) => !notification.isRead).length > 0 && (
            <div className="absolute end-4 -top-2 rounded-full bg-red-500 text-white text-xs px-2 py-1">
              {notifications.filter((notification) => !notification.isRead).length}
            </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96" side="bottom" sideOffset={3}>
          <DropdownMenuGroup>
            <ScrollArea className="h-96">
              {notifications.length > 0 ? notifications.map((notification) => (
                <div key={notification.id} className={`${notification.isRead ? 'bg-gray-100' : 'bg-white'}`}>
                  <DropdownMenuItem>
                    <div>
                      <NotificationCard {...notification} />
                    </div>
                  </DropdownMenuItem>
                  <Separator />
                </div>
              )) : (
                <div className="my-4 mx-4">
                  <p>通知は現在ありません</p>
                </div>
              )}
            </ScrollArea>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default NotificationItem;
