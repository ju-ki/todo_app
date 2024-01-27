import { MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from 'src/hook/use-modal';
import axios from 'src/lib/axios';
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type AuthorityProps = {
  userId: string | undefined | null,
  user:Record<string, any>,
  workSpaceId:string | undefined | null
};

export default function AuthorityDropdown({
  userId,
  user,
  workSpaceId,
}:
AuthorityProps) {
  const { onOpen } = useModal();
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    if (user) {
      setUserRole(user.role.toLowerCase());
    }
  }, [user]);

  const onChangeAuthority = async (authority:string) => {
    try {
      const response = await axios.patch("/users/authority", {
        userId,
        workSpaceId,
        targetUserId: user.user.userId,
        targetAuthority: authority,
      });
      // モーダルを再度開く
      onOpen("members", { workSpace: response.data.workSpace });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={userRole}
          onValueChange={setUserRole}
        >
          <DropdownMenuRadioItem value="admin" onClick={() => onChangeAuthority("ADMIN")}>管理者</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="moderator" onClick={() => onChangeAuthority("MODERATOR")}>仲裁者</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="guest" onClick={() => onChangeAuthority("GUEST")}>一般</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
