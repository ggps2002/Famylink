import Ra from '../../subComponents/rate';
import Avatar from 'react-avatar';

export default function Reviews({ img, points, name, size, para, hr }) {
    return (
        <div>
            <div className='flex items-center gap-4'>
                <div>
                    {
                        img ?
                            <img className='object-contain w-10 rounded-full' src={img} alt="img" />
                            :
                            <Avatar
                                className='object-contain w-10 rounded-full' size='40' color={'#38AEE3'}
                                name={
                                    name
                                        ?.split(' ') // Split by space
                                        .slice(0, 2) // Take first 1–2 words
                                        .join(' ')   // Re-join them
                                }
                            />
                    }

                </div>
                <div>
                    <p style={{ marginBottom: '-7px' }} className='text-sm font-semibold'>{name}</p>
                    <Ra points={points} size={size} />
                </div>
            </div>
            <p className='text-sm leading-4 mt-4'>{para}</p>
            {
                hr &&
                <hr className='my-5' />
            }

        </div>

    )
}