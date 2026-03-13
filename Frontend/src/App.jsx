import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AnimatedLogo from "./components/AnimatedLogo";
import Home from "./pages/Home";
import register from "./pages/register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Search from "./pages/Search";
import Admin from "./pages/Admin";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnimatedLogo size="small" />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;

