import logo from "../../assets/images/logo.png";
import menu from "../../assets/images/menu.png";
import notification from "../../assets/images/notification.png";
import "../../App.css";
import {
  CloseCircleOutlined,
  PoweroffOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { logout } from "../Redux/authSlice";
import { selectUnseenCount } from "../Redux/notificationSlice";
import { useNotifications } from "../../Config/useNotification";
import { timeAgo } from "../subComponents/toCamelStr";

// eslint-disable-next-line react/prop-types
export default function Navbar1({ nanny }) {
  const { pathname } = useLocation();
  const unseenCount = useSelector(selectUnseenCount)
  const navigate = useNavigate()
  const notificationsData =
    useSelector(state => state?.notifications?.notifications) || []
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setShowNotifications(false);
  };
  const { handleMarkAsSeen } = useNotifications({ userId: user._id })
  const markAsSeen = id => {
    handleMarkAsSeen(id)
  }
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setMenuOpen(false);
  };
  const logOut = () => {
    dispatch(logout());
  };

  return (
    <div
      style={{ background: "#FFFFFF" }}
      className={`${!(
        pathname.startsWith("/family/post-a-job") ||
        pathname.startsWith("/family/post-a-nannyShare")
      ) &&
        "border border-[#38AEE34D]"
        } top-0 z-50 sticky flex justify-between items-center w-full h-20 padding-navbar1`}
    >
      <NavLink
        to={nanny ? "/nanny" : "/family"}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img
          className="w-40 img-navbar1 object-contain"
          src={logo}
          alt="logo"
        />
      </NavLink>

      {!(
        pathname.startsWith("/family/post-a-job") ||
        pathname.startsWith("/family/post-a-nannyShare")
      ) && (
          <div className="flex max-lg:hidden text-lg items-center gap-4">
            <NavLink
              to={nanny ? "/nanny" : "/family"}
              style={{
                color:
                  window.location.pathname == "/nanny" ||
                    window.location.pathname == "/family"
                    ? "#38AEE3"
                    : "",
              }}
              className="transition delay-150 ease-in-out  hover:text-[#38AEE3] ... rounded-3xl duration-300 cursor-pointer Quicksand"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <p className="">{nanny ? "Find a Job" : "Find Caregivers"}</p>
            </NavLink>

            {!nanny && (
              <NavLink
                className="transition delay-150 ease-in-out  hover:text-[#38AEE3] ... display-none-admin1 rounded-3xl duration-300 cursor-pointer Quicksand"
                to={"family/nannyShare"}
                style={({ isActive }) => ({
                  color: isActive ? "#38AEE3" : "",
                })}
              >
                <p className="">Nanny Share</p>
              </NavLink>
            )}

            {!nanny && (
              <NavLink
                className="transition delay-150 ease-in-out  hover:text-[#38AEE3] ... display-none-admin1 rounded-3xl duration-300 cursor-pointer Quicksand"
                to={"family/jobListing"}
                style={({ isActive }) => ({
                  color: isActive ? "#38AEE3" : "",
                })}
              >
                <p>My Job Listings</p>
              </NavLink>
            )}

            <NavLink
              className="transition delay-150 ease-in-out  hover:text-[#38AEE3] ... display-none-admin1 rounded-3xl duration-300 cursor-pointer Quicksand"
              to={nanny ? "nanny/community" : "family/community"}
              style={({ isActive }) => ({
                color: isActive ? "#38AEE3" : "",
              })}
            >
              <p className="">Community</p>
            </NavLink>

            <NavLink
              className="transition delay-150 ease-in-out  hover:text-[#38AEE3] ... display-none-admin1 rounded-3xl duration-300 cursor-pointer Quicksand"
              to={nanny ? "nanny/message" : "family/message"}
              style={({ isActive }) => ({
                color: isActive ? "#38AEE3" : "",
              })}
            >
              <p className="">Messages</p>
            </NavLink>

            {nanny && (
              <NavLink
                className="transition delay-150 ease-in-out  hover:text-[#38AEE3] ... display-none-admin1 rounded-3xl duration-300 cursor-pointer Quicksand"
                to={nanny ? "nanny/booking" : "family/booking"}
                style={({ isActive }) => ({
                  color: isActive ? "#38AEE3" : "",
                })}
              >
                <p className="">Applications</p>
              </NavLink>
            )}
          </div>
        )}

      <div className="flex items-center gap-x-4">
        <NavLink to={nanny ? 'nanny/pricing' : 'family/pricing'}>
          <button className="bg-[#38AEE3] lg:block hidden w-28 text-white h-10 rounded-full Belleza transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110">Upgrade</button></NavLink>
        <div className="relative">
          <img
            src={notification}
            onClick={() => setShowNotifications(!showNotifications)}
            className="cursor-pointer transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110"
            alt="notification-icon"
          />

          {/* Notification Counter */}
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-medium px-1 py-0.2 rounded-full">
              {unseenCount > 9 ? '9+' : unseenCount}
            </span>
          )}
        </div>

        {!(
          pathname.startsWith("/family/post-a-job") ||
          pathname.startsWith("/family/post-a-nannyShare")
        ) && (
            <NavLink
              to={nanny ? "/nanny" : "/family"}
              style={({ isActive }) => ({
                color: isActive ? "#38AEE3" : "",
              })}
              className="transition delay-150 ease-in-out lg:hidden  hover:text-[#38AEE3] ... rounded-3xl duration-300 cursor-pointer Quicksand"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <p className="">{nanny ? "Find a Job" : "Find Caregivers"}</p>
            </NavLink>
          )}

        <div>
          {/* The menu button */}
          {!(
            pathname.startsWith("/family/post-a-job") ||
            pathname.startsWith("/family/post-a-nannyShare")
          ) && (
              <div
                className="flex gap-x-2 bg-white px-2 py-1 rounded-full cursor-pointer"
                onClick={toggleMenu}
              >
                <img className="object-contain" src={menu} alt="menu" />
                {user.imageUrl ? (
                  <img
                    style={{ borderRadius: "100px" }}
                    src={user.imageUrl}
                    alt="avatar"
                    className="rounded-full w-8 h-8 object-cover"
                  />
                ) : (
                  <Avatar
                    className="rounded-full text-black"
                    size="32"
                    color={"#38AEE3"}
                    name={user.name?.split(' ') // Split by space
                      .slice(0, 2) // Take first 1–2 words
                      .join(' ')}
                  />
                )}
              </div>
            )}

          {menuOpen && (
            <>
              <div
                style={{
                  top: 0,
                  maxHeight: "80vh", // Set max height for scrollable content
                  overflowY: "auto", // Enable vertical scrolling
                }}
                className="right-0 z-50 absolute bg-white shadow-lg w-72"
              >
                {/* Profile Section */}

                <div style={{ background: "#E9F8FF" }}>
                  <div className="pb-2">
                    <CloseCircleOutlined
                      onClick={toggleMenu}
                      className="p-2 cursor-pointer"
                    />
                    <NavLink
                      onClick={toggleMenu}
                      to={nanny ? "/nanny" : "/family"}
                    >
                      <div className="flex justify-center w-full text-center">
                        <div>
                          {user.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt="avatar"
                              className="mx-auto rounded-full w-12 h-12 object-cover"
                            />
                          ) : (
                            <Avatar
                              className="rounded-full text-5xl text-black"
                              size="48"
                              color={"#38AEE3"}
                              name={user.name?.split(' ') // Split by space
                                .slice(0, 2) // Take first 1–2 words
                                .join(' ')}
                            />
                          )}

                          <p className="py-2 font-semibold text-2xl Quicksand">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>

                {/* Menu Options */}

                {/* {nanny && (
                  <div className='flex justify-center items-center my-6'>
                    <div
                      style={{ background: '#FFF0F5' }}
                      className='hover:opacity-90 py-2 rounded-2xl w-56 font-medium text-center text-sm duration-300 cursor-pointer Quicksand'
                    >
                      <p>Earnings</p>
                      <p className='font-semibold text-2xl'>$200.00</p>
                    </div>
                  </div>
                )} */}
                <div
                  className={`${!nanny ? "mt-8" : "mt-8"} flex justify-center`}
                >
                  <div>
                    <NavLink
                      className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                      to={nanny ? "nanny/profile" : "family/profile"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                      })}
                      onClick={toggleMenu}
                    >
                      <p className="">View Profile</p>
                      <RightOutlined className="text-sm" />
                    </NavLink>

                    <NavLink
                      className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                      to={nanny ? "nanny/edit" : "family/edit"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                      })}
                      onClick={toggleMenu}
                    >
                      <p className="">Edit Profile</p>
                      <RightOutlined className="text-sm" />
                    </NavLink>
                    {!nanny && (
                      <NavLink
                        className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={"family/post-a-job"}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">Post a Job</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                    )}
                    <NavLink
                      className={`flex justify-between border-2 ${nanny ? `lg:hidden` : ""
                        } hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand`}
                      to={nanny ? "nanny/booking" : "family/booking"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                      })}
                      onClick={toggleMenu}
                    >
                      <p className="">Application</p>
                      <RightOutlined className="text-sm" />
                    </NavLink>

                    {/* {nanny && (
                      <NavLink
                        className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={"nanny/application"}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">Applied Requests</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                    )} */}

                    {!nanny && (
                      <NavLink
                        className="flex justify-between lg:hidden border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={"#"}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">Nanny Share</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                    )}

                    {!nanny && (
                      <NavLink
                        className="flex justify-between lg:hidden border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={"family/jobListing"}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">My Job Listings</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                    )}

                    <NavLink
                      className="flex justify-between border-2 lg:hidden hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                      to={nanny ? "nanny/message" : "family/message"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                      })}
                      onClick={toggleMenu}
                    >
                      <p className="">Messages</p>
                      <RightOutlined className="text-sm" />
                    </NavLink>

                    <NavLink
                      className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                      to={nanny ? "nanny/favorites" : "family/favorites"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                      })}
                      onClick={toggleMenu}
                    >
                      <p className="">Favorite</p>
                      <RightOutlined className="text-sm" />
                    </NavLink>

                    {/* // When payment system acheive */}
                    {/* {nanny && (
                      <NavLink
                        className='flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand'
                        to={'nanny/withdrawEarning'}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? '#E9F8FF' : '#F7F9FA'
                        })}
                        onClick={toggleMenu}
                      >
                        <p className=''>Withdraw Earnings</p>
                        <RightOutlined className='text-sm' />
                      </NavLink>
                    )} */}

                    {/* <NavLink className='flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand' to={nanny ? 'nanny/transHistory' : 'family/transHistory'} style={({ isActive }) => ({
                                            backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA"
                                        })} onClick={toggleMenu} >
                                            <p className="">Transaction History</p>
                                            <RightOutlined className='text-sm' />
                                        </NavLink> */}
                    <NavLink
                      className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                      to={nanny ? "nanny/setting" : "family/setting"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                      })}
                      onClick={toggleMenu}
                    >
                      <p className="">Settings</p>
                      <RightOutlined className="text-sm" />
                    </NavLink>
                  </div>
                </div>

                <div className="my-2">
                  <h5 className="mx-8 mb-4 font-semibold text-2xl">Support</h5>
                  <div className="flex justify-center">
                    <div>
                      <NavLink
                        className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={
                          nanny
                            ? "nanny/tipsAndArticles"
                            : "family/tipsAndArticles"
                        }
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">Tips & Articles</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                      <NavLink
                        className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={nanny ? "nanny/howItWorks" : "family/howItWorks"}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">How it Works</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                      <NavLink
                        className="flex justify-between border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={
                          nanny
                            ? "nanny/trustsAndSafety"
                            : "family/trustsAndSafety"
                        }
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">Trust & Safety</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                      <NavLink
                        className="flex justify-between lg:hidden border-2 hover:opacity-60 mb-4 px-2 py-1 rounded-3xl w-56 font-medium text-sm duration-300 cursor-pointer Quicksand"
                        to={nanny ? "nanny/community" : "family/community"}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? "#E9F8FF" : "#F7F9FA",
                        })}
                        onClick={toggleMenu}
                      >
                        <p className="">Community</p>
                        <RightOutlined className="text-sm" />
                      </NavLink>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="flex justify-center mt-4 mb-6 Quicksand">
                  <button
                    onClick={logOut}
                    className="flex items-center gap-2 hover:opacity-65 duration-300"
                  >
                    <PoweroffOutlined />
                    Logout
                  </button>
                </div>
              </div>

              {/* Backdrop to freeze everything else */}
              <div
                className="z-40 fixed inset-0 bg-black opacity-50"
                onClick={toggleMenu}
              ></div>
            </>
          )}
        </div>
        {showNotifications && (
          <>
            {/* Background Overlay (optional if you want to close on outside click) */}
            <div
              onClick={toggleNotifications}
              className="fixed inset-0 z-40"
            />

            <div
              style={{
                top: 70,
                right: 20,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              className="absolute right-0 mt-2 lg:w-96 w-80 z-50 bg-white rounded-xl shadow-lg"
            >
              <div className="p-4 border-b flex items-center justify-between bg-[#E9F8FF] rounded-t-xl">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <button onClick={toggleNotifications} className="text-gray-500 hover:text-black">
                  ✕
                </button>
              </div>

              {notificationsData.length > 0 ? (
                <div className="space-y-3 p-4">
                  {notificationsData.map((n, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        toggleNotifications();
                        markAsSeen(n._id);
                        if (n.type === 'Booking') {
                          n.content == 'Give review' ?
                            navigate(nanny ? `/nanny/profile/` : `/family/profile`) :
                            navigate(nanny ? `/nanny/booking/` : `/family/booking`);
                        } else if (n.type === 'Message') {
                          navigate(nanny ? `/nanny/message/` : `/family/message`);
                        } else {
                          navigate('/notifications'); // default path
                        }
                      }}
                      className={`flex items-start justify-between cursor-pointer p-3 rounded-lg ${n.seen ? "bg-gray-100" : "bg-blue-50"
                        } hover:bg-blue-100 transition`}
                    >
                      <div className="flex items-center gap-3">
                        {
                          n.senderId?.imageUrl ? <img
                            src={n.senderId?.imageUrl}
                            className="w-10 h-10 rounded-full object-cover"
                            alt="profile"
                          /> : <Avatar
                            className="rounded-full text-5xl text-black"
                            size="40"
                            color={"#38AEE3"}
                            name={n.senderId?.name?.split(' ') // Split by space
                              .slice(0, 2) // Take first 1–2 words
                              .join(' ')}
                          />
                        }

                        <div>
                          <p className="font-semibold ">{n.senderId?.name}</p>
                          <p className="text-sm text-gray-600 whitespace-normal">
                            <p className="text-sm text-gray-600 whitespace-normal">
                              {n.type === 'Message' && `New Message: ${n.content.length > 25 ? n.content.slice(0, 25) + '...' : n.content}`}
                              {n.type === 'Booking' && `${n.content.length > 25 ? n.content.slice(0, 25) + '...' : n.content}`}
                            </p>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
