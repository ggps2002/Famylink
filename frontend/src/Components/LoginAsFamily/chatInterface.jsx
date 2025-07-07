import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Search,
  Star,
  Clock,
} from "lucide-react";
import { Button, Input, Menu } from "antd";
import s1 from "../../assets/images/s1.png";
import play from "../../assets/images/play.png";
import Record from "../../assets/images/Record.png";
import { deleteChatThunk, getChatsThunk } from "../Redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import useSocket from "../../Config/socket";
import { useChats } from "../../Config/useChat";
import { formatTime, timeAgo } from "../subComponents/toCamelStr";
import { useLocation, useNavigate } from "react-router-dom";
import { SwalFireDelete } from "../../swalFire";
import { fireToastMessage } from "../../toastContainer";
import {
  clearSelectedContact,
  setSelectedContact,
} from "../Redux/selectedContactSlice"; // Import the new component
import ChatView from "../subComponents/chatView";

export default function Component() {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { pathname } = useLocation();
  const selectedContact = useSelector(
    (state) => state.selectedContact.selectedContact
  );
  const { chatList, handleSendMessage, messages } = useChats({
    chatId: selectedContact?._id,
    data: selectedContact,
  });
  const { user } = useSelector((s) => s.auth);
  const navlink = useNavigate();
  const nannyShare = pathname.split("/")[1] == "family" && "Parents";

  useEffect(() => {
    const handleData = async () => {
      const { data, status } = await dispatch(getChatsThunk()).unwrap();
    };
    handleData();
  }, []);

  useEffect(() => {
    socket?.emit("leaveChat", { chatId: selectedContact?._id });
  }, [selectedContact]);

  const clearChat = (chatId) => {
    const handleDelete = async () => {
      try {
        const { status, data } = await dispatch(
          deleteChatThunk(chatId)
        ).unwrap();

        if (status == 200) {
          await dispatch(getChatsThunk()).unwrap();
          dispatch(clearSelectedContact);
          fireToastMessage({ type: "success", message: data.message });
        }
      } catch (err) {
        fireToastMessage({ type: "error", message: err });
      }
    };

    SwalFireDelete({ title: "Are you sure for clear this chat", handleDelete });
  };

  const ContactList = () => (
    <div className="flex border-[1px] border-[#D6DDEB] bg-white flex-col h-full Quicksand">
      <div className="flex border-[1px] border-[#D6DDEB] bg-white justify-between items-center px-4 py-6 border-b">
        <h1 className="font-semibold text-base">All messages</h1>
      </div>
      <div className="p-4 border-b">
        <Input
          style={{ border: "none", boxShadow: "none" }}
          type="text"
          placeholder="Search or start a new chat"
          className="w-full"
          prefix={<Search color="#38AEE3" className="w-3" />}
          onFocus={(e) => (e.target.style.boxShadow = "none")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
      </div>
      <div style={{ overflowY: "auto", height: "100%" }} className="flex-1">
        {chatList.map((contact) => (
          <div
            key={contact._id}
            className="flex hover:bg-accent p-4 border-b cursor-pointer"
            onClick={() => dispatch(setSelectedContact(contact))}
          >
            <div className="rounded-2xl w-12 h-12">
              {contact?.otherParticipant?.imageUrl ? (
                <img
                  style={{ backgroundColor: "#38AEE3" }}
                  className="rounded-lg w-9 h-9 object-contain"
                  src={contact?.otherParticipant?.imageUrl}
                  alt={contact?.otherParticipant?.name}
                />
              ) : (
                <Avatar
                  className="rounded-lg object-cover"
                  size="36"
                  color="#38AEE3"
                  name={
                    contact?.otherParticipant?.name
                      ?.split(' ')
                      .slice(0, 2)
                      .join(' ')
                  }
                />
              )}
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between items-center font-black Quicksand">
                {contact?.otherParticipant?.name}
                {(nannyShare != contact?.otherParticipant?.type && pathname.split("/")[1] != 'nanny') && (
                  <Star
                    fill={
                      user.favourite?.includes(contact?.otherParticipant?._id)
                        ? `#38AEE3`
                        : "white"
                    }
                    color="#38AEE3"
                    className="w-4"
                  />
                )}
              </div>
              <div
                style={{ color: "#636363" }}
                className="my-3 text-muted-foreground text-sm leading-4"
              >
                {contact.type == "Audio" ? (
                  <div className="flex gap-2">
                    <img src={play} alt="play" />
                    <img className="w-44" src={Record} alt="Record" />
                  </div>
                ) : contact?.lastMessage?.split(" ").length > 20 ? (
                  contact?.lastMessage?.split(" ").slice(0, 20).join(" ") +
                  "..."
                ) : (
                  contact?.lastMessage
                )}
              </div>

              <div
                style={{ color: "#9FA7BE" }}
                className="flex items-center gap-1 text-muted-foreground text-xs"
              >
                {contact?.lastMessage?.length > 0 && (
                  <>
                    <Clock className="w-4" />
                    {timeAgo(contact.updatedAt)} |{" "}
                    {formatTime(contact.updatedAt)}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{ border: "1px solid #AFB8CF" }}
      className="flex bg-background shadow-2xl h-screen Quicksand"
    >
      <div
        className={`w-full md:w-1/3 border-r ${selectedContact ? "hidden md:block" : "block"
          }`}
      >
        <ContactList />
      </div>
      <div className="md:block hidden w-2/3">
        {selectedContact ? (
          <ChatView
            messages={messages}
            handleSendMessage={handleSendMessage}
            selectedContact={selectedContact}
            user={user}
            pathname={pathname}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Select a contact to start chatting
          </div>
        )}
      </div>
      {selectedContact && (
        <div className="w-full reponsive">
          <ChatView
            messages={messages}
            handleSendMessage={handleSendMessage}
            selectedContact={selectedContact}
            user={user}
            pathname={pathname}
          />
        </div>
      )}
    </div>
  );
}