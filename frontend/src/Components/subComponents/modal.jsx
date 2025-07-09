import React, { useCallback, useEffect, useState } from 'react'
import { Form, Modal, Input, Button, Checkbox, Radio, Select } from 'antd'
import { InputOTP } from 'antd-input-otp'
import { RightOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { getSaveCardThunk, saveCardThunk } from '../Redux/cardSlice'
import { fireToastMessage } from '../../toastContainer'
import {
  updateEmailNotiThunk,
  updateEmailThunk,
  updatePasswordThunk,
  updatePhoneThunk
} from '../Redux/updateSlice'
import {
  refreshTokenThunk,
  sendOtpThunk,
  verifyOtpThunk,
  verifyUserThunk
} from '../Redux/authSlice'
import useSocket from '../../Config/socket'
const App = ({ head, enable, withDraw, payNow }) => {
  const dispatch = useDispatch()
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px'
      }
    }
  }
  const { socket } = useSocket()

  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRemoveImage = side => {
    if (side === 'front') {
      setFrontImage(null)
    } else if (side === 'back') {
      setBackImage(null)
    }
  }

  const onDrop = useCallback(
    (acceptedFiles, side) => {
      if (side === 'front' && frontImage) {
        alert('You can only upload one image for the front side.')
        return
      }
      if (side === 'back' && backImage) {
        alert('You can only upload one image for the back side.')
        return
      }

      const imageFile = acceptedFiles[0]
      if (imageFile && imageFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          if (side === 'front') {
            setFrontImage(reader.result)
          } else if (side === 'back') {
            setBackImage(reader.result)
          }
        }
        reader.readAsDataURL(imageFile)
      }
    },
    [frontImage, backImage]
  )

  const { getRootProps: getFrontRootProps, getInputProps: getFrontInputProps } =
    useDropzone({
      onDrop: acceptedFiles => onDrop(acceptedFiles, 'front'),
      accept: 'image/*'
    })

  const { getRootProps: getBackRootProps, getInputProps: getBackInputProps } =
    useDropzone({
      onDrop: acceptedFiles => onDrop(acceptedFiles, 'back'),
      accept: 'image/*'
    })

  const elements = useElements()
  const stripe = useStripe()
  const { user } = useSelector(s => s.auth)
  const [timeLeft, setTimeLeft] = useState(120) // 120 seconds for 2 minutes
  const [isResendEnabled, setIsResendEnabled] = useState(false)
  const trueKeys = Object.entries(user?.notifications?.email)
    .filter(([key, value]) => value === true)
    .map(([key]) => key)
  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendEnabled(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleResend = async () => {
    setLoading(true)
    try {
      const { data, status } = await dispatch(sendOtpThunk()).unwrap()
      if (status === 200) {
        setLoading(false)
        fireToastMessage({ success: true, message: data.message })
        setTimeLeft(120) // Reset timer to 2 minutes
        setIsResendEnabled(false)
      } else {
        setLoading(false)
        fireToastMessage({ type: 'error', message: data.message })
      }
    } catch (error) {
      setLoading(false)
      fireToastMessage({ type: 'error', message: error.message })
    }
  }

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(0)
  const options = [
    { label: 'New Messages', value: 'newMessage' },
    { label: 'Background Checks', value: 'backgroundCheck' },
    { label: 'Safety Notifications', value: 'safetyNoti' },
    { label: 'New Recommended Listings', value: 'newRecoLists' },
    { label: 'Tips and Tricks', value: 'tipsAndTricks' },
    { label: 'References', value: 'ref' },
    { label: 'Disabled Account Info', value: 'disAccInfo' },
    { label: 'New Subscriber in area', value: 'newSubInArea' },
    // { label: 'Payrolls', value: 'payrolls' }
  ]

  const showModal = () => {
    setStep(0)
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setStep(0)
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setStep(0)
    setIsModalOpen(false)
  }
  const deleteAccount = () => {
  }
  const billingMethod = async () => {
  
    if (step == 0 && head == 'Email Verification') {
      setLoading(true)
      try {
        const { data, status } = await dispatch(sendOtpThunk()).unwrap()
        if (status === 200) {
          fireToastMessage({ success: true, message: data.message })
          setTimeLeft(120)
          setStep(prevStep => prevStep + 1)
          setLoading(false)
        } else {
          setLoading(false)
          fireToastMessage({ type: 'error', message: data.message })
        }
      } catch (error) {
        setLoading(false)
        fireToastMessage({ type: 'error', message: error.message })
      }
    } else if (step == 1 && paymentMethod == 'paymentCard') {
      setTimeLeft(120)
      setStep(prevStep => prevStep + 1)
    } else if (step == 1 && paymentMethod == 'paypal') {
      handleCancel()
    } else if (head != 'Email Verification') {
      setStep(prevStep => prevStep + 1)
    }
  }
  const [paymentMethod, setPaymentMethod] = useState('paymentCard')

  const handlePaymentChange = e => {
    setPaymentMethod(e.target.value)
  }

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      currentEmail: user?.email,
      emailOtp: user?.email,
      currentPhoneNumber: user?.phoneNo,
      emailNotification: trueKeys
    })
  }, [user, form])
  const onFinish = async values => {
    if (!stripe || !elements) return
    if (head == 'Payments') {
      const cardNumberElement = elements.getElement(CardNumberElement)
      const cardExpiryElement = elements.getElement(CardExpiryElement)
      const cardCvcElement = elements.getElement(CardCvcElement)
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          email: user?.email,
          name: `${values.firstName} ${values.lastName}`,
          address: {
            postal_code: values.postalCode,
            country: values.country,
            line1: values.addressLine,
            city: values.city
          }
        }
      })

      if (error) {
        console.error(error)
        return setError(error.message)
      } else {
        // Send paymentMethod.id and email to the backend to save
        const { data, status } = await dispatch(
          saveCardThunk(paymentMethod)
        ).unwrap()
        if (status == 200) {
          fireToastMessage({ success: true, message: data.message })
          await dispatch(getSaveCardThunk())
          setStep(0)

          setIsModalOpen(false)
        } else {
          fireToastMessage({ error: true, message: data.message })
        }
      }
    }
    if (head === 'Email') {
      const { currentEmail, newEmail } = values
      setLoading(true)
      try {
        // Attempt to update the email
        const { data, status } = await dispatch(
          updateEmailThunk({ currentEmail, newEmail })
        ).unwrap()
        if (status === 200) {
          setLoading(false)
          form.resetFields()
          fireToastMessage({ success: true, message: data.message })
          dispatch(refreshTokenThunk())
          setStep(0)
          setIsModalOpen(false)
        } else {
          setLoading(false)
          fireToastMessage({ type: 'error', message: data.message })
        }
      } catch (error) {
        // Handle error here
        console.error('Error updating email:', error)
        fireToastMessage({
          type: 'error',
          message:
            error.message || 'An error occurred while updating the email.'
        })
        setLoading(false)
      }
    }
    if (head == 'Password') {
      const { currentPassword, newPassword } = values
      setLoading(true)
      try {
        const { data, status } = await dispatch(
          updatePasswordThunk({ currentPassword, newPassword })
        ).unwrap()
        if (status === 200) {
          setLoading(false)
          form.resetFields()
          fireToastMessage({ success: true, message: data.message })
          dispatch(refreshTokenThunk())
          setStep(0)
          setIsModalOpen(false)
        } else {
           setLoading(false)
          fireToastMessage({ type: 'error', message: data.message })
        }
      } catch (error) {
         setLoading(false)
        // Handle error here
        console.error('Error updating email:', error)
        fireToastMessage({
          type: 'error',
          message:
            error.message || 'An error occurred while updating the password.'
        })
      }
    }
    if (head == 'Phone Number') {
      const { phoneNo } = values
      setLoading(true)
      try {
        const { data, status } = await dispatch(
          updatePhoneThunk({ phoneNo })
        ).unwrap()
        if (status === 200) {
          form.resetFields()
          fireToastMessage({ success: true, message: data.message })
          dispatch(refreshTokenThunk())
          setStep(0)
          setIsModalOpen(false)
           setLoading(false)
        } else {
          fireToastMessage({ type: 'error', message: data.message })
           setLoading(false)
        }
      } catch (error) {
        // Handle error here
        console.error('Error updating email:', error)
        fireToastMessage({
          type: 'error',
          message:
            error.message || 'An error occurred while updating the password.'
        })
         setLoading(false)
      }
    }

    if (head === 'Email Verification') {
      let { oneTimePass } = values
      setLoading(true)
      oneTimePass = oneTimePass.join('')
      try {
        const { data, status } = await dispatch(
          verifyOtpThunk({ oneTimePass })
        ).unwrap()
        if (status === 200) {
          form.resetFields()
          fireToastMessage({ success: true, message: data.message })
          dispatch(refreshTokenThunk())
          setStep(0)
          setLoading(false)
          setIsModalOpen(false)
        } else {
          setLoading(false)
          fireToastMessage({ type: 'error', message: data.message })
        }
      } catch (error) {
        setLoading(false)
        fireToastMessage({ type: 'error', message: error.message })
      }
    }
    if (head == 'Email Notification') {
      setLoading(true)
      let { emailNotification } = values
      try {
        const { data, status } = await dispatch(
          updateEmailNotiThunk({ emailNotification })
        ).unwrap()
        if (status === 200) {
          setLoading(false)
          form.resetFields()
          fireToastMessage({ success: true, message: data.message })
          dispatch(refreshTokenThunk())
          setStep(0)
          setIsModalOpen(false)
        } else {
          setLoading(false)
          fireToastMessage({ type: 'error', message: data.message })
        }
      } catch (error) {
        fireToastMessage({ type: 'error', message: error.message })
        setLoading(false)
      }
    }
    if (head == 'National ID') {
      if (!frontImage || !backImage) {
        fireToastMessage({
          type: 'error',
          message: 'Please upload both images.'
        })
        return
      }

      // Convert base64 to File
      const base64ToFile = (base64, fileName) => {
        const arr = base64.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], fileName, { type: mime })
      }

      const frontFile = base64ToFile(frontImage, 'frontImage.png')
      const backFile = base64ToFile(backImage, 'backImage.png')
      // Create FormData
      const formData = new FormData()
      formData.append('frontImage', frontFile)
      formData.append('backImage', backFile)
      try {
        setLoading(true)
        const { data } = await dispatch(verifyUserThunk(formData)).unwrap()
        await new Promise((resolve, reject) => {
          const updateContent = {
            senderId: user._id,
            content: 'Send a request for National ID verification',
            type: 'Verification'
          }

          socket.emit(
            'sendNotificationToAdmin',
            { content: updateContent },
            response => {
              resolve()
            }

          )
          fireToastMessage({ message: data.message })
          setFrontImage(null)
          setBackImage(null)
          setIsModalOpen(false)
          setLoading(false)
          // Optionally handle errors if the callback isn't invoked
          setTimeout(() => reject(new Error('Socket emission timeout')), 5000)
        })
      } catch (err) {
        setLoading(false)
        fireToastMessage({ type: 'error', message: err.message })
      }
    }
  }
  return (
    <>
      {withDraw ? (
        <div
          style={{ color: '#FFFFFF', border: '1px solid #38AEE3' }}
          className={`flex justify-center items-center bg-[#38AEE3] hover:opacity-70 rounded-3xl ${payNow ? 'w-32 h-8' : 'w-48 h-10'
            }  text-center duration-300 cursor-pointer ..`}
          onClick={showModal}
        >
          <p className={payNow ? ' ' : 'text-xl'}>Add a Method</p>
        </div>
      ) : (
        <div
          style={{ background: '#F7F9FA' }}
          className='flex justify-between px-4 py-4 rounded-2xl w-80 cursor-pointer'
          onClick={showModal}
        >
          <p className='text-xl'>{head}</p>
          <RightOutlined />
        </div>
      )}

      <Modal
        className='overflow-auto'
        width={800}
        open={isModalOpen}
        footer={null}
        closeIcon={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {head == 'SMS' && (
          <p className='font-bold text-2xl'>{head} Notification</p>
        )}
        {head == 'Payments' && (
          <p className='font-bold text-2xl'>Billing & {head}</p>
        )}
        {head != 'SMS' &&
          head != 'Payments' &&
          head != 'Email Verification' && (
            <p className='font-bold text-2xl'>{head}</p>
          )}
        {head == 'Email Verification' && (
          <p className='font-bold text-2xl'>{head}</p>
        )}

        <Form onFinish={onFinish} autoComplete='off' form={form}>
          {head == 'Email' && (
            <p className='mt-4 mb-6 font-semibold text-4xl text-center Quicksand'>
              Update Email Address
            </p>
          )}
          {head == 'Password' && (
            <p className='mt-4 mb-6 font-semibold text-4xl text-center Quicksand'>
              Update Password
            </p>
          )}
          {head == 'Phone Number' && (
            <p className='mt-4 mb-6 font-semibold text-4xl text-center Quicksand'>
              Update Phone Number
            </p>
          )}
          {head == 'Delete Account' && (
            <p className='mt-4 mb-6 font-semibold text-4xl text-center Quicksand'>
              You are going to delete your account
            </p>
          )}
          {head == 'Email Notification' && (
            <div>
              <p className='mt-4 mb-1 font-semibold text-4xl text-center Quicksand'>
                Email Preferences
              </p>
              <p className='mb-2 font-semibold text-center Quicksand'>
                Select the emails you want to receive
              </p>
            </div>
          )}
          {head == 'SMS' && (
            <div>
              <p className='mt-4 mb-1 font-semibold text-4xl text-center Quicksand'>
                Text Notification Service
              </p>
              <p className='font-medium text-center Quicksand'>
                This service is currently{' '}
                <span className='font-semibold'>
                  {enable ? 'enabled.' : 'disabled.'}
                </span>{' '}
              </p>
              <p className='mb-2 font-medium text-center leading-5 Quicksand'>
                You'll get notifications when someone sends you a message.
              </p>
              <div className='flex justify-center'>
                <p className='width-modal-input text-center leading-5'>
                  By opting in, you understand that message frequency will vary
                  and message and data rates may apply. Reply “HELP” for help or
                  “STOP” to cancel. See{' '}
                  <span className='font-semibold underline'>
                    Mobile Terms of Service
                  </span>{' '}
                  &{' '}
                  <span className='font-semibold underline'>
                    Privacy Policy
                  </span>{' '}
                  for more details.
                </p>
              </div>
            </div>
          )}
          {head == 'Payments' && (
            <div>
              <p className='mt-4 mb-1 font-semibold text-4xl text-center Quicksand'>
                {step == 0 && 'Billing methods'}
                {step != 0 && 'Add a billing method'}
              </p>
              <div className='flex justify-center'>
                <p className='width-modal-input text-center leading-4'>
                  You haven't set up any billing methods yet. Add a method so
                  you can hire when you're ready.
                </p>
              </div>
              {step == 1 && (
                <div className='flex justify-center mt-6'>
                  <Radio.Group
                    onChange={handlePaymentChange}
                    value={paymentMethod}
                  >
                    <Radio
                      className='font-bold text-2xl leading-3'
                      value='paymentCard'
                    >
                      Payment Card{' '}
                      <span className='text-sm'>
                        (Visa, Mastercard, American Express, Discover, Diners)
                      </span>
                    </Radio>
                    <br />
                    <Radio className='font-bold text-2xl' value='paypal'>
                      PayPal
                    </Radio>
                  </Radio.Group>
                </div>
              )}
              {step == 2 && (
                <div className='flex justify-center'>
                  <div className='form-payment-width'>
                    <Radio
                      className='my-6 font-bold text-2xl leading-3'
                      value='paymentCard'
                      checked
                    >
                      Payment Card{' '}
                      <span className='text-sm'>
                        (Visa, Mastercard, American Express, Discover, Diners)
                      </span>
                    </Radio>
                    <p className='mb-1 font-semibold text-lg'>Card number</p>
                    <Form.Item
                      style={{ margin: 0, padding: 0 }}
                      name='cardNumber'
                      rules={[
                        {
                          required: false,
                          message: ''
                        }
                      ]}
                    >
                      <CardNumberElement
                        options={cardElementOptions}
                        className={`mb-4 py-2 rounded-3xl border-2 px-3`}
                      />
                    </Form.Item>
                    <div className='flex flex-wrap justify-between gap-x-3'>
                      <div>
                        <p className='mb-1 font-semibold text-lg'>First name</p>
                        <Form.Item
                          style={{ margin: 0, padding: 0 }}
                          name='firstName'
                          rules={[
                            {
                              required: true,
                              message: ''
                            }
                          ]}
                        >
                          <Input
                            type='text'
                            style={{ borderColor: '#D6DDEB' }}
                            className='border-2 mb-4 py-2 rounded-3xl width-modal-input1'
                            placeholder='John'
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <p className='mb-1 font-semibold text-lg'>Last name</p>
                        <Form.Item
                          style={{ margin: 0, padding: 0 }}
                          name='lastName'
                          rules={[
                            {
                              required: true,
                              message: ''
                            }
                          ]}
                        >
                          <Input
                            type='text'
                            style={{ borderColor: '#D6DDEB' }}
                            className='border-2 mb-4 py-2 rounded-3xl width-modal-input1'
                            placeholder='Doe'
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <p className='mb-1 font-semibold text-lg'>
                          Expiration date
                        </p>
                        <Form.Item
                          style={{ margin: 0, padding: 0 }}
                          name='exp_month'
                          rules={[
                            {
                              required: true,
                              message: ''
                            }
                          ]}
                        >
                          {/* <Input type='number' style={{ borderColor: "#D6DDEB" }} className='border-2 mb-4 py-2 rounded-3xl width-modal-input1' placeholder='MM' /> */}
                          <CardExpiryElement
                            options={cardElementOptions}
                            style={{ borderColor: '#D6DDEB' }}
                            className='border-2 mb-4 px-3 py-2 rounded-3xl width-modal-input1'
                          />
                        </Form.Item>
                      </div>
                      {/* <div>
                                                <p className='mb-1 font-semibold text-lg'>Expiry Year</p>
                                                <Form.Item
                                                    style={{ margin: 0, padding: 0 }}
                                                    name='exp_year'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: ''
                                                        },
                                                    ]}
                                                >
                                                    <Input type='number' style={{ borderColor: "#D6DDEB" }} className='border-2 mb-4 py-2 rounded-3xl width-modal-input1' placeholder='YY' />
                                                </Form.Item>
                                            </div> */}
                      <div>
                        <p className='mb-1 font-semibold text-lg'>
                          Security code
                        </p>
                        <Form.Item
                          style={{ margin: 0, padding: 0 }}
                          name='securityCode'
                          rules={[
                            {
                              required: false,
                              message: ''
                            }
                          ]}
                        >
                          <CardCvcElement
                            options={{
                              ...cardElementOptions,
                              placeholder: '123' // Customize your placeholder text here
                            }}
                            style={{ borderColor: '#D6DDEB' }}
                            className='border-2 mb-4 px-3 py-2 rounded-3xl width-modal-input1'
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <p className='my-6 font-bold text-2xl leading-3'>
                      Billing Address
                    </p>
                    <div>
                      <p className='mb-1 font-semibold text-lg'>Country</p>
                      <Form.Item
                        style={{ margin: 0, padding: 0 }}
                        name='country'
                        rules={[
                          {
                            required: true,
                            message: ''
                          }
                        ]}
                      >
                        <Select
                          className='custom-select1 mb-4'
                          style={{ borderColor: '#D6DDEB' }}
                          placeholder='Select a country'
                          dropdownClassName='custom-dropdown'
                        >
                          <Select.Option value='US'>
                            United States
                          </Select.Option>
                          <Select.Option value='CA'>Canada</Select.Option>
                          <Select.Option value='GB'>
                            United Kingdom
                          </Select.Option>
                          <Select.Option value='AU'>Australia</Select.Option>
                          {/* Add more countries as needed */}
                        </Select>
                      </Form.Item>
                    </div>
                    <p className='mb-1 font-semibold text-lg'>Address line 1</p>

                    <Form.Item
                      style={{ margin: 0, padding: 0 }}
                      name='addressLine'
                      rules={[
                        {
                          required: true,
                          message: ''
                        }
                      ]}
                    >
                      <Input
                        type='text'
                        style={{ borderColor: '#D6DDEB' }}
                        placeholder='America'
                        className='border-2 mb-4 py-2 rounded-3xl'
                      />
                    </Form.Item>
                    <div className='flex flex-wrap justify-between gap-x-3'>
                      <div>
                        <p className='mb-1 font-semibold text-lg'>City</p>
                        <Form.Item
                          style={{ margin: 0, padding: 0 }}
                          name='city'
                          rules={[
                            {
                              required: true,
                              message: ''
                            }
                          ]}
                        >
                          <Input
                            type='text'
                            style={{ borderColor: '#D6DDEB' }}
                            className='border-2 mb-4 py-2 rounded-3xl width-modal-input1'
                            placeholder='New York'
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <p className='mb-1 font-semibold text-lg'>
                          Postal code (optional)
                        </p>
                        <Form.Item
                          style={{ margin: 0, padding: 0 }}
                          name='postalCode'
                          rules={[
                            {
                              required: false,
                              message: ''
                            }
                          ]}
                        >
                          <Input
                            type='text'
                            style={{ borderColor: '#D6DDEB' }}
                            className='border-2 mb-4 py-2 rounded-3xl width-modal-input1'
                            placeholder='12345'
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {head == 'Email Verification' && (
            <div>
              <p className='mt-4 mb-1 font-semibold text-4xl text-center Quicksand'>
                {step == 0 && 'Request for OTP'}
                {step != 0 && 'Write OTP'}
              </p>
              {step == 0 && (
                <div className='flex justify-center'>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name='emailOtp'
                    rules={[
                      {
                        required: true,
                        message: ''
                      }
                    ]}
                    initialValue={user?.email}
                  >
                    <Input
                      type='email'
                      style={{ borderColor: '#D6DDEB' }}
                      readOnly
                      className='border-2 mt-4 py-2 rounded-3xl'
                      defaultValue={user?.email}
                    />
                  </Form.Item>
                </div>
              )}

              {step == 1 && (
                <div>
                  <Form.Item
                    style={{ margin: '20px 0 0 0', padding: 0 }}
                    name='oneTimePass'
                    rules={[{ required: true, message: '' }]}
                    className='mb-4'
                  >
                    <InputOTP length={4} width={1} inputType='numeric' />
                  </Form.Item>

                  <div className='flex justify-center items-center mt-2'>
                    {isResendEnabled ? (
                      <Button loading={loading} onClick={handleResend} type='primary'>
                        Resend OTP
                      </Button>
                    ) : (
                      <p className='text-gray-600'>
                        Resend OTP in {formatTime(timeLeft)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {head == 'National ID' && (
            <div className='flex flex-wrap justify-center gap-y-4 mt-4'>
              {/* Front Side */}
              <div className='border-gray-300 p-4 border rounded-lg w-full sm:w-1/2 h'>
                <h3 className='mb-4 font-medium text-gray-800 text-lg'>
                  Upload National ID (Front)
                </h3>
                {frontImage ? (
                  <div className='text-center'>
                    <img
                      src={frontImage}
                      alt='Front National ID'
                      className='mx-auto mb-4 rounded-lg w-full max-w-xs h-36 object-fit'
                    />
                    <button
                      onClick={() => handleRemoveImage('front')}
                      className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition'
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    className='flex flex-col items-center border-2 border-gray-300 p-4 border-dashed rounded-xl w-full h-36'
                    {...getFrontRootProps()}
                  >
                    <p className='mb-2 font-bold text-sm'>Upload Front Side</p>
                    <input {...getFrontInputProps()} />
                    <button
                      type='button'
                      className='flex items-center gap-2 bg-[#FCFCFC] px-4 py-2 border rounded-md font-bold'
                      style={{
                        boxShadow: '0px 12px 13px -6px #0000000A'
                      }}
                    >
                      <Upload
                        width={16}
                        height={16}
                        className='mx-auto object-fit-contain'
                      />
                      Click or drop image
                    </button>
                  </div>
                )}
              </div>

              {/* Back Side */}
              <div className='border-gray-300 p-4 border rounded-lg w-full sm:w-1/2'>
                <h3 className='mb-4 font-medium text-gray-800 text-lg'>
                  Upload National ID (Back)
                </h3>
                {backImage ? (
                  <div className='text-center'>
                    <img
                      src={backImage}
                      alt='Back National ID'
                      className='mx-auto mb-4 rounded-lg w-full h-36'
                    />
                    <button
                      onClick={() => handleRemoveImage('back')}
                      className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition'
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    className='flex flex-col items-center border-2 border-gray-300 p-4 border-dashed rounded-xl w-full h-36'
                    {...getBackRootProps()}
                  >
                    <p className='mb-2 font-bold text-sm'>Upload Back Side</p>
                    <input {...getBackInputProps()} />
                    <button
                      type='button'
                      className='flex items-center gap-2 bg-[#FCFCFC] px-4 py-2 border rounded-md font-bold'
                      style={{
                        boxShadow: '0px 12px 13px -6px #0000000A'
                      }}
                    >
                      <Upload
                        width={16}
                        height={16}
                        className='mx-auto object-fit-contain'
                      />
                      Click or drop image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className='flex justify-center'>
            <div>
              {head == 'Email' && (
                <div>
                  <p className='mb-1 font-semibold text-lg capitalize'>
                    Current Email
                  </p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name='currentEmail'
                    initialValue={user?.email}
                    rules={[
                      {
                        required: true,
                        message: ''
                      }
                    ]}
                  >
                    <Input
                      type='email'
                      style={{ borderColor: '#D6DDEB' }}
                      defaultValue={user?.email}
                      className='border-2 mb-4 py-2 rounded-3xl width-modal-input'
                    />
                  </Form.Item>
                  <p className='mb-1 font-semibold text-lg capitalize'>
                    New Email
                  </p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name='newEmail'
                    rules={[
                      {
                        required: true,
                        message: ''
                      }
                    ]}
                  >
                    <Input
                      type='email'
                      style={{ borderColor: '#D6DDEB' }}
                      placeholder={'thelumleyfamily123@gmail.com'}
                      className='border-2 py-2 rounded-3xl width-modal-input'
                    />
                  </Form.Item>
                </div>
              )}
              {head == 'Password' && (
                <div>
                  <p className='mb-1 font-semibold text-lg capitalize'>
                    Current Password
                  </p>
                  <Form.Item
                    name='currentPassword'
                    rules={[
                      {
                        required: true,
                        message: ''
                      }
                    ]}
                  >
                    <Input.Password
                      className='border-2 py-2 rounded-3xl width-modal-input'
                      placeholder='Current password'
                    />
                  </Form.Item>
                  <p className='mb-1 font-semibold text-lg capitalize'>
                    New Password
                  </p>
                  <Form.Item
                    name='newPassword'
                    rules={[
                      {
                        required: true,
                        message: ''
                      }
                    ]}
                  >
                    <Input.Password
                      className='border-2 py-2 rounded-3xl width-modal-input'
                      placeholder='New password'
                    />
                  </Form.Item>
                  <p className='mb-1 font-semibold text-lg capitalize'>
                    Confirm Password
                  </p>
                  <Form.Item
                    name='confirmPassword'
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: ''
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue('newPassword') === value
                          ) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error(''))
                        }
                      })
                    ]}
                  >
                    <Input.Password
                      className='border-2 py-2 rounded-3xl width-modal-input'
                      placeholder='Confirm password'
                    />
                  </Form.Item>
                </div>
              )}
              {head == 'Phone Number' && (
                <div>
                  {user?.phoneNo && (
                    <>
                      <p className='mb-1 font-semibold text-lg capitalize'>
                        Current Phone Number
                      </p>
                      <Form.Item
                        name='currentPhoneNumber'
                        rules={[
                          {
                            required: true,
                            message: ''
                          }
                        ]}
                        initialValue={user?.phoneNo}
                      >
                        <Input
                          type='text'
                          className='border-2 py-2 rounded-3xl width-modal-input'
                          defaultValue={user?.phoneNo}
                          readOnly
                          placeholder={'0800-78601'}
                        />
                      </Form.Item>
                    </>
                  )}

                  <p className='mb-1 font-semibold text-lg capitalize'>
                    {user?.phoneNo ? 'Phone Number' : 'New Phone Number'}
                  </p>
                  <Form.Item
                    name='phoneNo'
                    rules={[
                      {
                        required: true,
                        message: ''
                      }
                    ]}
                  >
                    <Input
                      type='text'
                      className='border-2 py-2 rounded-3xl width-modal-input'
                      placeholder='0800-78601'
                    />
                  </Form.Item>
                </div>
              )}
              {head == 'Delete Account' && (
                <p className='font-semibold'>
                  You won't be able to restore your data
                </p>
              )}
              {head === 'Email Notification' && (
                <Form.Item
                  style={{ margin: 0, padding: 0 }}
                  name='emailNotification'
                  initialValue={trueKeys} // Set default values in form
                >
                  <Checkbox.Group
                    options={options.map(option => ({
                      label: option.label, // Displayed label
                      value: option.value // Actual value
                    }))}
                    defaultValue={trueKeys} // Default checked values for form submission
                    className='py-2 rounded-3xl width-modal-input'
                    style={{ borderColor: '#D6DDEB' }}
                  />
                </Form.Item>
              )}

              <div className='flex justify-center mt-6 mb-2'>
                <Form.Item className='m-0 p-0'>
                  {head != 'Payments' && head != 'Email Verification' && (
                    <Button
                      style={{ color: '#38AEE3', border: '1px solid #38AEE3' }}
                      className='bg-[#FFFFFF] rounded-3xl'
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                  {head == 'Payments' && step != 0 && (
                    <Button
                      style={{ color: '#38AEE3', border: '1px solid #38AEE3' }}
                      className='bg-[#FFFFFF] rounded-3xl'
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}

                  {(head == 'Email' ||
                    head == 'Password' ||
                    head == 'Phone Number' ||
                    head == 'Email Notification') && (
                      <Button
                        type='primary'
                        htmlType='submit'
                        loading={loading}
                        className='bg-[#38AEE3] ml-2 px-6 rounded-3xl text-white'
                      >
                        Update
                      </Button>
                    )}
                  {head == 'Delete Account' && (
                    <Button
                      onClick={deleteAccount}
                      className='bg-[#FF3333] ml-2 px-6 rounded-3xl text-white'
                    >
                      Delete
                    </Button>
                  )}
                  {head == 'SMS' && enable ? (
                    <Button
                      onClick={deleteAccount}
                      className='bg-[#FF3333] ml-2 px-6 rounded-3xl text-white'
                    >
                      Disable
                    </Button>
                  ) : (
                    head == 'SMS' && (
                      <Button
                        type='primary'
                        className='bg-[#38AEE3] ml-2 px-6 rounded-3xl text-white'
                      >
                        Enable
                      </Button>
                    )
                  )}
                  {head == 'Payments' && (
                    <Button
                      type='primary'
                      htmlType={step == 2 && 'submit'}
                      className='bg-[#38AEE3] ml-2 px-6 rounded-3xl text-white'
                      onClick={billingMethod}
                    >
                      {step == 2 ? 'Save' : 'Add Billing Method'}
                    </Button>
                  )}
                  {head === 'Email Verification' && (
                    <Button
                      type='primary'
                      htmlType={step === 1 ? 'submit' : undefined}
                      loading={loading}
                      className='bg-[#38AEE3] ml-2 px-6 rounded-3xl text-white'
                      onClick={step === 0 ? billingMethod : undefined} // Ensures onClick is only set when step is 0
                    >
                      {step === 1 ? 'Verified' : 'Request for OTP'}
                    </Button>
                  )}
                  {head == 'National ID' && (
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      className='bg-[#38AEE3] ml-2 px-6 rounded-3xl text-white'
                    >
                      Verified
                    </Button>
                  )}
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}
export default App
