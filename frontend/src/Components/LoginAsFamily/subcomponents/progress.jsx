
import { Progress } from "antd"
import star from '../../../assets/images/star1.png'

export default function Prog({ num, pro, color}) {
    return (
        <div className='flex items-center gap-2 w-36'>
            <p style={{ fontSize: 10 }}>{num}</p>
            <img src={star} alt="star" />
            <Progress  percent={pro} trailColor='#E9ECEF' strokeColor={color} showInfo={false} />
        </div>
    )
}