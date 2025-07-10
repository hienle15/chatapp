// App.jsx
import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUsers, setOnLineUsers } from './redux/userSlice';
import io from "socket.io-client";
import { SocketContext } from './context/SocketContext'; // ✅ Import context
import { setSocket } from './redux/socketSlice'; // nhớ import!
import { setSocket as setSocketRedux } from './redux/socketSlice';

import useGetRealTimeMessage from './components/hooks/useGetRealTimeMessage';
const router = createBrowserRouter([
 {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Login /> }
]);

function App() {
  const dispatch = useDispatch();
  const { authUser } = useSelector(store => store.user);

  const [socket, setSocket] = useState(null); // ✅ Local state thay vì Redux

  useEffect(() => {
    // const syncAuthUser = () => {
    //   const storedUser = localStorage.getItem("authUser");
    //   if (storedUser) {
    //     const parsedUser = JSON.parse(storedUser);
    //     // Chỉ dispatch khi Redux chưa có hoặc sai user
    //     if (!authUser || authUser._id !== parsedUser._id) {
    //       dispatch(setAuthUsers(parsedUser));
    //     }
    //   }
    // useGetRealTimeMessage();
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Chỉ dispatch khi Redux chưa có hoặc sai user
      if (!authUser || authUser._id !== parsedUser._id) {
        dispatch(setAuthUsers(parsedUser));
      }
    };

    // window.addEventListener("focus", syncAuthUser);     // Khi tab được focus
    // window.addEventListener("storage", syncAuthUser);   // Khi localStorage thay đổi từ tab khác
    // syncAuthUser(); // Chạy lần đầu

    return () => {
      // window.removeEventListener("focus", syncAuthUser);
      // window.removeEventListener("storage", syncAuthUser);
    };
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      console.log("Client Socket Init - authUser._id:", authUser._id); // THÊM DÒNG NÀY
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        query: { userId: authUser._id },
        withCredentials: true,
      });
      setSocket(newSocket);
      dispatch(setSocketRedux(newSocket))
      newSocket.on('getOnLineUsers', (onLineUsers) => {
        console.log("🟢 [SOCKET] Online users from server:", onLineUsers); // ✅
        dispatch(setOnLineUsers(onLineUsers));
      });

      return () => newSocket.close();
    } else {
      if (socket) socket.close();
      setSocket(null);

      // dispatch(setSocket(null))
    }
  }, [authUser]);

  // useGetRealTimeMessage();

  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
