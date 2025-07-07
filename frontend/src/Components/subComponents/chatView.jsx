import {
    Laugh,
    Star,
    MoreVertical,
    Mic,
    Send,
    ArrowLeft,
    Square,
    X,
} from "lucide-react";
import { Dropdown, Button, Input, Menu, Form } from "antd";
import line from "../../assets/images/l1.png";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clearSelectedContact } from "../Redux/selectedContactSlice";
import { addOrRemoveFavouriteThunk } from "../Redux/favouriteSlice";
import { refreshTokenThunk } from "../Redux/authSlice";
import { formatTime } from "./toCamelStr";

export default function ChatView({
    messages,
    handleSendMessage,
    selectedContact,
    user,
    pathname
}) {
    const dispatch = useDispatch();
    const navlink = useNavigate();
    const messageWindowRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);
    const [chunks, setChunks] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const timerRef = useRef(null);
    const [form] = Form.useForm();
    const [inputValue, setInputValue] = useState("");

    const nannyShare = pathname.split("/")[1] == "family" && "Parents";

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setRecordingTime(0);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRecording]);

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                const base64Audio = await blobToBase64(audioBlob);
                handleSendMessage({
                    chatId: selectedContact?._id,
                    content: base64Audio,
                    senderId: user?._id,
                    receiverId: selectedContact?.otherParticipant._id,
                    type: "Audio",
                });
                setChunks(audioBlob);
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            setAudioURL(null);
            audioChunks.current = [];
        }
    };

    const handleEmojiClick = (emoji) => {
        setInputValue((prevValue) => prevValue + emoji.emoji);
        form.setFieldsValue({ msg: inputValue + emoji.emoji });
    };

    const onFinish = (values) => {
        const messageText = values.msg.trim();
        if (messageText) {
            handleSendMessage({
                chatId: selectedContact?._id,
                content: messageText,
                senderId: user?._id,
                receiverId: selectedContact?.otherParticipant._id,
                type: "Text",
            });
            setInputValue("");
            form.resetFields();
        }
    };

    const handleBackToContacts = () => {
        dispatch(clearSelectedContact());
    };

    const viewProfile = (id, type) => {
        if (type == "Nanny") {
            navlink(`/family/profileNanny/${id}`);
        } else {
            navlink(`/nanny/jobDescription/${id}`);
        }
    };

    const handleFavourite = async (id) => {
        await dispatch(addOrRemoveFavouriteThunk({ favouriteUserId: id }));
        await dispatch(refreshTokenThunk());
    };

    const formatTime1 = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    const menu = (id, type, chatId) => (
        <Menu>
            <Menu.Item onClick={() => viewProfile(id, type)} key="1">
                View Profile
            </Menu.Item>
        </Menu>
    );

    useLayoutEffect(() => {
        if (messageWindowRef.current) {
            messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
        }
    }, []);

    useLayoutEffect(() => {
        if (messageWindowRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageWindowRef.current;
            const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
            if (isNearBottom) {
                messageWindowRef.current.scrollTop = scrollHeight;
            }
        }
    }, [messages]);

    return (
        <div className="flex border-[1px] border-[#D6DDEB] bg-white flex-col w-full h-full Quicksand">
            <div className="flex justify-between items-center p-4 border-b w-full">
                <div className="flex items-center">
                    <ArrowLeft
                        className="w-5 h-5 cursor-pointer reponsive"
                        onClick={handleBackToContacts}
                    />
                    <div className="ml-2 w-10 h-10">
                        {selectedContact?.otherParticipant?.imageUrl ? (
                            <img
                                style={{ backgroundColor: "#38AEE3" }}
                                className="rounded-lg w-9 h-9 object-contain"
                                src={selectedContact?.otherParticipant?.imageUrl}
                                alt={selectedContact?.otherParticipant?.imageUrl}
                            />
                        ) : (
                            <Avatar
                                className="rounded-lg object-cover"
                                size="36"
                                color="#38AEE3"
                                name={
                                    selectedContact?.otherParticipant?.name
                                        ?.split(' ')
                                        .slice(0, 2)
                                        .join(' ')
                                }
                            />
                        )}
                    </div>
                    <span
                        style={{ color: "#636363" }}
                        className="ml-4 font-semibold text-sm"
                    >
                        {selectedContact?.otherParticipant?.name}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {(nannyShare != selectedContact?.otherParticipant?.type && pathname.split("/")[1] != 'nanny') && (
                        <Star
                            onClick={() =>
                                handleFavourite(selectedContact?.otherParticipant?._id)
                            }
                            className="w-5 h-5 cursor-pointer"
                            fill={
                                user.favourite?.includes(selectedContact?.otherParticipant?._id)
                                    ? `#38AEE3`
                                    : "white"
                            }
                            color="#38AEE3"
                        />
                    )}
                    {pathname.split("/")[1] != 'nanny' && (
                        <Dropdown
                            overlay={menu(
                                selectedContact?.otherParticipant?._id,
                                selectedContact?.otherParticipant?.type,
                                selectedContact?._id
                            )}
                            trigger={["click"]}
                            placement="bottomRight"
                        >
                            <Button type="text" icon={<MoreVertical className="w-5 h-5" />} />
                        </Dropdown>
                    )}
                </div>
            </div>
            <div
                ref={messageWindowRef}
                style={{ overflowY: "auto", height: "100%" }}
                className="flex-1 p-4"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message?.sender?._id == user?._id
                            ? "justify-end"
                            : "justify-start"
                            } mb-4`}
                    >
                        <div>
                            {message.type === "Audio" ? (
                                <div
                                    className={
                                        message?.sender?._id === user?._id
                                            ? "sender-audio-player"
                                            : "receviver-audio-player"
                                    }
                                >
                                    <audio controls controlsList="nodownload">
                                        <source
                                            src={`data:audio/mp3;base64,${message.content}`}
                                            type="audio/mp3"
                                        />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            ) : (
                                <div
                                    style={
                                        message?.sender?._id === user?._id
                                            ? {
                                                color: "white",
                                                backgroundColor: "#38AEE3",
                                                width: "303px",
                                                wordBreak: "break-all",
                                                borderTopLeftRadius: "24px",
                                                borderBottomLeftRadius: "24px",
                                                borderTopRightRadius: "30px",
                                            }
                                            : {
                                                backgroundColor: "#DCE6FF",
                                                width: "303px",
                                                borderTopLeftRadius: "30px",
                                                borderBottomRightRadius: "24px",
                                                wordBreak: "break-all",
                                                borderTopRightRadius: "24px",
                                                color: "#1A1A1B",
                                            }
                                    }
                                    className={`p-3 ${message?.sender?._id === user?._id
                                        ? "bg-primary text-primary-foreground Quicksand text-sm leading-5"
                                        : "leading-5 Quicksand"
                                        }`}
                                >
                                    {message.content}
                                </div>
                            )}

                            <div
                                className={`flex ${message?.sender?._id == user?._id
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >
                                <p style={{ color: "#AFB8CF" }} className="text-xs">
                                    {formatTime(message.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2 p-4 border-t">
                <Laugh
                    className="w-6 h-6 cursor-pointer"
                    fill="#38AEE3"
                    color="white"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <Form
                    form={form}
                    name="basic"
                    style={{
                        margin: 0,
                        padding: 0,
                        width: "100%",
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className="flex flex-grow items-center">
                        {isRecording ? (
                            <div
                                style={{ background: "#DCE6FF" }}
                                className="flex flex-grow items-center space-x-2 ml-2 p-2 rounded-md"
                            >
                                <div className="wave-container">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>
                                <span style={{ color: "#38AEE3" }} className="font-medium">
                                    Recording... {formatTime1(recordingTime)}
                                </span>
                            </div>
                        ) : (
                            <Form.Item
                                name="msg"
                                rules={[{ required: true, message: "" }]}
                                style={{ margin: 0, padding: 0, flex: 1 }}
                            >
                                <Input
                                    type="text"
                                    style={{ border: "none", boxShadow: "none", width: "100%" }}
                                    placeholder="Type a message..."
                                    prefix={
                                        <img className="object-contain" src={line} alt="line" />
                                    }
                                    value={inputValue}
                                    className="flex-1"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                            </Form.Item>
                        )}

                        {!isRecording && (
                            <Form.Item style={{ margin: 0, padding: 0 }}>
                                <Button
                                    style={{ border: "none" }}
                                    className="msg-inp-btn"
                                    htmlType="submit"
                                >
                                    <Send className="w-5 h-5 cursor-pointer" color="#38AEE3" />
                                </Button>
                            </Form.Item>
                        )}
                    </div>
                </Form>
                {isRecording ? (
                    <>
                        <div
                            style={{ color: "red" }}
                            className="border-none cursor-pointer"
                            onClick={cancelRecording}
                        >
                            <X className="w-5 h-5" />
                            <span className="sr-only">Cancel recording</span>
                        </div>
                        <div
                            style={{ color: "#38AEE3" }}
                            className="border-none cursor-pointer"
                            size="icon"
                            onClick={stopRecording}
                        >
                            <Square className="mr-2 w-5 h-5" />
                            <span className="sr-only">Stop recording</span>
                        </div>
                    </>
                ) : (
                    <div
                        style={{ color: "#38AEE3" }}
                        className="border-none cursor-pointer"
                        size="icon"
                        onClick={startRecording}
                    >
                        <Mic className="mr-2 w-5 h-5" />
                        <span className="sr-only">Start recording</span>
                    </div>
                )}
            </div>
            {showEmojiPicker && (
                <div className="flex justify-center mx-4 my-2">
                    <div className="shadow-lg rounded-lg w-full">
                        <EmojiPicker
                            width="100%"
                            searchDisabled={true}
                            onEmojiClick={handleEmojiClick}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}