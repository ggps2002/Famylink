import { CloseOutlined } from '@ant-design/icons'
import { Input, Button, Form } from 'antd'
import { useNavigate, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../Redux/authSlice'
import { fireToastMessage } from '../../toastContainer'
export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.auth)
  const handleGoBack = () => {
    navigate(-1) // Navigate back in history
  }
  const handleSubmit = async values => {
    try {
      const { user, status } = await dispatch(loginThunk(values)).unwrap()
      if (status == 200) {
        if (user.type == 'Nanny') {
          navigate('/nanny')
        } else if (user.type == 'Parents') {
          navigate('/family')
        } else {
          fireToastMessage({ type: 'error', message: 'This is not for admin' })
        }
      } 
    } catch (error) {
      fireToastMessage({ type: 'error', message: error.message })
    }
  }

  return (
    <div className='padd-res'>
      <div
        className='px-4 py-4 rounded-3xl'
        style={{
          background:
            'linear-gradient(174.22deg, rgba(158, 220, 225, 0.5) 0%, rgba(218, 244, 239, 0.4) 69.71%, rgba(239, 236, 230, 0.3) 100%)'
        }}
      >
        <div className='flex justify-end'>
          <button onClick={handleGoBack}>
            <CloseOutlined style={{ fontSize: '24px' }} />
          </button>
        </div>
        <div className='flex justify-center'>
          <div>
            <p className='px-3 width-form font-normal text-center Classico offer-font'>
              Log in to your Account
            </p>
            <div className='flex justify-center mt-10'>
              <Form name='loginForm' layout='vertical' onFinish={handleSubmit}>
                <div>
                  <p className='mb-1 text-xl capitalize Classico'>Email</p>
                  <Form.Item
                    name='email'
                    rules={[{ required: true, message: '' }]}
                  >
                    <Input
                      type={'email'}
                      placeholder={'Enter you email'}
                      className='py-4 border-none rounded-3xl input-width'
                    />
                  </Form.Item>
                </div>

                <div>
                  <p className='mb-1 text-xl capitalize Classico'>Password</p>
                  <Form.Item
                    name='password'
                    rules={[{ required: true, message: '' }]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password
                      placeholder='Enter you password'
                      className='py-4 border-none rounded-3xl input-width'
                    />
                  </Form.Item>
                  <p className='font-normal text-end mr-2 mt-2'>
                    <NavLink to='/forgetPass' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      <span className='hover:text-blue-600 underline transition-colors duration-300 cursor-pointer'>
                        Forgot password?
                      </span>
                    </NavLink>
                  </p>
                </div>

                <div className='my-5 text-center'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={isLoading}
                    className='mx-auto my-0 px-6 py-2 rounded-full w-48 font-normal text-base text-white transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110'
                    style={{ background: '#38AEE3', border: 'none' }}
                  >
                    Login
                  </Button>
                  <p className='mt-2 mb-10 font-normal text-base already-acc'>
                    New to Famylink? <NavLink to='/joinNow' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      <span className='hover:text-blue-600 underline transition-colors duration-300 cursor-pointer'>
                        Sign Up
                      </span>
                    </NavLink>

                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
