import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import {
  acceptReqThunk,
  cancelBookingThunk,
  completeReqThunk,
  reconsiderThunk,
  rejectedReqThunk,
  withDrawThunk,
} from "../../Redux/bookHireSlice";
import { fetchOtherReqThunk } from "../../Redux/fetchOtherReq";
import { fireToastMessage } from "../../../toastContainer";
import { useDispatch } from "react-redux";
import { SwalFireDelete, SwalFireSuccess } from "../../../swalFire";
import { fetchAccRequesterThunk } from "../../Redux/acceptedRequsterData";
import PayRevModel from "../../subComponents/modalPayment";
import { formatDate, timeAgo } from "../../subComponents/toCamelStr";
import { createChatThunk } from "../../Redux/chatSlice";
import { fetchCancelRequesterThunk } from "../../Redux/cancelRequsterData";
import useSocket from "../../../Config/socket";

export default function Content({
  img,
  name,
  time,
  start,
  exp,
  loc,
  upcoming,
  request,
  completed,
  cancelled,
  withdraw,
  child,
  dayTime,
  id,
  parentId,
  nannyId,
  type,
  bookingId,
  pay,
  createdAt,
  review,
  zipCode,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const AcceptReq = async () => {
    const handleConfirm = async () => {
      try {
        // Dispatch acceptReqThunk with bookingId
        const { status, data } = await dispatch(
          acceptReqThunk(bookingId)
        ).unwrap();

        if (status === 200) {
          fireToastMessage({ success: true, message: data.message });

          await new Promise(async (resolve) => {
            const updateContent = {
              bookingId,
              senderId: parentId,
              receiverId: nannyId,
              content: "Accept your request",
              type: "Booking",
            };
            socket?.emit(
              "sendNotification",
              { content: updateContent },
              resolve
            );
            await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap(); // Assuming resolve will be called after successful emit
          });
          // Fetch other requests after accepting
        }
      } catch (error) {
        await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
        fireToastMessage({ type: "error", message: error.message });
      }
    };
    SwalFireSuccess({
      title: `You have accepted ${name} Request`,
      handleConfirm,
    });
  };

  const Withdraw = async () => {
    const handleConfirm = async () => {
      try {
        // Dispatch acceptReqThunk with bookingId
        const { data } = await dispatch(withDrawThunk(bookingId)).unwrap();
        fireToastMessage({ success: true, message: data.message });
        // Fetch other requests after accepting
        await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
      } catch (error) {
        fireToastMessage({ type: "error", message: error.message });
      }
    };
    SwalFireSuccess({
      title: `Are you sure for withdraw ${name} Request`,
      handleConfirm,
    });
  };

  const ReConsider = async () => {
    const handleConfirm = async () => {
      try {
        // Dispatch acceptReqThunk with bookingId
        const { data } = await dispatch(reconsiderThunk(bookingId)).unwrap();
        fireToastMessage({ success: true, message: data.message });
        // Fetch other requests after accepting
        await dispatch(
          fetchCancelRequesterThunk({ limit: 8, page: 1 })
        ).unwrap();
      } catch (error) {
        fireToastMessage({ type: "error", message: error.message });
      }
    };
    SwalFireSuccess({
      title: `Are you sure for reconsider ${name} Request`,
      handleConfirm,
    });
  };

  const RejectReq = async () => {
    const handleDelete = async () => {
      try {
        // Dispatch rejectedReqThunk with bookingId
        const { status, data } = await dispatch(
          rejectedReqThunk(bookingId)
        ).unwrap();

        if (status === 200) {
          fireToastMessage({ success: true, message: data.message });
          await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
          await new Promise(async (resolve) => {
            const updateContent = {
              bookingId,
              senderId: parentId,
              receiverId: nannyId,
              content: "Reject your request",
              type: "Booking",
            };
            socket?.emit(
              "sendNotification",
              { content: updateContent },
              resolve
            );
            await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
            // Assuming resolve will be called after successful emit
          });
          // Fetch other requests after rejecting
          await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
        }
      } catch (error) {
        await dispatch(fetchOtherReqThunk({ limit: 8, page: 1 })).unwrap();
        fireToastMessage({ type: "error", message: error.message });
      }
    };
    SwalFireDelete({
      title: `Are you sure to rejeted ${name} Request`,
      handleDelete,
    });
  };

  const handleMessage = async () => {
    try {
      const participants = [parentId, nannyId];
      const { status } = await dispatch(
        createChatThunk({ participants })
      ).unwrap();
      if (status == 201 || status == 200) {
        type == "family"
          ? navigate(`/family/message/`)
          : navigate(`/nanny/message/`);
      }
    } catch (error) {
      fireToastMessage({ type: "error", message: error.message });
    }
  };
  return (
    <div
      className={`flex justify-between ${
        upcoming || withdraw ? "items-center" : "items-center"
      } border-2 mb-4 rounded-2xl padding-content`}
    >
      <div className="flex gap-2">
        <div>
          {img ? (
            <img
              className="content-img rounded-full object-cover"
              src={img}
              alt="img"
            />
          ) : (
            <Avatar
              className="content-img rounded-full text-black"
              color={"#38AEE3"}
              name={
                name
                  ?.split(" ") // Split by space
                  .slice(0, 2) // Take first 1–2 words
                  .join(" ") // Re-join them
              }
            />
          )}
        </div>
        <div>
          <p className="content-name font-bold">{name}</p>
          {type == "family" && time && <p className="content-font">{time}</p>}

          <div className="flex-wrap content-flex gap-2">
            {type == "family" && start && (
              <p className="content-font font-bold">
                Start: <span className="font-medium">{start}</span>
              </p>
            )}
            {type == "family" && exp && (
              <p className="content-font font-bold">
                Experience:{" "}
                <span className="font-medium">{exp} of experience</span>
              </p>
            )}
          </div>
          {type == "nanny" && child && (
            <p className="content-font font-bold">
              {child} <span className="font-medium">Children</span>
            </p>
          )}

          <p className="content-font font-bold">
            {zipCode && <span className="font-medium">Zip Code: {loc?.format_location} </span>}
            {upcoming && (
              <NavLink
                to={
                  type == "nanny"
                    ? `/nanny/jobDescription/${id}`
                    : `/family/profileNanny/${id}`
                }
                style={{ color: "#38AEE3" }}
                className="hover:opacity-70 font-medium underline duration-700 cursor-pointer ease-in-out"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                View Details
              </NavLink>
            )}
          </p>
        </div>
      </div>
      <div>
        {completed && (
          <div>
            <button
              onClick={handleMessage}
              style={{
                border: "1px solid #BFE3F3",
                color: "#38AEE3",
                background: "#BFE3F3",
              }}
              className="btn-content-btn1 hover:opacity-70 py-1 rounded-3xl duration-700 ... ease-in-out Quicksand"
            >
              Message
            </button>
          </div>
        )}
        {request && type == "family" ? (
          <div>
            <button
              onClick={RejectReq}
              style={{ border: "1px solid #DC3545", color: "#DC3545" }}
              className="btn-content-btn hover:opacity-70 py-1 border-red-400 rounded-3xl duration-700 ... ease-in-out Quicksand"
            >
              Reject
            </button>
            <button
              onClick={AcceptReq}
              style={{ background: "#38AEE3" }}
              className="btn-content-btn hover:opacity-70 ml-2 py-1 rounded-3xl text-white duration-700 ... ease-in-out Quicksand"
            >
              Accept
            </button>
          </div>
        ) : (
          !withdraw &&
          !completed &&
          !cancelled && (
            <div className="text-end">
              <p className="max-lg:text-xs">Applied {formatDate(createdAt)}</p>
              <p className="text-[#9EA3A2] lg:text-xs text-[10px]">
                {timeAgo(createdAt)}
              </p>
            </div>
          )
        )}
        {!upcoming && request && type !== "nanny" ? (
          <NavLink
            to={
              type == "nanny"
                ? `/nanny/jobDescription/${id}`
                : `/family/profileNanny/${id}`
            }
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <button
              style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
              className={`btn-content-btn1 rounded-3xl py-1 Quicksand hover:opacity-70 duration-700 ease-in-out ${
                upcoming || request ? "mt-2" : ""
              }`}
            >
              View Application
            </button>
          </NavLink>
        ) : (
          !withdraw &&
          !completed &&
          !cancelled && (
            <div className="flex gap-2 lg:mt-2">
              <button
                onClick={Withdraw}
                style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
                className={`lg:w-28 w-20 max-lg:text-xs rounded-3xl py-1 Quicksand hover:opacity-70 duration-700 ease-in-out`}
              >
                Withdraw
              </button>
              <button
                style={{
                  color: "#38AEE3",
                  background: "#BFE3F3",
                }}
                onClick={handleMessage}
                className={`lg:w-28 w-20 max-lg:text-xs rounded-3xl py-1 Quicksand hover:opacity-70 duration-700 ease-in-out`}
              >
                Message
              </button>
            </div>
          )
        )}
        {cancelled && (
          <button
            style={{
              color: "#FFFFFF",
              background: "#38AEE3",
              border: "1px solid #38AEE3",
            }}
            onClick={ReConsider}
            className={`btn-content-btn1 max-lg:text-xs rounded-3xl py-1 Quicksand hover:opacity-70 duration-700 ease-in-out`}
          >
            Re-Consider within 30 days
          </button>
        )}
        {(upcoming || withdraw || cancelled) && (
          <div>
            <NavLink
              to={
                type == "nanny"
                  ? `/nanny/jobDescription/${id}`
                  : `/family/profileNanny/${id}`
              }
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <button
                style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
                className={`btn-content-btn1 rounded-3xl py-1 Quicksand hover:opacity-70 duration-700 ease-in-out ${
                  upcoming || request || cancelled ? "mt-2" : ""
                }`}
              >
                View Application
              </button>
            </NavLink>
          </div>
        )}

        {completed && !cancelled && (
          <div>
            <NavLink
              to={
                type == "nanny"
                  ? `/nanny/jobDescription/${id}`
                  : `/family/profileNanny/${id}`
              }
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <button
                style={{ border: "1px solid #38AEE3", color: "#38AEE3" }}
                className={`btn-content-btn1 rounded-3xl py-1 Quicksand hover:opacity-70 duration-700 ease-in-out mt-2`}
              >
                View Application
              </button>
            </NavLink>
            {type === "family" && !review ? (
              <div>
                <PayRevModel
                  type={type}
                  bookingId={bookingId}
                  pay={pay}
                  receiverId={nannyId}
                />
              </div>
            ) : (
              !review && (
                <div>
                  <PayRevModel
                    type={type}
                    bookingId={bookingId}
                    pay={pay}
                    receiverId={parentId}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
