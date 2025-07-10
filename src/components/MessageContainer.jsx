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
    const [isSending, setIsSending] = useState(false);
    const dispatch = useDispatch();
    const { selectedUser, authUser, onLineUsers } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);
    const { socket } = useSelector(store => store.socket);
    
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
        if (!message.trim() || isSending) return;

        const messageText = message.trim();
        setMessage("");
        setIsSending(true);

        // Optimistic update - thêm message ngay lập tức
        const optimisticMessage = {
            _id: `temp_${Date.now()}`,
            message: messageText,
            senderId: authUser._id,
            receiverId: selectedUser.id,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
            // Thêm timestamp để dễ track
            optimisticTimestamp: Date.now()
        };

        dispatch(setMessages([...messages, optimisticMessage]));

        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const apiVersion = import.meta.env.VITE_API_VERSION;
            const sendURL = `${baseURL}${apiVersion}/message/send/${selectedUser.id}`;

            const res = await axios.post(
                sendURL,
                { message: messageText },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            // Không cần cập nhật message ở đây nữa vì socket sẽ handle
            // Chỉ emit socket event để thông báo cho user khác
            if (socket) {
                socket.emit('sendMessage', {
                    message: messageText,
                    receiverId: selectedUser.id,
                    senderId: authUser._id
                });
            }

        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            
            // Xóa optimistic message nếu gửi thất bại
            const filteredMessages = messages.filter(msg => msg._id !== optimisticMessage._id);
            dispatch(setMessages(filteredMessages));
            
            // Khôi phục message về input
            setMessage(messageText);
        } finally {
            setIsSending(false);
        }
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
                {Array.isArray(messages) &&
                    messages.map((msg) => (
                        <Message key={msg._id || msg.id || msg.timestamp} message={msg} />
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
                        disabled={isSending}
                        className="w-full bg-gray-100 rounded-2xl border border-gray-300 px-5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all placeholder:text-gray-400 disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSending || !message.trim()}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full p-2.5 shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IoSend className="text-xl text-white" />
                </button>
            </form>
        </div>
    );
};

export default MessageContainer;
