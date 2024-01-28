import { useEffect, useState } from "react";
import CreateTaskModal from "src/components/modal/create-task-modal";
import CreateWorkSpaceModal from "src/components/modal/create-workspace-modal";
import MembersModal from "src/components/modal/members-modal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateWorkSpaceModal />
      <MembersModal />
      <CreateTaskModal />
    </>
  );
}
