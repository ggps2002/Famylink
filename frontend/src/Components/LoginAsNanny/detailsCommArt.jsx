import { useEffect, useState } from 'react'
import line from '../../assets/images/l1.png'
import Search from '../subComponents/search'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import Swipe from '../subComponents/swiper'
import s1 from '../../assets/images/s1.png'
import fb from '../../assets/images/fblogo.png'
import tw from '../../assets/images/twlogo.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlogByIdThunk } from '../Redux/blogsSlice'
import { formatDate, formatTime } from '../subComponents/toCamelStr'
import { navItemsArticles } from '../../Config/helpFunction'
import { Drawer } from 'antd'
import menuIcon from '../../assets/images/menu.png'

export default function DetailsCommArtNanny () {
  const handleSearch = searchValue => {
    ('Search Value:', searchValue) // Use the search value here
  }
  const dispatch = useDispatch()
  const { id } = useParams('id')
  const { data } = useSelector(state => state.blogs)
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchBlog = async () => {
      await dispatch(fetchBlogByIdThunk(id))
    }

    if (id) {
      fetchBlog()
    }
  }, [id, dispatch])
  const { pathname } = useLocation()
  return (
    <div>
      <div className='lg:flex hidden border-[1px] border-[#D6DDEB] bg-white -mt-8 justify-between items-center h-20 padding-navbar1'>
        {navItemsArticles.map(cat => (
          <NavLink
            key={cat}
            to={pathname.startsWith("/nanny") ? '/nanny/tipsAndArticles' : '/family/tipsAndArticles'}
            state={{ v: cat }}
            style={{
              color: data?.blog?.category === cat ? '#38AEE3' : '#000' // Set active or default color
            }}
            className='flex cursor-pointer'
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <p className='font-normal text-center text-header-comm'>
              {cat}
            </p>
            {cat === 'Community Resources' && (
              <img src={line} className='ml-12 disp-none' alt='line' />
            )}
          </NavLink>
        ))}
      </div>

      <img onClick={() => setOpen(true)} src={menuIcon} alt="menu" className="w-6 h-6 lg:hidden block mx-2 hover:opacity-50 ease-out cursor-pointer" />
   
      <Drawer
        closable={false}
        placement="bottom"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col gap-4">
          {navItemsArticles.map((cat) => (
            <NavLink
              key={cat}
              to={'/nanny/tipsAndArticles'}
              state={{ v: cat }}
              style={{
                color: data?.blog?.category === cat ? '#38AEE3' : '#000' // Set active or default color
              }}
              className={`cursor-pointer text-base text-center`}
            >
              {cat}
            </NavLink>
          ))}
        </div>
      </Drawer>

      <div className='padding-navbar1 Quicksand'>
        <div className='shadow my-10 bg-white  pb-10 rounded-xl'>
          <p className='font-bold lg:text-3xl text-2xl uppercase edit-padding'>
            {data?.blog?.name}
          </p>
          <div className='flex justify-end padding-navbar1'>
            <div className='mb-5'>
              <Search onSearch={handleSearch} />
            </div>
          </div>
          <div className='padding-navbar1'>
            <img
              className='rounded-3xl w-full h-96 object-fill'
              src={data?.blog?.images[0]}
              alt='s1'
            />
            <div className='flex justify-between py-5'>
              <p style={{ color: '#C1C1C1' }}>
                By Famlink &#8226; {formatDate(data?.blog?.createdAt)} @{' '}
                {formatTime(data?.blog?.createdAt)}
              </p>
              <div className='flex gap-2'>
                <a href='#'>
                  <img src={fb} alt='fb' />
                </a>
                <a href='#'>
                  <img src={tw} alt='tw' />
                </a>
              </div>
            </div>
            <p className='font-normal leading-6 whitespace-pre-line'>
              {data?.blog?.description}
            </p>
          </div>
        </div>
      </div>
      {data?.relatedBlogs?.length > 0 && (
        <div className='pt-4 padding-sub'>
          <p className='font-semibold lg:text-3xl text-2xl'>Related Articles</p>
          <div className='pt-4 pb-10'>
            <Swipe data={data?.relatedBlogs} />
          </div>
        </div>
      )}
    </div>
  )
}
