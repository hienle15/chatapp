import { Avatar } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    // 🛠 Log dữ liệu để kiểm tra
    // console.log("Log authUser:", authUser);
    // console.log("Message object:", message);

    // Sử dụng đúng key để so sánh
    const isSender = authUser?._id === message?.senderId;
    // console.log("sender:", isSender);
    
    // console.log("Redux user state:", useSelector(store => store.user));


    return (
        <div ref={scroll} className="w-full flex mb-3 px-2">
            {isSender ? (
                //  Tin nhắn của chính mình (phải)
                <div className="ml-auto flex items-end gap-2 max-w-[70%]">
                    <div className="flex flex-col items-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg break-words">
                            {message?.message}
                        </div>
                        <div className="text-xs text-right text-gray-500 mt-1">
                            {dayjs(message?.timestamp).format('h:mm A')}
                        </div>
                    </div>
                    <Avatar
                        src={authUser?.photo || `https://i.pravatar.cc/150?u=${authUser?._id}`}
                        size={36}
                    />
                </div>
            ) : (
                //  Tin nhắn của người khác (trái)
                <div className="mr-auto flex items-start gap-2 max-w-[70%]">
                    <Avatar
                        src={selectedUser?.photo || `https://i.pravatar.cc/150?u=${selectedUser?._id}`}
                        size={36}
                    />
                    <div className="flex flex-col items-start">
                        <div className="bg-gray-200 px-4 py-2 rounded-lg break-words">
                            {message?.message}
                        </div>
                        <div className="text-xs text-right text-gray-500 mt-1">
                               {dayjs(message?.timestamp).format('h:mm A')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Message;
