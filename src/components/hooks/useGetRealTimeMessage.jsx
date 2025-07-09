import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";
 
const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!socket) return;
 
        const handleNewMessage = (newMessage) => {
            dispatch(setMessages(prev => prev ? [...prev, newMessage] : [newMessage]));
        };
 
        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, dispatch]);
}
export default useGetRealTimeMessage;