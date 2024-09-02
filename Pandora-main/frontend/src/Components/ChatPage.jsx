import ChatBox from "./ChatPage/ChatBox";

const ChatPage = ({ chatting }) => {
    return (
        <div className="flex flex-col items-center bg-gray-100 w-full p-6 overflow-y-auto">
            <ChatBox chatting={chatting} />
        </div>
    );
};

export default ChatPage;
