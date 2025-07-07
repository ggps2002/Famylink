import { Radio } from 'antd'
import hire from '../../assets/images/hire.png'
import job from '../../assets/images/job.png'
import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { resetForm } from '../Redux/formValue'

export default function JoinNow() {
  const navigate = useNavigate()
  const [value, setValue] = useState(1)
  const dispatch = useDispatch()
  const onRadioChange = radioValue => {
    setValue(radioValue) // Set radio value when changed
  }

  const handleGoBack = () => {
    navigate('/') // Navigate back in history
  }

  const handleCreateAccount = () => {
    dispatch(resetForm())
    if (value === 1) {
      navigate('/hire') // Navigate to the hire component if selected
    } else if (value == 2) {
      navigate('/job') // Navigate to the job component if selected
    } else {
      navigate('/communitySign')
    }
  }
  return (
    <div className='padd-res'>
      <div
        className='px-4 py-4 rounded-3xl'
        style={
          value === 1
            ? {
              background:
                'linear-gradient(174.22deg, rgba(158, 220, 225, 0.5) 0%, rgba(218, 244, 239, 0.4) 69.71%, rgba(239, 236, 230, 0.3) 100%)',
            }
            : value === 2
              ? {
                background:
                  'linear-gradient(174.22deg, #FFCADA 0%, rgba(246, 238, 233, 0.4) 69.71%, #FFF1F5 100%)',
              }
              : value === 3
                ? {
                  background:
                    'linear-gradient(174.22deg, rgba(183, 214, 255, 0.5) 0%, rgba(229, 241, 255, 0.4) 69.71%, rgba(248, 249, 255, 0.3) 100%)',
                }
                : {}
        }
      >
        <div className='flex justify-end'>
          <button onClick={handleGoBack}>
            <CloseOutlined style={{ fontSize: '24px' }} />
          </button>
        </div>
        <div className='step-content text-center'>
          <div className='flex justify-center w-full'>
            <p className='px-3 width-form font-normal uppercase Classico offer-font'>
              Tell us what {`you're`} looking for
            </p>
          </div>

          <div className='flex flex-wrap justify-center gap-12 my-10'>
            <div
              className='bg-white px-4 py-4 rounded-3xl w-60'
              onClick={() => onRadioChange(1)}
            >
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <img src={hire} alt='hire' />
                  <p className='text-xl font-bold Classico'>Parents</p>
                </div>

                <Radio checked={value === 1}></Radio>
              </div>
              <div className='mt-4'>
                <p className='mt-2 text-black text-start leading-tight'>I am looking to hire / find nanny share</p>
              </div>
            </div>

            <div
              className='bg-white px-4 py-4 rounded-3xl w-60'
              onClick={() => onRadioChange(2)}
            >
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <img src={job} alt='job' />
                  <p className='text-xl font-bold Classico'>Caregivers</p>
                </div>

                <Radio checked={value === 2}></Radio>
              </div>
              <div className='mt-4'>
                <p className='mt-2 text-black text-start'>I am looking to find a job.</p>
              </div>
            </div>

          </div>
        </div>
        <div className='text-center'>
          <button
            style={{ background: '#85D1F1' }}
            className='mx-auto my-0 px-6 py-2 rounded-full font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110'
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
          <p className='mt-2 mb-10 font-normal text-base already-acc'>
            Already have an account?{' '}
            <NavLink to='/login' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <span className='hover:text-blue-600 underline transition-colors duration-300 cursor-pointer'>Log in</span>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}
