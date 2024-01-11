import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from 'src/components/common/Footer';
import Header from 'src/components/common/Header';

export default function WorkSpace() {
  const [isMounted, setIsMounted] = useState(false);
  const { workspaceId } = useParams();

  useEffect(() => {
    setIsMounted(true);
    console.log(`id:${workspaceId}`);
  }, [workspaceId]);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        WorkSpace
      </div>
      <Footer />
    </div>
  );
}
