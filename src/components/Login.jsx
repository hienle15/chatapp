import React, { useState } from 'react';
import { Input, Form, Button, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUsers } from '../redux/userSlice';

const { Password } = Input;

const Login = () => {
    const [user, setUser] = useState({
        name: "",
        password: "",
    });
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const openNotification = (type, message, description) => {
        api[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    const onSubmitHandle = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const apiVersion = import.meta.env.VITE_API_VERSION;
            const loginURL = `${baseURL}${apiVersion}/users/login`;

            const res = await axios.post(loginURL, user, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                openNotification('success', 'Success', res.data.message);
                dispatch(setAuthUsers({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    photo: res.data.photo
                }));
                localStorage.setItem("authUser", JSON.stringify({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    photo: res.data.photo
                }));
                // console.log("res.data after login:", res.data);

                setTimeout(() => {
                    navigate("/");
                }, 1500); // ⏳ Đợi 1.5 giây cho notification hiện
            } else {
                openNotification('error', 'Error', res.data.message);
            }
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            const errMsg = error.response?.data?.message;
            openNotification('error', 'Error', errMsg);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
            {/* //px-4 */}
            {contextHolder}
            <div className="w-full sm:w-[70%] md:w-[50%] lg:w-[30%] xl:w-[20%] bg-gradient-to-r from-blue-400 to-blue-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex flex-col p-6 mt-4">
                    <h1 className='text-4xl sm:text-3xl lg:text-4xl font-extrabold text-white '>Hello!</h1>
                    <h1 className='text-4xl sm:text-3xl lg:text-4xl font-extrabold text-white'>Sign In</h1>
                </div>

                {/* Form */}
                <div className="bg-white px-6 py-8 rounded-t-4xl">
                    <Form layout="vertical">
                        <Form.Item
                            label={<span className='text-blue-500 font-bold text-sm'>Name</span>}
                            name="name"
                        >
                            <Input
                                required
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                placeholder="Enter name"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className='text-blue-500  font-bold text-sm'>Password</span>}
                            name="password"
                        >
                            <Password
                                required
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                placeholder="Enter Password"
                            />
                        </Form.Item>

                        <p className='text-right mt-2 text-black text-sm sm:text-base'>
                            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Signup</Link>
                        </p>

                        <Form.Item className='text-center '>
                            <Button type="primary" className="w-full mt-4 hover:to-blue-900 transition-all duration-300" onClick={onSubmitHandle}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;