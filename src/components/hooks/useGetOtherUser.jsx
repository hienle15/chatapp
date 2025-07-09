import React, { useEffect } from 'react'
import axios from "axios";
import {useDispatch } from "react-redux"
import { setOtherUsers } from '../../redux/userSlice';
const useGetOtherUser = () => {
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;

                const baseURL = import.meta.env.VITE_API_BASE_URL;
                const apiVersion = import.meta.env.VITE_API_VERSION;
                const fetchURL = `${baseURL}${apiVersion}/users/`;

                const res = await axios.get(fetchURL);

                // Store vào Redux
                dispatch(setOtherUsers(res.data));

            } catch (error) {
                console.log(error);

            }
        }
        fetchOtherUsers();
    }, [])
}

export default useGetOtherUser
