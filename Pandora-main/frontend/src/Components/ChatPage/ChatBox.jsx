import ChatInput from "./ChatInput";
import { useAuthContext } from "../../utils/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMessageContext } from "../../utils/messageContext";

const ChatBox = ({ chatting }) => {
    const { authUser } = useAuthContext();
    const { messages, setMessages } = useMessageContext();
    useEffect(() => {
        const getMessages = async () => {
            const { data } = await axios.get(
                `http://localhost:3001/api/message/getMessages/${authUser.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "jwt-token"
                        )}`,
                    },
                }
            );
            setMessages(data.messages);
        };
        if (authUser) {
            getMessages();
        }
    }, [authUser]);
    return (
        <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-evenly">
            <div className="w-5/6 ml-10 mt-12 mr-10 h-5/6 bg-white bg-opacity-5 rounded-2xl flex flex-col justify-center items-start text-white pl-10 overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-bubble break-words ${
                                index % 2 === 0
                                    ? "bg-gray-400 text-black"
                                    : "bg-black text-gray-400"
                            } m-2 p-3 rounded w-full`}
                        >
                            {message}
                        </div>
                    ))
                ) : (
                    <div className="chat-bubble bg-gray-800 m-2 p-3 rounded w-full">
                        <p className="font-bold">Welcome to Pandora!</p>
                        <p>
                            We’re thrilled to have you here. At Pandora, our
                            mission is to provide you with the best support and
                            resources for your mental health and well-being. Our
                            platform combines advanced technology with
                            empathetic support to help you navigate your
                            emotional journey. Whether you’re looking for
                            personalized advice, educational resources, or just
                            a safe space to express yourself, we’re here to
                            assist you every step of the way. Let’s work
                            together towards a healthier, happier you.
                        </p>
                        <p>
                            Feel free to explore our features and reach out
                            whenever you need. We’re here for you 24/7.
                        </p>
                        <p className="italic">- The Pandora Team</p>
                    </div>
                )}
            </div>
            <ChatInput chatting={chatting} />
        </div>
    );
};

export default ChatBox;
