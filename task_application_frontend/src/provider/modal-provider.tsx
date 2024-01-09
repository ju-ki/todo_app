import { useEffect, useState } from "react";
import CreateWorkSpaceModal from "src/components/modal/create-workspace-modal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <CreateWorkSpaceModal />
  );
}