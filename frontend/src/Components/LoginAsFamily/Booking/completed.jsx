import { useEffect, useState } from 'react'
import Content from './content'
import { Pagination, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComRequesterThunk } from '../../Redux/completedRequestData'
import Loader from '../../subComponents/loader'

export default function Completed({ type }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false) // Loader state
  const dispatch = useDispatch()
  const { data, pagination } = useSelector(s => s.completeRequesterData)
  const pageSize = 8 // Number of cards to display per page
  const total = data?.length > 0 && data?.length 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // Show loader
      await dispatch(
        fetchComRequesterThunk({ limit: pageSize, page: currentPage })
      ).unwrap()
      setLoading(false) // Hide loader
    }
    fetchData()
  }, [dispatch, currentPage, pageSize])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)

  return (
    <div>
      {loading ? ( // Show loader while data is fetching
        <Loader />
      ) : (
        <>
          {/* Show message if there's no data */}
          {!data || data?.length === 0 ? (
            <p className='text-gray-500 text-start'>
              No completed booking available
            </p>
          ) : (
            <>
              {/* Use paginatedProfiles to only display the current page's data */}
              {data &&
                data.map(v => (
                  <Content
                    key={v._id}
                    bookingId={v._id}
                    id={type == 'nanny' ? v?.jobId?._id : v.requestBy?._id}
                    img={type == 'nanny' ? v?.jobId?.user?.imageUrl : v.requestBy?.imageUrl}
                    name={type == 'nanny' ? v?.jobId?.user?.name : v.requestBy?.name}
                    parentId={v?.jobId?.user?._id}
                    nannyId={v.requestBy?._id}
                    start={
                      v.requestBy?.additionalInfo.find(
                        (info) => info.key === 'availability'
                      )?.value?.option
                    }
                    time={
                      v.requestBy?.additionalInfo.find(
                        (info) => info.key === 'avaiForWorking'
                      )?.value?.option
                    }
                    exp={
                      v.requestBy?.additionalInfo.find(
                        (info) => info.key === 'experience'
                      )?.value?.option
                    }
                    review={type == 'nanny' ? v?.
                      nannyReview : v?.familyReview}
                    loc={type == 'nanny' ? (v?.jobId?.user?.location) : v.requestBy?.location}
                    zipCode={type == 'nanny' ? (v?.jobId?.user?.zipCode) : v.requestBy?.zipCode}
                    child={type == 'nanny' ? (v?.jobId?.user?.noOfChildren.length) :
                      Object.keys(
                        v.requestBy?.additionalInfo.find(
                          (info) => info.key === 'noOfChildren'
                        )?.value || {}
                      )?.length
                    }
                    type={type}
                    dayTime={
                      v.requestBy?.additionalInfo.find(
                        (info) => info.key === 'specificDaysAndTime'
                      )?.value
                    }
                    completed={true}
                  />
                ))}

              <div className='flex justify-end mt-6'>
                <p
                  style={{ color: '#667085' }}
                  className='mt-1 mr-4 font-medium text-sm Quicksand'
                >
                  Showing {startItem}-{endItem} from {total}
                </p>
                <Pagination
                  className='font-bold pagination-custom Quicksand'
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
  )
}
