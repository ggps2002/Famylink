import { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import CardComm from './cardComm'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux' // Replace with your actual action creator
import { fetchAllBlogThunk } from '../../Redux/blogsSlice'

export default function PagComm ({ category, nanny }) {
  const dispatch = useDispatch()
  const { data, pagination, isLoading } = useSelector(state => state.blogs)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10 // Number of records per page
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        fetchAllBlogThunk({
          limit: pageSize,
          page: currentPage,
          category: category !== 'Community Resources' ? category : undefined
        })
      ).unwrap()
    }
    fetchData()
  }, [currentPage, pageSize, category])

  const handlePageChange = page => {
    setCurrentPage(page)
  }
  return (
    <div>
      {/* Display a loader if the data is still loading */}
      {isLoading ? (
        <div className='flex justify-center mt-10'>Loading...</div>
      ) : (
        <>
          {/* Render profiles */}
          <div className='flex flex-wrap justify-start gap-x-12 gap-y-8'>
            {data.length > 0 &&
              data?.map((v, i) => (
                <NavLink
                  key={i}
                  to={
                    nanny
                      ? `/nanny/details/${v._id}`
                      : `/family/details/${v._id}`
                  }
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <CardComm
                    img={v.images[0]}
                    head={v.name}
                    val={v.category}
                    para={v.description}
                  />
                </NavLink>
              ))}
          </div>

          {/* Pagination controls */}
          {data.length > 0 ? (
            <div className='flex justify-end items-center mt-6'>
              <p className='font-medium text-sm'>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, pagination.totalRecords || 0)}{' '}
                of {pagination.totalRecords || 0} Results
              </p>
              <Pagination
                className='font-bold pagination-custom Quicksand'
                current={currentPage}
                pageSize={pageSize}
                total={pagination.totalRecords || 0}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          ) : (
            <p className='font-semibold text-center text-lg'>
              No results found for "
              {category.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}". Please
              try a different category or search term.
            </p>
          )}
        </>
      )}
    </div>
  )
}
