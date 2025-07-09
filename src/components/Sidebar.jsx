import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, notification } from 'antd';
import axios from 'axios';
import { HiOutlineSearch } from 'react-icons/hi';
import OtherUsers from './OtherUsers';
import { logout as logoutUser, setSelectedUser } from '../redux/userSlice'; // ✅ sửa đúng
import { resetMessages } from '../redux/messageSlice'; // ✅ reset tin nhắn

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    const { OtherUsers: allOtherUsers } = useSelector(store => store.user);
    const [search, setSearch] = useState("");

    const openNotification = (type, message, description) => {
        api[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    const logoutHandler = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const apiVersion = import.meta.env.VITE_API_VERSION;
            const loginURL = `${baseURL}${apiVersion}/users/logout`;

            const res = await axios.get(loginURL, {
               
                withCredentials: true
            });
            // const res = await axios.get("http://localhost:3000/api/v1/users/logout", {
            //     withCredentials: true
            // });

            if (res.data.success) {
                openNotification('success', 'Success', res.data.message);
                localStorage.removeItem("authUser");

                dispatch(logoutUser());        // ✅ reset toàn bộ user state
                dispatch(resetMessages());     // ✅ reset message state

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                openNotification('error', 'Error', res.data.message);
            }
        } catch (error) {
            console.error(error);
            openNotification('error', 'Error', 'Logout failed');
        }
    };

    const searchSubmitHandler = () => {
        const conversationUser = allOtherUsers?.find((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
        if (conversationUser) {
            dispatch(setSelectedUser(conversationUser));
            setSearch("");
        } else {
            openNotification('error', 'User not found');
        }
    };

    return (
        <div className="md:w-1/4 bg-white text-dark flex flex-col border-r border-gray-300">
            {contextHolder}
            {/* Search */}
            <div className="p-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        searchSubmitHandler();
                    }}
                    className="flex items-center bg-gray-200 px-3 py-2 rounded-xl"
                >
                    <button
                        type="button"
                        onClick={searchSubmitHandler}
                        className="text-gray-500 mr-2 text-lg hover:text-black"
                    >
                        <HiOutlineSearch />
                    </button>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="bg-transparent focus:outline-none text-black placeholder-gray-500 w-full text-sm"
                    />
                </form>
            </div>

            {/* Danh sách người dùng */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <OtherUsers />
            </div>

            {/* Logout */}
            <div className="mt-2 text-end p-2">
                <Button onClick={logoutHandler} type="primary">
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
