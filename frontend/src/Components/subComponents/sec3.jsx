import lineVer1 from '../../assets/images/lineVer1.png'
import Tab from './tab'

export default function Sec3({ first, sec, third }) {
    return (
        <div className='flex flex-wrap justify-center text-center items-center gap-20 mt-16'>
            <div className=''>
                <div style={{ borderRight: "1px solid #000000" }} className='pr-6 pt-14 pb-20 max-lg:pt-7 max-lg:pb-10'>
                    <p className='uppercase text-6xl max-lg:text-5xl font-normal Livvic text-start'>Community</p>
                    <p className='uppercase text-6xl max-lg:text-5xl font-normal Elliana-Samantha my-6'>And</p>
                    <p className='uppercase text-6xl max-lg:text-5xl font-normal Livvic text-end'>Features</p>
                </div>
                <img style={{ marginTop: "-80px" }} className=' h-36' src={lineVer1} alt="lineVer1" />
            </div>
            <div className="px-2">
                <Tab first={first} sec={sec} third={third}/>
            </div>
        </div>
    )
}