import { CloseOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HireStep1 from '../subComponents/Hire/step1'
import { api } from '../../Config/api';
import { fireToastMessage } from '../../toastContainer';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { registerThunk } from '../Redux/authSlice';

export default function CommunitySign() {
    const hireStep1FormRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = () => {
        hireStep1FormRef.current
            .validateFields()

            .then(async values => {
                // If form is valid, submit it and move to the next step
                const dob = `${values.month} ${values.date} ${values.year}`
                setLoading(true)
                if (!values.location) {
                    fireToastMessage({
                        type: 'error',
                        message: 'Please fill location fields'
                    })
                    setLoading(false)
                }
                else if (!values.type) {
                    fireToastMessage({
                        type: 'error',
                        message: 'Please fill as an fields'
                    })
                    setLoading(false)
                }
                else {

                    const { data, status } = await api.get(
                        `/location?address=${values.location}`
                    )
                    if (status == 200) {
                        const cor = data?.results[0]?.geometry.location
                        const location1 = {
                            type: 'Point',
                            coordinates: [cor.lng, cor.lat],
                            format_location: data?.results[0]?.formatted_address
                        }
                        const val = {
                            name: values.name,
                            email: values.email,
                            password: values.password,
                            zipCode: values.zipCode,
                            type: values.type,
                            dob: dob,
                            location: location1
                        }

                        const result = await dispatch(
                            registerThunk({ ...val, additionalInfo: [       ] })
                        )

                        if (result.payload.status === 200) {
                            fireToastMessage({
                                success: true,
                                message: 'Your account was created successfully'
                            })
                            navigate('/login')
                            setLoading(false)
                            window.location.reload()
                        } else {
                            fireToastMessage({ type: 'error', message: result.payload.message })
                            setLoading(false)
                        }
                    }
                }
            })
            .catch(errorInfo => {
                // Handle validation failure
                if (errorInfo.errorFields[0].name == 'remember') {
                    fireToastMessage({
                        type: 'error',
                        message: 'Please check Terms of Service & Privacy Policy'
                    })
                }
                setLoading(false)
            })
    }
    return (
        <div className='padd-res w-full'>
            <div
                className='px-4 py-4 rounded-3xl'
                style={{
                    background:
                        'linear-gradient(174.22deg, rgba(183, 214, 255, 0.5) 0%, rgba(229, 241, 255, 0.4) 69.71%, rgba(248, 249, 255, 0.3) 100%)'
                }}
            >
                <div className='flex justify-end'>
                    <button onClick={handleGoBack}>
                        <CloseOutlined style={{ fontSize: '24px' }} />
                    </button>
                </div>
                <div className=' flex justify-center'>
                    <div>
                        <HireStep1 formRef={hireStep1FormRef} head={'Welcome to Community'} comm={true} />
                        <div className='w-full flex justify-center gap-4 flex-wrap'>
                            <Button
                                style={{ border: '1px solid #38AEE3' }}
                                className='bg-white w-[120px] h-[35px] rounded-full font-normal text-base'
                                onClick={handleGoBack}
                            >
                                Back
                            </Button>
                            <Button
                                style={{ background: '#85D1F1' }}
                                loading={loading}
                                className='w-[120px] h-[35px] border-none rounded-full font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110'
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
