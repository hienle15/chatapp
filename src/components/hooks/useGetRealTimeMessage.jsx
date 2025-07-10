import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";
import { addMessage } from '../../redux/messageSlice';
 
const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!socket) return;
 
        const handleNewMessage = (newMessage) => {
            dispatch(addMessage(newMessage));
        };
 
        socket.on("newMessage", handleNewMessage);
        
        // Thêm error handling
        const handleSocketError = (error) => {
            console.error("Socket error:", error);
        };
        
        socket.on("connect_error", handleSocketError);
        socket.on("error", handleSocketError);
        
        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("connect_error", handleSocketError);
            socket.off("error", handleSocketError);
        };
    }, [socket, dispatch, messages]);
}
export default useGetRealTimeMessage;