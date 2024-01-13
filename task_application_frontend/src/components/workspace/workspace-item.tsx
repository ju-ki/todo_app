import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type WorkSpaceProps = {
  id: string,
  title: string
};

export default function WorkSpaceItem(
  { workspaces }: { workspaces: WorkSpaceProps[] },
) {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [selectedWorkSpace, setSelectedWorkSpace] = useState(workspaceId);
  useEffect(() => {
    setSelectedWorkSpace(workspaceId || "");
  }, [workspaceId]);

  const onChange = (id: string) => {
    navigate(`/workspace/${id}`);
  };
  return (
    <div>
      <Select onValueChange={onChange} value={selectedWorkSpace}>
        <SelectTrigger className="w-[280px] bg-white border border-gray-300 rounded-md shadow-sm">
          <SelectValue
            placeholder="ワークスペースを選択してください"
            className="py-2 px-4 text-gray-700 placeholder-gray-500"
          />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          <SelectGroup>
            <SelectLabel className="px-4 py-2 text-gray-700 font-semibold bg-gray-50 border-b border-gray-300">
              WorkSpace
            </SelectLabel>
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="hover:bg-gray-100">
                <SelectItem
                  value={workspace.id}
                  className="py-2 px-10 text-gray-700 hover:bg-gray-100"
                >
                  {workspace.title}
                </SelectItem>
              </div>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

  );
}
