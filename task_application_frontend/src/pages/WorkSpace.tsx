import { useAuth } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from 'src/components/common/Footer';
import Header from 'src/components/common/Header';
import axios from 'src/lib/axios';

export default function WorkSpace() {
  // const [isMounted, setIsMounted] = useState(false);
  const { userId } = useAuth();
  const { workspaceId } = useParams();

  useEffect(() => {
    async function fetchWorkSpacesDetail() {
      try {
        console.log(workspaceId);
        console.log(userId);
        const response = await axios.get("/workspaces/details", {
          params: {
            userId,
            workSpaceId: workspaceId,
          },
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
    if (userId && workspaceId) {
      fetchWorkSpacesDetail();
    }
  }, [workspaceId]);

  // if (!isMounted) {
  //   return null;
  // }

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
