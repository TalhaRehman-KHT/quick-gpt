import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectChat, setSelectChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [loadingUser, setLoadingUser] = useState(true);


    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data', { headers: { Authorization: token } });
            if (data.success) {
                setUser(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoadingUser(false);
        }
    };

    const creatNewChat = async () => {
        try {
            if (!user) return toast.error("Login To Create New Chat");
            navigate('/');

            await axios.post(
                '/api/chat/create',
                {},
                { headers: { Authorization: token } }
            );

            await fetchUserChats();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const fetchUserChats = async () => {
        try {
            const { data } = await axios.get('/api/chat/get', { headers: { Authorization: token } });

            if (data.success) {
                setChats(data.chats);

                if (data.chats.length === 0) {
                    await creatNewChat();
                    return fetchUserChats();
                } else {
                    setSelectChat(data.chats[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserChats();
        } else {
            setChats([]);
            setSelectChat(null);
        }
    }, [user]);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setUser(null)
            setLoadingUser(false)
        }
    }, [token]);

    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectChat,
        setSelectChat,
        theme,
        setTheme,
        creatNewChat,
        loadingUser,
        fetchUserChats,
        token,
        setToken,
        axios,
        fetchUser
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
