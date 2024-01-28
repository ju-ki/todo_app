import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "src/lib/axios";

export default function InviteComp() {
  const { inviteCode } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    async function inviteProcess() {
      try {
        const response = await axios.patch(`/workspaces/invite/${inviteCode}`, {
          userId,
        });
        navigate(`/workspace/${response.data.workSpace.id}`);
      } catch (err: any) {
        if (err.response.status === 422) {
          navigate("/");
        }
      }
    }
    if (userId) {
      inviteProcess();
    }
  }, [userId]);
  return (
    <div />
  );
}
