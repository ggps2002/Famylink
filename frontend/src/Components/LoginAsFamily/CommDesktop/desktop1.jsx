import { useDispatch, useSelector } from 'react-redux'
import Search from '../../subComponents/search'
import { NavLink, useParams } from 'react-router-dom'
import { fetchCommunityByIdThunk } from '../../Redux/communitySlice'
import { useEffect } from 'react'
import Loader from '../../subComponents/loader'

export default function Desktop1({ nanny }) {
  const { id } = useParams()
  const { data, isLoading } = useSelector(state => state.community)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCommunityByIdThunk(id))
    }
    fetchData()
  }, [dispatch, id])

  const handleSearch = searchValue => {
    ('Search Value:', searchValue) // Use the search value here
  }
  return (
    <div className='padding-navbar1 Quicksand'>
      <div className='flex flex-wrap flex-re justify-between gap-y-3 mt-6'>
        <div className='width-cat-com'>
          <p className='font-bold lg:text-3xl text-2xl'>{data?.name}</p>
          <p className='mt-3 font-normal leading-5'>{data?.description}</p>
        </div>
        <div>
          <Search onSearch={handleSearch} />
        </div>
      </div>
      <hr className='my-6' />
      <div className='mb-6'>

        {!isLoading ? (
          data.topics?.length > 0 &&
          data?.topics?.map((v, i) =>
            v?.posts?.length > 0 ? (
              <NavLink
                to={
                  nanny
                    ? `/nanny/desktop2/${id}/${v._id}`
                    : `/family/desktop2/${id}/${v._id}`
                }
                key={i}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className='flex justify-between items-center w-full'>
                  <div style={{ color: '#38AEE3' }} className='w-4/5'>
                    <p className='font-bold text-2xl'>{v?.name}</p>
                    <p className='mt-1 font-normal leading-5'>
                      {v?.description}
                    </p>
                  </div>
                  <div className='w-0/5 font-page1'>
                    <p className='font-normal'>Posts: {v?.posts?.length}</p>
                  </div>
                </div><hr className='my-6' />
              </NavLink>
            ) : (
              <div key={i}>
                <div className='flex justify-between items-center w-full'>
                  <div style={{ color: '#38AEE3' }} className='w-4/5'>
                    <p className='font-bold text-2xl'>{v?.name}</p>
                    <p className='mt-1 font-normal leading-5'>
                      {v?.description}
                    </p>
                  </div>
                  <div className='w-0/5 font-page1'>
                    <p className='font-normal'>Posts: {v?.posts?.length}</p>
                  </div>
                </div>
                <hr className='my-6' />
              </div>
            )
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}
