import { useEffect, useState } from "react";
import Content from "./content";
import { Pagination } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchCancelRequesterThunk } from "../../Redux/cancelRequsterData";
import Loader from "../../subComponents/loader"; // Assuming you have a Loader component
import { fetchWithdrawRequesterThunk } from "../../Redux/getWithdrawRequestData";

export default function Withdraw({ type }) {
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();
    const { data, pagination, isLoading } = useSelector((s) => s.withdrawData); // Include isLoading from Redux state
    const pageSize = 8; // Number of cards to display per page
    const total = pagination?.total || data?.length || 0; // Fallback to pagination total

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchWithdrawRequesterThunk({ limit: pageSize, page: currentPage })).unwrap();
        };
        fetchData();
    }, [dispatch, currentPage, pageSize]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return (
        <div>
            {/* Loader displayed while data is being fetched */}
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {/* Show message if there's no data */}
                    {!data || data.length === 0 ? (
                        <p className="text-gray-500 text-start">No withdraw requests available</p>
                    ) : (
                        <>
                            {/* Use paginatedProfiles to only display the current page's data */}
                            {data.map((v) => (
                                <Content
                                    key={v._id}
                                    bookingId={v._id}
                                    id={v?.jobId?._id}
                                    img={v?.jobId?.user?.imageUrl}
                                    name={v?.jobId?.user?.name}
                                    parentId={v?.jobId?.user?._id}
                                    nannyId={v.requestBy?._id}
                                    loc={(v?.jobId?.user?.location)}
                                    zipCode={(v?.jobId?.user?.zipCode)}
                                    child={(v?.jobId?.user?.noOfChildren.length)}
                                    type={type}
                                    withdraw={true}
                                />
                            ))}

                            {/* Pagination and results count */}
                            <div className="flex justify-end mt-6">
                                <p style={{ color: "#667085" }} className="mt-1 mr-4 font-medium text-sm Quicksand">
                                    Showing {startItem}-{endItem} from {total}
                                </p>
                                <Pagination
                                    className="font-bold pagination-custom Quicksand"
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={pagination?.total || total}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
