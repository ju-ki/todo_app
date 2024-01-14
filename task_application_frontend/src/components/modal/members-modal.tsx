import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useModal } from 'src/hook/use-modal';
import { useOrigin } from 'src/hook/use-origin';
import { AvatarImage, Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

export default function MembersModal() {
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const {
    isOpen, onClose, type, data,
  } = useModal();
  const isModalOpen = isOpen && type === "members";
  const inviteUrl = `${origin}/invite/${data?.workSpace?.inviteCode}`;

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

  return (
    <div>
      メンバー一覧
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
            <div key={user?.user?.userId} className="flex items-center space-x-4 p-4 bg-white border-b border-gray-200">
              <Avatar className="bg-gray-200 rounded-full overflow-hidden w-10 h-10">
                <AvatarImage src={user?.user?.imageUrl} alt="profile image" className="w-full h-full object-cover" />
                <AvatarFallback className="flex justify-center items-center text-sm">CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900">{user?.user?.name}</div>
                <div className="text-sm text-gray-500">{user?.role}</div>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
