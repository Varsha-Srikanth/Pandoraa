import { useRef, useState } from "react";
import IconMic from "../../Icons/Mic";
import { useSocketContext } from "../../utils/socketContext";
import audioFilePath from "../../../temp/audioOutput.mp3";
import axios from "axios";
import { useAuthContext } from "../../utils/authContext";
import { useMessageContext } from "../../utils/messageContext";

const ChatInput = ({ chatting }) => {
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const { setMessages } = useMessageContext();
    const [recording, setRecording] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const mediaRecorderRef = useRef();
    const chunksRef = useRef([]);

    const play = (audioFilePath) => {
        new Audio(audioFilePath).play();
    };

    const handleKeyPress = async (event) => {
        if (event.key === "Enter") {
            try {
                const { data } = await axios.post(
                    "http://localhost:3001/api/message/getOutput",
                    { chatInput }
                );
                socket.emit(
                    "saveMessage",
                    chatInput,
                    data.output,
                    localStorage.getItem("jwt-token"),
                    authUser ? authUser.id : null,
                    (chatInput, chatOutput) => {
                        setMessages((prevMessage) => [
                            ...prevMessage,
                            chatInput,
                            chatOutput,
                        ]);
                    }
                );
                setChatInput("");
            } catch (error) {
                console.log(
                    `Error while getting output for this message ${error}`
                );
            }
        }
    };
    const handleMicClick = async () => {
        if (!recording) {
            console.log("Started recording");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.ondataavailable = (event) => {
                    chunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(chunksRef.current, {
                        type: "audio/webm",
                    });
                    chunksRef.current = [];
                    socket.emit("speechToText", audioBlob, (chatInput) => {
                        socket.emit("textToSpeech", chatInput, (chatOutput) => {
                            socket.emit(
                                "saveMessage",
                                chatInput,
                                chatOutput,
                                localStorage.getItem("jwt-token"),
                                authUser ? authUser.id : null,
                                (chatInput, chatOutput) => {
                                    setMessages((prevMessage) => [
                                        ...prevMessage,
                                        chatInput,
                                        chatOutput,
                                    ]);
                                }
                            );
                            play(audioFilePath);
                        });
                    });
                };
                mediaRecorder.start();
                setRecording(true);
            } catch (err) {
                console.error("Error accessing microphone", err);
            }
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
            console.log("Stopped recording");
        }
    };
    return (
        <>
            {chatting ? (
                <input
                    type="text"
                    placeholder="Chat With Us"
                    className=" bg-white rounded-2xl h-10 w-full mt-5 p-4 text-black"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={handleKeyPress}
                />
            ) : (
                <IconMic
                    className={
                        recording
                            ? "text-red-700 mt-5 cursor-pointer"
                            : "mt-5 cursor-pointer"
                    }
                    onClick={handleMicClick}
                />
            )}
        </>
    );
};

export default ChatInput;
