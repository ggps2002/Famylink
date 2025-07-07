import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Swipe({ data, nanny }) {
    const location = useLocation();
    const path = (location.pathname)
    // Scroll to top when navigating to a new route
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location]);
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={3}
            className='cursor-pointer'
        >
            {
                data?.map((v, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <div className='swiper-slide-wrapper'>
                                <NavLink to={path.includes('/nanny/') ? `/nanny/details/${v?._id}` :`/family/details/${v?._id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                    <img className='rounded-3xl w-96 h-48 object-fill' src={v?.images[0]} alt="v.img" />
                                    <p className='mt-1 font-bold leading-6 swiper-text'>{v?.name}</p>
                                </NavLink>
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
    );
};
