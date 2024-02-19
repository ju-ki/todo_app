import { useEffect, useState } from "react";
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
    <MembersModal />
  );
}
