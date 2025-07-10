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
  { path: "/", element: <HomePage /> },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Login /> }
]);

function App() {
  const dispatch = useDispatch();
  const { authUser } = useSelector(store => store.user);

  const [socket, setSocket] = useState(null); // ✅ Local state thay vì Redux

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Chỉ dispatch khi Redux chưa có hoặc sai user
      if (!authUser || authUser._id !== parsedUser._id) {
        dispatch(setAuthUsers(parsedUser));
      }
    };

    return () => {
      // Cleanup khi component unmount
    };
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      console.log("Client Socket Init - authUser._id:", authUser._id); // THÊM DÒNG NÀY
      
      // Tạo socket connection với timeout và retry logic
      const connectSocket = () => {
        const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
          query: { userId: authUser._id },
          withCredentials: true,
          timeout: 10000, // 10s timeout
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        // Connection events
        newSocket.on('connect', () => {
          setSocket(newSocket);
          dispatch(setSocketRedux(newSocket));
        });

        newSocket.on('connect_error', (error) => {
          console.error('[SOCKET] Connect error:', error);
          console.error("🔴 Socket connection error:", error);
        });

        newSocket.on('disconnect', (reason) => {
          console.log('[SOCKET] Disconnected:', reason);
          console.log("🟡 Socket disconnected:", reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            newSocket.connect();
          }
        });

        newSocket.on('reconnect', (attemptNumber) => {
          console.log("🟢 Socket reconnected after", attemptNumber, "attempts");
        });

        newSocket.on('reconnect_error', (error) => {
          console.error("🔴 Socket reconnection error:", error);
        });

        // Business logic events
        newSocket.on('getOnLineUsers', (onLineUsers) => {
          dispatch(setOnLineUsers(onLineUsers));
        });

        return newSocket;
      };

      const newSocket = connectSocket();

      return () => {
        if (newSocket) {
          newSocket.removeAllListeners();
          newSocket.close();
        }
        setSocket(null);
        dispatch(setSocketRedux(null));
      };
    } else {
      if (socket) {
        socket.removeAllListeners();
        socket.close();
      }
      setSocket(null);
      dispatch(setSocketRedux(null));
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
