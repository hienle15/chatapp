import { Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import Message from './Message';
import useGetMessages from './hooks/useGetMessages';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setMessages } from '../redux/messageSlice';
import { IoSend } from 'react-icons/io5';
import { setSelectedUser } from '../redux/userSlice';
import useGetRealTimeMessage from './hooks/useGetRealTimeMessage';

const MessageContainer = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser, authUser, onLineUsers } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);
    console.log("🧠 onLineUsers:", onLineUsers);
    const isOnLine = selectedUser?.id &&
        Array.isArray(onLineUsers) &&
        onLineUsers.map(onlineUser => String(onlineUser._id)).includes(String(selectedUser.id));
    useGetRealTimeMessage();
    useGetMessages();
    console.log("DEBUG:", {
        selectedUser: selectedUser?._id,
        onLineUsers,
        isOnLine
    });

    useEffect(() => {
        return () => dispatch(setSelectedUser(null));
    }, []);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const apiVersion = import.meta.env.VITE_API_VERSION;
            const sendURL = `${baseURL}${apiVersion}/message/send/${selectedUser.id}`;

            const res = await axios.post(
                sendURL,
                { message },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

          dispatch(setMessages(
  Array.isArray(messages)
    ? [...messages, res?.data?.newMessage]
    : [res?.data?.newMessage]
));
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }

        setMessage("");
    };

    if (!selectedUser) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white shadow-lg border border-gray-200">
                <h1 className='text-blue-600 text-3xl font-semibold'>
                    Hi, {authUser ? authUser.name : 'Guest'}
                </h1>
                <h1 className='text-blue-600 text-3xl font-semibold'>Let's chat with me</h1>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col justify-between bg-white shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b bg-gradient-to-r from-white via-gray-50 to-white">
                <div className="relative group">
                    <Avatar
                        src={selectedUser?.photo}
                        size={52}
                        className="border border-gray-300 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    {isOnLine && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-md animate-pulse" />
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold text-gray-900 text-[16px] tracking-tight">{selectedUser?.name}</div>
                    {isOnLine && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
                        </span>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-white space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
                {/* {messages?.map((msg) => (
                    <Message key={msg._id || msg.id} message={msg} />
                ))} */}
                {Array.isArray(messages) &&
                    messages.map((msg) => (
                        <Message key={msg._id || msg.id} message={msg} />
                    ))}
            </div>

            {/* Input chat */}
            <form
                onSubmit={onSubmitHandler}
                className="flex items-center gap-3 px-4 py-3 border-t bg-white backdrop-blur-md"
            >
                <div className="flex-1 relative">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Type your message..."
                        className="w-full bg-gray-100 rounded-2xl border border-gray-300 px-5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all placeholder:text-gray-400"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full p-2.5 shadow-md transition-all duration-200 active:scale-95"
                >
                    <IoSend className="text-xl text-white" />
                </button>
            </form>
        </div>
    );
};

export default MessageContainer;
