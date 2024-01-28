import { useAuth } from '@clerk/clerk-react';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from 'src/hook/use-modal';
import { useOrigin } from 'src/hook/use-origin';
import axios from 'src/lib/axios';
import { AvatarImage, Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import AuthorityDropdown from '../workspace/authority-dropdown';

export default function MembersModal() {
  const { userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const origin = useOrigin();
  const {
    isOpen, onClose, type, data,
  } = useModal();
  const [inviteCode, setInviteCode] = useState("");
  const isModalOpen = isOpen && type === "members";
  const inviteUrl = `${origin}/invite/${inviteCode}`;

  useEffect(() => {
    if (isOpen && isModalOpen) {
      const userInfo = data?.workSpace?.userWorkSpaces?.filter(
        (userWorkSpace: Record<string, any>) => (userWorkSpace.user.userId === userId),
      );
      setIsAdmin(userInfo[0]?.role === "ADMIN");
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      setInviteCode(data?.workSpace?.inviteCode);
    }
  }, [data]);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const handleClose = () => {
    onClose();
  };

  const onUpdateInviteCode = async () => {
    try {
      const response = await axios.patch('/workspaces/invite', {
        userId,
        workSpaceId: data?.workSpace?.id,

      });
      setInviteCode(response.data.newWorkSpace.inviteCode);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              メンバー一覧
              {' '}
              <span>
                {data?.workSpace?.userWorkSpaces
                  ? Object.keys(data?.workSpace?.userWorkSpaces)?.length
                  : 0}
                人
              </span>
            </DialogTitle>
          </DialogHeader>
          {data?.workSpace?.userWorkSpaces?.map((user: Record<string, any>) => (
            <div key={user?.user?.userId} className="flex items-center justify-between space-x-4 p-4 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <Avatar className="bg-gray-200 rounded-full overflow-hidden w-10 h-10">
                  <AvatarImage src={user?.user?.imageUrl} alt="profile image" className="w-full h-full object-cover" />
                  <AvatarFallback className="flex justify-center items-center text-sm">CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ms-5">
                  <div className="text-sm font-medium text-gray-900">{user?.user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.role}</div>
                </div>
              </div>
              <div>
                {(user?.user?.userId !== userId && isAdmin) && (
                  <AuthorityDropdown
                    userId={userId}
                    user={user}
                    workSpaceId={data?.workSpace?.id}
                  />
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={false}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                            focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button
              disabled={false}
              size="icon"
              onClick={onCopy}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={onUpdateInviteCode}
            disabled={false}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCcw
              className="w-4 h-4 ml-2"
            />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
