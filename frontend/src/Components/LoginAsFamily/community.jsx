import { useEffect } from 'react'
import Search from '../subComponents/search'
import { NavLink } from 'react-router-dom'
import { fetchAllCommunityThunk } from '../Redux/communitySlice'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../subComponents/loader'

export default function Community ({ nanny }) {
  const { data, isLoading } = useSelector(state => state.community)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllCommunityThunk())
    }
    fetchData()
  }, [dispatch])
  
  return (
    <div className='padding-navbar1 Quicksand'>
      <div className='relative flex justify-center items-center bg-cover bg-center my-10 rounded-3xl h-96 img-main1'>
        <div
          style={{ background: '#DEEBEB99' }}
          className='absolute inset-0 bg-opacity-60 rounded-3xl'
        ></div>
        <div className='relative z-10 px-4 max-w-3xl text-center'>
          <h2 className='font-semibold text-4xl'>Community</h2>
          <p className='mt-2 font-normal text-black leading-5'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <div className='flex flex-wrap flex-re justify-between gap-y-3'>
        <div className='width-cat-com'>
          <p className='font-bold lg:text-3xl text-2xl'>Community Category 1</p>
          <p className='mt-3 font-normal leading-5'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <Search />
        </div>
      </div>
      <hr className='my-6' />
      <div className='mb-6'>
        {!isLoading ? data.length > 0 &&(
          data?.map((v, i) =>
            v?.topics?.length > 0 ? (
              <NavLink
                to={
                  nanny
                    ? `/nanny/desktop1/${v._id}`
                    : `/family/desktop1/${v._id}`
                }
                key={v._id}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className='flex justify-between items-center w-full'>
                  <div style={{ color: '#38AEE3' }} className='w-4/5'>
                    <p className='font-bold text-2xl'>{v.name}</p>
                    <p className='mt-1 font-normal leading-5'>
                      {v.description}
                    </p>
                  </div>
                  <div className='w-0/5 font-page1'>
                    <p className='font-normal'>Topics: {v?.topics?.length}</p>
                    <p className='font-normal'>
                      Posts:{' '}
                      {v?.topics?.reduce(
                        (sum, topic) => sum + (topic.posts?.length || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
                {i !== data.length - 1 && <hr className='my-6' />}
              </NavLink>
            ) : (
              <div key={i}>
                <div className='flex justify-between items-center w-full'>
                  <div style={{ color: '#38AEE3' }} className='w-4/5'>
                    <p className='font-bold text-2xl'>{v.name}</p>
                    <p className='mt-1 font-normal leading-5'>
                      {v.description}
                    </p>
                  </div>
                  <div className='w-0/5 font-page1'>
                    <p className='font-normal'>Topics: {v?.topics?.length}</p>
                    <p className='font-normal'>
                      Posts:{' '}
                      {v?.topics?.reduce(
                        (sum, topic) => sum + (topic.posts?.length || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
                {i !== data.length - 1 && <hr className='my-6' />}
              </div>
            )
          )
        ) : (
          <Loader/>
        )}
      </div>
    </div>
  )
}
