import React from 'react'
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onLineUsers } = useSelector(store => store.user);
    console.log("🧠 selectedUser:", selectedUser);
    console.log("🧠 onLineUsers in Redux:", onLineUsers);
    const isOnLine = onLineUsers.map(onlineUser => String(onlineUser._id)).includes(String(user.id));
    const selectedUserHandler = () => {
        console.log(user);
        dispatch(setSelectedUser(user));
    }

    return (
        <div
            onClick={selectedUserHandler}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-200
    ${selectedUser?._id === user?._id
                    ? 'font-semibold'
                    : 'hover:bg-blue-200 text-gray-800'}
  `}
        >
            {/* Avatar với online dot */}
            <div className={`relative ${isOnLine ? 'online' : ''} `}>
                <Avatar
                    src={user?.photo}
                    size={48}
                    className={`transition-all duration-200 shadow-sm ${selectedUser?._id === user?._id ? 'ring-2 ring-blue-400' : ''
                        }`}
                />
                {isOnLine && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                )}
            </div>

            {/* Tên người dùng */}
            <div className="truncate">
                <div className="text-sm truncate">{user?.name}</div>
            </div>
        </div>

    );
}

export default OtherUser;
