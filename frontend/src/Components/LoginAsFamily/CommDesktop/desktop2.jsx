import { useDispatch, useSelector } from 'react-redux'
import Search from '../../subComponents/search'
import { NavLink, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchTopicByIdThunk } from '../../Redux/communitySlice'
import Loader from '../../subComponents/loader'

export default function Desktop2 ({ nanny }) {
  const { id, topicId } = useParams()

  const { data, isLoading } = useSelector(state => state.community)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchTopicByIdThunk({ id, topicId }))
    }
    fetchData()
  }, [dispatch, id, topicId])

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
          data?.posts?.map((v, i) => (
            <NavLink
              to={
                nanny ? `/nanny/desktop3/${i + 1}/${v._id}` : `/family/desktop3/${i + 1}/${v._id}`
              }
              key={i}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className='flex justify-between items-center w-full'>
                <div style={{ color: '#38AEE3' }} className='w-4/5'>
                  <p className='font-bold text-2xl'>Post {i + 1}</p>
                  <p className='mt-1 font-normal leading-5'>{v.description}</p>
                </div>
                <div className='w-0/5 font-page1'>
                  <p className='font-normal'>Created By: Admin</p>
                </div>
              </div>
              {i !== data.length - 1 && <hr className='my-6' />}{' '}
            </NavLink>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}
