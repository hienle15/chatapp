import React from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
    const { authUser } = useSelector(store => store.user);
    const isOwnMessage = message.senderId === authUser._id;

    // Kiểm tra trạng thái message
    const isOptimistic = message.isOptimistic;
    const isError = message.isError;

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                } ${isOptimistic ? 'opacity-70' : ''} ${isError ? 'bg-red-500 text-white' : ''}`}
            >
                <div className="flex items-center gap-2">
                    <p className="text-sm break-words">{message.message}</p>
                    {isOptimistic && (
                        <span className="text-xs opacity-70">⏳</span>
                    )}
                    {isError && (
                        <span className="text-xs">❌</span>
                    )}
                </div>
                {message.createdAt && (
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Message;
