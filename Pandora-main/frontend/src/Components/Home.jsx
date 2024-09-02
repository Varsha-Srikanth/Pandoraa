import { useState } from "react";
import ChatPage from "./ChatPage";
import SideBar from "./SideBar";

const Home = () => {
    const [chatting, setChatting] = useState(false);
    return (
        <div className="flex h-screen">
            <SideBar setChatting={setChatting} />
            <ChatPage chatting={chatting} />
        </div>
    );
};

export default Home;
