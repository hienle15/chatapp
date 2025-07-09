import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
             console.log("📥 New message received in realtime:", newMessage);
            dispatch(setMessages(prev => [...prev, newMessage])); // ✅ dùng prev để tránh dependency
        };

        socket.on("newMessage", handleNewMessage);
        console.log("📥 Socket on newMessage triggered", newMessage);
        return () => {
            socket.off("newMessage", handleNewMessage); // cleanup để tránh double listener
        };
    }, [socket]);
    // useEffect(() =>{
    //     socket?.on("newMessage", (newMessage) =>{
    //         dispatch(setMessages([...messages, newMessage]));
    //     });
    // }, [socket, setMessages, messages]);
}
export default useGetRealTimeMessage;