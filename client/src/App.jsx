import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./assets/prism.css"
import Sidebar from "./Components/Sidebar.jsx";
import Chatbox from "./Components/Chatbox.jsx";
import Credits from "./Pages/Credits.jsx";
import Community from "./Pages/Community.jsx";
import { useState } from "react";
import { assets } from "./assets/assets.js";
import Loading from "./Pages/Loading.jsx";
import Login from "./Pages/Login.jsx";
import { useAppContext } from "./Context/AppContext.jsx";
import { Toaster } from 'react-hot-toast'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const { user, loadingUser } = useAppContext();

  if (pathname == "/loading" || loadingUser) return <Loading />

  return (
    <>
      <Toaster />
      {/* Mobile hamburger (only show if sidebar is closed) */}
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          alt="menu"
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-30"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />

            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}

    </>
  );
}

export default App;
