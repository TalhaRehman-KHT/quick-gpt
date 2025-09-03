import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../Context/AppContext.jsx';
import { assets } from '../assets/assets';
import Message from './Message.jsx';
import toast from 'react-hot-toast';

export default function Chatbox() {
    const containerRef = useRef(null);

    const { selectChat, theme, user, axios, token, setUser } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [prompt, setPrompt] = useState(""); // default empty string
    const [mode, setMode] = useState("text");
    const [isPublished, setIsPublished] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user) return toast.error("Login to send message");
            if (!selectChat?._id) return toast.error("No active chat found");

            setLoading(true);
            const promptCopy = prompt.trim();
            if (!promptCopy) return;

            setPrompt("");
            // instantly show user message
            setMessages(prev => [
                ...prev,
                { role: 'user', content: promptCopy, timestamp: Date.now(), isImage: false }
            ]);

            const { data } = await axios.post(
                `/api/message/${mode}`,
                { chatId: selectChat._id, prompt: promptCopy, isPublished },
                { headers: { Authorization: token } }
            );

            if (data.success || data.succeess) {  // handle both spellings
                setMessages(prev => [...prev, data.reply]);

                // update credits locally
                setUser(prev =>
                    prev ? { ...prev, credits: prev.credits - (mode === "image" ? 2 : 1) } : prev
                );
            } else {
                toast.error(data.message);
                setPrompt(promptCopy);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMessages(Array.isArray(selectChat?.message) ? selectChat.message : []);
    }, [selectChat]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth", // ✅ fixed spelling
            });
        }
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:m-30 max-md:mt-14 2xl:pr-40">

            {/* Chat Messages */}
            <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
                {messages.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
                        <img
                            src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark}
                            className="w-full max-w-56 sm:max-w-68"
                            alt="logo"
                        />
                        <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
                            ask me anything
                        </p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}

                {loading && (
                    <div className="loader flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:-.2s]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce [animation-delay:-.4s]"></div>
                    </div>
                )}
            </div>

            {mode === "image" && (
                <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
                    <p className="text-xs">Publish Generated Image to Community</p>
                    <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                    />
                </label>
            )}

            {/* Prompt input */}
            <form
                onSubmit={onSubmit}
                className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
            >
                <select
                    onChange={(e) => setMode(e.target.value)}
                    value={mode}
                    className="text-sm pl-3 pr-2 outline-none"
                >
                    <option value="text" className="dark:bg-purple-900">Text</option>
                    <option value="image" className="dark:bg-purple-900">Image</option>
                </select>

                <input
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    type="text"
                    placeholder="type your prompt ..."
                    className="flex-1 w-full text-sm outline-none"
                    required
                />

                <button type="submit" disabled={loading}>
                    <img
                        src={loading ? assets.stop_icon : assets.send_icon}
                        alt=""
                        className="w-8 cursor-pointer"
                    />
                </button>
            </form>
        </div>
    );
}
