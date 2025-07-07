import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { fetchPostJobByCurrentUserThunk } from "../../Redux/postJobSlice"
import Loader from "../../subComponents/loader"
import { formatSentence } from "../../subComponents/toCamelStr"

const JobListing = () => {
    const dispatch = useDispatch()
    const { data, isLoading } = useSelector(s => s.jobPost)
    
    useEffect(() => {
        dispatch(fetchPostJobByCurrentUserThunk())
    }, [dispatch])
    return (
        <>
            {
                isLoading ?
                    <Loader /> :
                    <div className="padding-navbar1">
                        <div className="flex lg:my-8 max-lg:mb-8 justify-between items-center">
                            <p className="font-bold lg:text-4xl text-2xl Classico">
                                My Job Listing
                            </p>
                            <NavLink
                                to={'/family/post-a-job'}
                                className="bg-[#38AEE3] flex justify-center items-center text-center lg:w-40 lg:h-10 w-28 h-8 lg:text-lg rounded-3xl text-white transition hover:-translate-y-1 duration-700 delay-150 ... ease-in-out hover:scale-110"
                            >
                                <p>Post a Job</p>
                            </NavLink>
                        </div>
                        <div className="flex flex-col gap-4">
                            {
                                data && data.length > 0 ? (
                                    data.map((v) => (
                                        <NavLink key={v._id} to={`/family/jobListingView/${v._id}`} className="flex flex-col justify-between shadow-custom-shadow lg:p-8 p-4 rounded-2xl bg-white">
                                            <div className="flex justify-between">
                                                <p className="lg:text-2xl text-xl font-bold Classico">{v?.jobType && formatSentence(v?.jobType)}</p>
                                            </div>

                                            <p className="font-medium text-justify leading-5 lg:my-4 my-2 max-lg:text-sm">{v?.[v?.jobType]?.jobDescription}</p>

                                            <p className="lg:mb-4 mb-2 lg:text-lg">{v?.user?.location?.format_location}</p>
                                            <div className="flex justify-between items-center">
                                                <p>{v?.user?.noOfChildren?.length} kids</p>
                                                <p
                                                    style={{ background: "#E7F6FD" }}
                                                    className="px-2 py-1 rounded-lg text-sm"
                                                >
                                                    {v?.[v?.jobType]?.preferredSchedule}
                                                </p>
                                            </div>
                                        </NavLink>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 mt-8 text-lg">
                                        You have not posted any jobs yet.
                                    </div>
                                )
                            }
                        </div>
                    </div>
            }
        </>
    )
}

export default JobListing