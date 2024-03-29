import {
  Route, Routes,
} from "react-router-dom";
import InvitePage from "./pages/InvitePage";
import TopPage from "./pages/TopPage";
import WorkSpace from "./pages/WorkSpace";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ModalProvider from "./provider/modal-provider";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/workspace/:workspaceId" element={<WorkSpace />} />
        <Route path="/invite/:inviteCode" element={<InvitePage />} />
      </Routes>
      <ModalProvider />
    </>
  );
}

export default App;
