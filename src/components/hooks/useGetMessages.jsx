import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../../redux/messageSlice';
const useGetMessages = () => {
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMessages = async () => {
            const userId = selectedUser?.id;
            // Xóa tin nhắn cũ ngay khi selectedUser thay đổi
            dispatch(setMessages([])); // ✅ THÊM DÒNG NÀY
            if (!userId) {
                console.warn("selectedUser chưa tồn tại hoặc không có id");
                return;
            }

            try {
                axios.defaults.withCredentials = true;

                const baseURL = import.meta.env.VITE_API_BASE_URL;
                const apiVersion = import.meta.env.VITE_API_VERSION;
                const fetchURL = `${baseURL}${apiVersion}/message/${userId}`;

                const res = await axios.get(fetchURL);
                console.log(res.data);
                dispatch(setMessages(res.data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
    }, [selectedUser, dispatch]);
};

export default useGetMessages;
