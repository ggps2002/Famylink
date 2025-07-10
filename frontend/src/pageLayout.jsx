import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Components/Navbars/navbar";
import Navbar1 from "./Components/Navbars/navbar1";
import Footer from "./Components/Footer/footer";
import { api } from "./Config/api";
import { refreshTokenThunk, logout } from "./Components/Redux/authSlice";

export default function PageLayout() {
  const { user } = useSelector((s) => s.auth);
  const pathsWithHeaderFooter = [
    "/yourBusiness",
    "/forFamilies",
    "/jobSeekers",
    "/nannShare",
    "/services",
    "/",
    "/pricing",
    "/profile/:id",
  ];
  const pathsWithHeader = [
    "/joinNow",
    "/login",
    "/forgetPass",
    "/hire",
    "/job",
    "/tutor",
    "/tutorJob",
    "/swim",
    "/communitySign",
    "/swimJob",
    "/specialCaregiver",
    "/specialCaregiverJob",
    "/houseManager",
    "/houseManagerJob",
    "/music",
    "/musicJob",
    "/sportCoach",
    "/sportCoachJob",
  ];

  const { pathname } = useLocation();
  const isDynamicPath = (path, dynamicPath) => {
    const regex = new RegExp(`^${dynamicPath.replace(":id", "[^/]+")}$`);
    return regex.test(path);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessTokenExpiry } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkTokenOnLoad = async () => {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (accessTokenExpiry && currentTime >= accessTokenExpiry) {
        try {
          const { status } = await dispatch(refreshTokenThunk()).unwrap();
          if (status !== 200) {
            // If refresh fails, log out and redirect to login
            await dispatch(logout());
            navigate("/login", { state: { from: pathname }, replace: true });
          }
        } catch {
          // If refresh fails, log out and redirect to login
          await dispatch(logout());
          navigate("/login", { state: { from: pathname }, replace: true });
        }
      }
    };

    checkTokenOnLoad(); // Check token validity on component mount
  }, [accessTokenExpiry, dispatch, navigate, pathname]);

  useEffect(() => {
    let refreshTimeout;

    const setupTokenRefresh = () => {
      if (!accessTokenExpiry) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = accessTokenExpiry - currentTime;

      if (timeLeft > 60) {
        const refreshTime = (timeLeft - 60) * 1000;
        refreshTimeout = setTimeout(async () => {
          try {
            const { status } = await dispatch(refreshTokenThunk()).unwrap();
            if (status !== 200) {
              await dispatch(logout());
              navigate("/login", { state: { from: pathname }, replace: true });
            } else {
              setupTokenRefresh();
            }
          } catch {
            await dispatch(logout());
            navigate("/login", { state: { from: pathname }, replace: true });
          }
        }, refreshTime);
      }
    };

    setupTokenRefresh();

    return () => clearTimeout(refreshTimeout);
  }, [accessTokenExpiry, dispatch, navigate, pathname]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { status } = await dispatch(refreshTokenThunk()).unwrap();
            if (status === 200) {
              return api(originalRequest);
            } else {
              await dispatch(logout());
              navigate("/login", { state: { from: pathname }, replace: true });
            }
          } catch {
            await dispatch(logout());
            navigate("/login", { state: { from: pathname }, replace: true });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [dispatch, navigate, pathname]);

  const availability = user?.additionalInfo.find(
    (info) => info.key === "avaiForWorking"
  )?.value?.option;
  const language = user?.additionalInfo.find((info) => info.key === "language")
    ?.value?.option;
  const start = user?.additionalInfo.find((info) => info.key === "availability")
    ?.value?.option;
  const workExp = user?.additionalInfo.find((info) => info.key === "experience")
    ?.value?.option;
  const specificDaysAndTime = user?.additionalInfo.find(
    (info) => info.key === "specificDaysAndTime"
  )?.value;
  const salaryExp = user?.additionalInfo.find(
    (info) => info.key === "salaryExp"
  )?.value;
  const ageGroupsExp = user?.additionalInfo.find(
    (info) => info.key === "ageGroupsExp"
  )?.value?.option;

  const isProfileComplete =
    availability &&
    Array.isArray(language) &&
    language.length > 0 &&
    start &&
    workExp &&
    specificDaysAndTime &&
    Object.keys(specificDaysAndTime).length > 0 &&
    salaryExp &&
    Object.values(salaryExp).every((val) => val && val.trim() !== "") &&
    Array.isArray(ageGroupsExp) &&
    ageGroupsExp.length > 0;

  return (
    <>
      {pathsWithHeaderFooter.some((p) => isDynamicPath(pathname, p)) && (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
      {pathsWithHeader.some((p) => isDynamicPath(pathname, p)) && (
        <>
          <Header join={true} />
          <Outlet />
        </>
      )}
      {pathname.startsWith("/family") && (
        <>
          <Navbar1 />
          <div
            className={`${
              pathname.startsWith("/family/post-a-job") ||
              pathname.startsWith("/family/post-a-nannyShare")
                ? "bg-white"
                : `bg-gradient-to-b ${
                    pathname.startsWith("/family/pricing") ||
                    pathname.startsWith("/family/message")
                      ? "py-0"
                      : "py-8"
                  } from-[#9EDCE180] via-[#DAF4EF66] to-[#EFECE64D]`
            }`}
          >
            <Outlet />
          </div>
          {!(
            pathname.startsWith("/family/post-a-job") ||
            pathname.startsWith("/family/post-a-nannyShare")
          ) && <Footer />}
        </>
      )}
      {pathname.startsWith("/nanny") && (
        <>
          <Navbar1 nanny={true} />
          <div
            className={`bg-gradient-to-b from-[#FFEE8C] to-[#fdf8ea] py-8 ${
              pathname.startsWith("/nanny/pricing") ||
              (pathname.startsWith("/nanny/message") && "py-0")
            }`}
          >
            {pathname !== "/nanny/community" &&
              !pathname.startsWith("/nanny/details/") &&
              pathname !== "/nanny/edit" &&
              pathname !== "/nanny/pricing" &&
              pathname !== "/nanny/message" &&
              !isProfileComplete && (
                <NavLink to={"/nanny/edit"}>
                  <p className="padding-navbar1 max-lg:pb-4 cursor-pointer animate-glow transition-colors duration-300 hover:text-gray-500 lg:text-2xl font-bold  tracking-wide inline-block">
                    Setting Up Profile
                  </p>
                </NavLink>
              )}
            <Outlet />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
