import { useEffect, useState } from 'react'
import rep from '../../../assets/images/reply.png'
import { ThumbsDown, ThumbsUp, EllipsisVertical } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteCommentThunk,
  deleteReplyThunk,
  editCommentThunk,
  editReplyThunk,
  fetchPostByIdThunk,
  postCommDislikeThunk,
  postCommentThunk,
  postCommLikeThunk,
  postReplyDislikeThunk,
  postReplyLikeThunk,
  replyCommentThunk
} from '../../Redux/communitySlice'
import Loader from '../../subComponents/loader'
import { formatDate, formatTime } from '../../subComponents/toCamelStr'
import { fireToastMessage } from '../../../toastContainer'
import { Dropdown, Menu } from 'antd'
import { SwalFireDelete } from '../../../swalFire'
import Avatar from 'react-avatar'
import useSocket from '../../../Config/socket'

export default function Post() {
  const { id, postId } = useParams()
  const { user } = useSelector(s => s.auth)
  const { socket } = useSocket()
  const { data, isLoading } = useSelector(state => state.community)
  const dispatch = useDispatch()
  const [to, setTo] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPostByIdThunk(postId))
    }
    fetchData()
  }, [dispatch, id, postId])

  const [showReply, setShowReply] = useState(false)
  const [showComm, setShowComm] = useState(false)
  const [editComm, setEditComm] = useState(null)
  const [editReply, setEditReply] = useState(null)

  const handleLike = async ({ post, id }) => {
    if (post) {
      try {
        const { message } = await dispatch(
          postCommLikeThunk({ id: postId })
        ).unwrap()
        await dispatch(fetchPostByIdThunk(postId))
        if (message == 'You liked this post') {
          await new Promise(async resolve => {
            const updateContent = {
              postId: data._id,
              senderId: user._id,
              receiverId: data.createdBy,
              content: 'like',
              type: 'Post'
            }
            socket?.emit(
              'sendNotification',
              { content: updateContent },
              resolve
            ) // Assuming resolve will be called after successful emit
          })
        }
      } catch (err) {
        fireToastMessage({ type: 'error', message: err.message })
      }
    } else {
      try {
        await dispatch(postCommLikeThunk({ id, comm: true }))
        await dispatch(fetchPostByIdThunk(postId))
      } catch (err) {
        fireToastMessage({ type: 'error', message: err.message })
      }
    }
  }

  const [textAreaValue, setTextAreaValue] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)

  const handlePostReply = async ({ id, update }) => {
    if (!textAreaValue.trim()) {
      setIsEmpty(true) // Mark the textarea as empty
    } else {
      setIsEmpty(false) // Reset empty state if value is present
      // Handle posting the reply here
      if (update && !editReply) {
        try {
          await dispatch(
            editCommentThunk({ comment: textAreaValue, commentId: id, postId })
          )
          await dispatch(fetchPostByIdThunk(postId))
          setTextAreaValue('')
          setEditComm(null)
        } catch (err) {
          fireToastMessage({ type: 'error', message: err.message })
        }
      }
      else if (update && editReply) {
        try {
          await dispatch(
            editReplyThunk({ comment: textAreaValue, commentId: editReply._id, postId, replyId: id })
          )
          await dispatch(fetchPostByIdThunk(postId))
          setTextAreaValue('')
          setEditComm(null)
          setEditReply(null)
        } catch (err) {
          fireToastMessage({ type: 'error', message: err.message })
        }
      }
      else if (showReply) {
        try {
          const { comment } = await dispatch(
            postCommentThunk({ comment: textAreaValue, id })
          ).unwrap()
          await dispatch(fetchPostByIdThunk(postId))
          setTextAreaValue('')
          setShowReply(false)
          await new Promise(async resolve => {
            const updateContent = {
              postId: data._id,
              senderId: user._id,
              receiverId: data.createdBy,
              commentId: comment._id,
              content: 'comment',
              type: 'Post'
            }
            socket?.emit(
              'sendNotification',
              { content: updateContent },
              resolve
            ) // Assuming resolve will be called after successful emit
          })
        } catch (err) {
          fireToastMessage({ type: 'error', message: err.message })
        }
      }
      else if (showComm) {
        try {
          await dispatch(
            replyCommentThunk({ comment: textAreaValue, id, to: to._id })
          ).unwrap()
          await dispatch(fetchPostByIdThunk(postId))
          setTextAreaValue('')
          setTo(null)
          setShowReply(false)
          setShowComm(false)
        } catch (err) {
          fireToastMessage({ type: 'error', message: err.message })
        }
      }
    }
  }

  const handleDisLike = async ({ post, id }) => {
    if (post) {
      try {
        const { message } = await dispatch(
          postCommDislikeThunk({ id: postId })
        ).unwrap()
        await dispatch(fetchPostByIdThunk(postId))
        if (message == 'You dislike this post') {
          await new Promise(async resolve => {
            const updateContent = {
              postId: data._id,
              senderId: user._id,
              receiverId: data.createdBy,
              content: 'dislike',
              type: 'Post'
            }
            socket?.emit(
              'sendNotification',
              { content: updateContent },
              resolve
            ) // Assuming resolve will be called after successful emit
          })
        }
      } catch (err) {
        fireToastMessage({ type: 'error', message: err.message })
      }
    } else {
      try {
        await dispatch(postCommDislikeThunk({ id, comm: true }))
        await dispatch(fetchPostByIdThunk(postId))
      } catch (err) {
        fireToastMessage({ type: 'error', message: err.message })
      }
    }
  }

  const handleReplyLike = async ({ replyId, commentId }) => {
    try {
      await dispatch(postReplyLikeThunk({ replyId, commentId }))
      await dispatch(fetchPostByIdThunk(postId))
    } catch (err) {
      fireToastMessage({ type: 'error', message: err.message })
    }
  }

  const handleReplyDislike = async ({ replyId, commentId }) => {
    try {
      await dispatch(postReplyDislikeThunk({ replyId, commentId }))
      await dispatch(fetchPostByIdThunk(postId))
    } catch (err) {
      fireToastMessage({ type: 'error', message: err.message })
    }
  }

  const handleMenuClick = (key, record, replyId) => {
    if (key === 'edit' && !replyId) {
      setEditComm(record)
      setShowReply(false)
      setShowComm(false)
    } else if (key === 'delete' && !replyId) {
      const handleDelete = async () => {
        try {
          await dispatch(deleteCommentThunk({ postId, commentId: record._id }))
          await dispatch(fetchPostByIdThunk(postId))
        } catch (err) {
          fireToastMessage({ type: 'error', message: err.message })
        }
      }
      SwalFireDelete({
        title: 'Are you sure for delete this comment',
        handleDelete
      })
    } else if (key === 'delete' && replyId) {
      const handleDelete = async () => {
        try {
          await dispatch(deleteReplyThunk({ postId, commentId: record._id, replyId: replyId._id }))
          await dispatch(fetchPostByIdThunk(postId))
        } catch (err) {
          fireToastMessage({ type: 'error', message: err.message })
        }
      }
      SwalFireDelete({
        title: 'Are you sure for delete this comment',
        handleDelete
      })
    } else if (key === 'edit' && replyId) {
      setEditComm(replyId)
      setEditReply(record)
      setShowReply(false)
      setShowComm(false)
    }
  }
  const toggleReply = () => {
    setEditComm(null)
    setShowReply(true)
    setShowComm(false)
  }

  const toggleCommReply = () => {
    setEditComm(null)
    setShowReply(false)
    setShowComm(true)
  }
  return (
    <div className='my-10 padding-navbar1 Quicksand'>
      {!isLoading ? (
        <div className='shadow-2xl py-10 rounded-2xl padding-sub'>
          <div
            style={{ border: '1px solid #D6DDEB' }}
            className='p-8 rounded-2xl'
          >
            <p className='font-bold lg:text-3xl text-2xl'>Post {id}</p>
            <p className='mt-3 font-normal leading-5'>{data?.description}</p>
            <div className='flex flex-wrap justify-between items-end gap-y-4 mt-4'>
              <div className='flex space-x-4'>
                <button
                  onClick={() => handleLike({ post: true })}
                  className='flex items-center space-x-1 text-gray-600'
                >
                  <ThumbsUp
                    className='w-4'
                    color={data?.likes?.includes(user._id) ? 'blue' : 'black'}
                  />
                  <span className='font-normal text-sm'>
                    {data?.likes?.length}
                  </span>
                </button>
                <button
                  onClick={() => handleDisLike({ post: true })}
                  className='flex items-center space-x-1 text-gray-600'
                >
                  <ThumbsDown
                    color={
                      data?.dislikes?.includes(user._id) ? 'blue' : 'black'
                    }
                    className='w-4'
                  />
                  <span className='font-normal text-sm'>
                    {data?.dislikes?.length}
                  </span>
                </button>
                <button
                  onClick={toggleReply}
                  className='flex items-center space-x-1 text-gray-600'
                >
                  <span>
                    <img className='w-4 object-contain' src={rep} alt='rep' />
                  </span>
                  <span className='font-normal text-sm'>Reply</span>
                </button>
              </div>
              <div className='text-post-right text-gray-500'>
                <p className='text-black leading-5'>
                  Created by: <span className='font-semibold'>Admin</span>
                </p>
                <p className='text-black leading-5'>
                  Posted on:{' '}
                  <span className='font-semibold'>
                    {formatDate(data?.createdAt)} @{' '}
                    {formatTime(data?.createdAt)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* <div
            style={{ border: '1px solid #D6DDEB' }}
            className='mt-10 p-8 rounded-2xl'
          >
            <div className='flex items-start gap-x-4 gap-y-4'>
              <img
                src={s1}
                alt='User Avatar'
                className='rounded-full object-cover profile-img'
              />

              <div>
                <p className='font-bold text-2xl capitalize leading-5'>
                  Samantha Lawrence
                </p>
                <div
                  style={{ border: '1px solid #D6DDEB', color: '#878A99' }}
                  className='mt-4 px-4 py-2 rounded-3xl'
                >
                  <p className='font-semibold leading-5'>
                    Reply to samnatha_lawrence
                  </p>
                  <p className='font-light text-sm leading-5'>
                    “Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.”
                  </p>
                </div>
                <div>
                  <p className='mt-3 font-normal leading-5'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <div className='flex flex-wrap justify-between items-end gap-y-4 mt-6'>
                    <div className='flex space-x-4'>
                      <button
                        onClick={handleLike}
                        className='flex items-center space-x-1 text-gray-600'
                      >
                        <ThumbsUp
                          className='w-4'
                          color={likes ? 'blue' : 'black'}
                        />
                        <span className='font-normal text-sm'>
                          {likes ? '1' : '0'}
                        </span>
                      </button>
                      <button
                        onClick={handleDisLike}
                        className='flex items-center space-x-1 text-gray-600'
                      >
                        <ThumbsDown
                          color={disLikes ? 'blue' : 'black'}
                          className='w-4'
                        />
                        <span className='font-normal text-sm'>
                          {disLikes ? '1' : '0'}
                        </span>
                      </button>
                      <button
                        onClick={toggleReply}
                        className='flex items-center space-x-1 text-gray-600'
                      >
                        <span>
                          <img
                            className='w-4 object-contain'
                            src={rep}
                            alt='rep'
                          />
                        </span>
                        <span className='font-normal text-sm'>Reply</span>
                      </button>
                    </div>
                    <div className='text-post-right text-gray-500'>
                      <p className='text-black leading-5'>
                        Posted on:{' '}
                        <span className='font-semibold'>
                          20 June 2024 @ 9:30am
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {data?.comments?.length > 0 &&
            data?.comments.map((v) => (
              <div
                style={{ border: '1px solid #D6DDEB' }}
                className='mt-10 p-8 rounded-2xl'

                key={v._id}
              >
                <div className='flex justify-between items-start'>
                  <div className='flex items-start gap-x-4 gap-y-4'>
                    {v?.user?.imageUrl ? (
                      <img
                        src={v?.user?.imageUrl}
                        alt='User Avatar'
                        className='rounded-full object-cover lg:h-[80px] lg:w-[20px] w-[40px] h-[20px]'
                      />
                    ) : (
                      <Avatar
                        className='rounded-full object-cover size-[20px]'
                        color={'#38AEE3'}
                        name={
                          v?.user?.name
                            ?.split(' ') // Split by space
                            .slice(0, 2) // Take first 1–2 words
                            .join(' ')   // Re-join them
                        }
                      />
                    )}

                    <div>
                      <p className='font-bold text-2xl capitalize leading-5'>
                        {v?.user?.name}
                      </p>
                      <p className='mt-3 font-normal leading-5'>{v?.comment}</p>
                      <div className='space-y-4 mt-6'>
                        <div className='flex items-center space-x-4'>
                          <button
                            onClick={() => handleLike({ id: v._id })}
                            className='flex items-center space-x-1 text-gray-600'
                          >
                            <ThumbsUp
                              className='w-4'
                              color={
                                v?.likes?.includes(user._id) ? 'blue' : 'black'
                              }
                            />
                            <span className='font-normal text-sm'>
                              {v?.likes?.length}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDisLike({ id: v._id })}
                            className='flex items-center space-x-1 text-gray-600'
                          >
                            <ThumbsDown
                              color={
                                v?.dislikes?.includes(user._id)
                                  ? 'blue'
                                  : 'black'
                              }
                              className='w-4'
                            />
                            <span className='font-normal text-sm'>
                              {v?.dislikes?.length}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              toggleCommReply();
                              setTo(v.user);
                            }}
                            className='flex items-center space-x-1 text-gray-600'
                          >
                            <span>
                              <img className='w-4 object-contain' src={rep} alt='rep' />
                            </span>
                            <span className='font-normal text-sm'>Reply</span>
                          </button>
                        </div>
                        <div className='text-post-right text-gray-500'>
                          <p className='text-black leading-5'>
                            Posted on:{' '}
                            <span className='font-semibold'>
                              {formatDate(v?.createdAt)} @{' '}
                              {formatTime(v?.createdAt)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>

                    {v.user._id == user._id && (
                      <Dropdown
                        overlayStyle={{
                          padding: 0,
                          margin: 0,
                          textAlign: 'center'
                        }}
                        overlay={
                          <Menu
                            onClick={({ key }) => handleMenuClick(key, v)}
                            items={[
                              {
                                key: 'edit',
                                label: (
                                  <span style={{ color: 'black' }}>
                                    Edit
                                    <hr className='w-full' />
                                  </span>
                                )
                              },
                              {
                                key: 'delete',
                                label: (
                                  <span style={{ color: 'red' }}>Delete</span>
                                )
                              }
                            ]}
                          />
                        }
                        trigger={['click']}
                      >
                        <EllipsisVertical
                          style={{ fontSize: '18px', cursor: 'pointer' }}
                        />
                      </Dropdown>
                    )}
                  </div>
                </div>
                {
                  v.replies?.length > 0 &&
                  v?.replies.map((r) => (
                    <div key={r._id} className='flex mt-8 gap-x-4 gap-y-4' >
                      {r?.user?.imageUrl ? (
                        <img
                          src={r?.user?.imageUrl}
                          alt='User Avatar'
                          className='rounded-full object-cover profile-img'
                        />
                      ) : (
                        <Avatar
                          className='rounded-full object-cover profile-img'
                          color={'#38AEE3'}
                          name={
                            r?.user?.name
                              ?.split(' ') // Split by space
                              .slice(0, 2) // Take first 1–2 words
                              .join(' ')   // Re-join them
                          }
                        />
                      )}

                      <div className='w-full flex-1'>
                        <p className='font-bold  text-2xl capitalize leading-5'>
                          {r?.user?.name}
                        </p>
                        <div style={{ border: '1px solid #D6DDEB' }} className='mt-3 p-2 rounded-xl w-full'>
                          <p className='text-[#878A99] mb-2'>Reply to {r?.replyTo?.name}</p>
                          <p className=' font-normal leading-5'>{r?.comment}</p>
                        </div>

                        <div className='space-y-4 mt-6'>
                          <div className='flex items-center space-x-4'>
                            <button
                              onClick={() => handleReplyLike({ replyId: r._id, commentId: v._id })}
                              className='flex items-center space-x-1 text-gray-600'
                            >
                              <ThumbsUp
                                className='w-4'
                                color={
                                  r?.likes?.includes(user._id) ? 'blue' : 'black'
                                }
                              />
                              <span className='font-normal text-sm'>
                                {r?.likes?.length}
                              </span>
                            </button>
                            <button
                              onClick={() => handleReplyDislike({ replyId: r._id, commentId: v._id })}
                              className='flex items-center space-x-1 text-gray-600'
                            >
                              <ThumbsDown
                                color={
                                  r?.dislikes?.includes(user._id)
                                    ? 'blue'
                                    : 'black'
                                }
                                className='w-4'
                              />
                              <span className='font-normal text-sm'>
                                {r?.dislikes?.length}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                toggleCommReply();
                                setTo(r.user);
                              }}
                              className='flex items-center space-x-1 text-gray-600'
                            >
                              <span>
                                <img className='w-4 object-contain' src={rep} alt='rep' />
                              </span>
                              <span className='font-normal text-sm'>Reply</span>
                            </button>
                          </div>
                          <div className='text-post-right text-gray-500'>
                            <p className='text-black leading-5'>
                              Posted on:{' '}
                              <span className='font-semibold'>
                                {formatDate(r?.createdAt)} @{' '}
                                {formatTime(r?.createdAt)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>

                        {r.user._id == user._id && (
                          <Dropdown
                            overlayStyle={{
                              padding: 0,
                              margin: 0,
                              textAlign: 'center'
                            }}
                            overlay={
                              <Menu
                                onClick={({ key }) => handleMenuClick(key, v, r)}
                                items={[
                                  {
                                    key: 'edit',
                                    label: (
                                      <span style={{ color: 'black' }}>
                                        Edit
                                        <hr className='w-full' />
                                      </span>
                                    )
                                  },
                                  {
                                    key: 'delete',
                                    label: (
                                      <span style={{ color: 'red' }}>Delete</span>
                                    )
                                  }
                                ]}
                              />
                            }
                            trigger={['click']}
                          >
                            <EllipsisVertical
                              style={{ fontSize: '18px', cursor: 'pointer' }}
                            />
                          </Dropdown>
                        )}
                      </div>
                    </div>
                  ))
                }
                {(showComm) && (
                  <div
                    style={{ border: '1px solid #D6DDEB' }}
                    className='mt-10 p-8 rounded-2xl'
                  >
                    <div className='flex flex-wrap items-start gap-4'>
                      {user?.imageUrl ? (
                        <img
                          src={user?.imageUrl}
                          alt='User Avatar'
                          className='rounded-full object-cover profile-img'
                        />
                      ) : (
                        <Avatar
                          className='rounded-full object-cover profile-img'
                          color={'#38AEE3'}
                          name={
                            user?.name
                              ?.split(' ') // Split by space
                              .slice(0, 2) // Take first 1–2 words
                              .join(' ')   // Re-join them
                          }
                        />
                      )}
                      <div className='flex-1'>
                        <p className='font-bold text-2xl capitalize leading-5'>
                          {user?.name}
                        </p>

                        <textarea
                          rows='3'
                          value={textAreaValue}
                          onChange={e => setTextAreaValue(e.target.value)}
                          style={{ resize: 'none' }}
                          className={`w-full p-2 mt-2 border rounded-lg focus:outline-none ${isEmpty ? 'border-red-500' : ''
                            }`}
                          placeholder={`Reply to ${to.name}`}
                        />
                      </div>
                    </div>
                    <div className='flex justify-end gap-4 mt-2'>
                      <button
                        style={{ border: '1px solid #38AEE3' }}
                        className='hover:opacity-90 px-4 py-2 rounded-full w-28 text-black transition duration-150 ease-in-out'
                        onClick={() => {
                          setEditComm(null)
                          setEditReply(null)
                          setShowReply(false)
                          setShowComm(false)
                          setTextAreaValue(null)
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ background: '#38AEE3' }}
                        className='hover:opacity-90 px-4 py-2 rounded-full w-28 text-white transition duration-150 ease-in-out'
                        onClick={() => handlePostReply({ id: v._id })}
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}

          {(showReply) && (
            <div
              style={{ border: '1px solid #D6DDEB' }}
              className='mt-10 p-8 rounded-2xl'
            >
              <div className='flex flex-wrap items-start gap-4'>
                {user?.imageUrl ? (
                  <img
                    src={user?.imageUrl}
                    alt='User Avatar'
                    className='rounded-full object-cover profile-img'
                  />
                ) : (
                  <Avatar
                    className='rounded-full object-cover profile-img'
                    color={'#38AEE3'}
                    name={
                      user?.name
                        ?.split(' ') // Split by space
                        .slice(0, 2) // Take first 1–2 words
                        .join(' ')   // Re-join them
                    }
                  />
                )}
                <div className='flex-1'>
                  <p className='font-bold text-2xl capitalize leading-5'>
                    {user?.name}
                  </p>

                  <textarea
                    rows='3'
                    value={textAreaValue}
                    onChange={e => setTextAreaValue(e.target.value)}
                    style={{ resize: 'none' }}
                    className={`w-full p-2 mt-2 border rounded-lg focus:outline-none ${isEmpty ? 'border-red-500' : ''
                      }`}
                    placeholder={`Reply to Post ${id}`}
                  />
                </div>
              </div>
              <div className='flex justify-end gap-4 mt-2'>
                <button
                  style={{ border: '1px solid #38AEE3' }}
                  className='hover:opacity-90 px-4 py-2 rounded-full w-28 text-black transition duration-150 ease-in-out'
                  onClick={() => {
                    setEditComm(null)
                    setShowReply(false)
                    setShowComm(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{ background: '#38AEE3' }}
                  className='hover:opacity-90 px-4 py-2 rounded-full w-28 text-white transition duration-150 ease-in-out'
                  onClick={() => handlePostReply({ id: data._id })}
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}
          {editComm && (
            <div
              style={{ border: '1px solid #D6DDEB' }}
              className='mt-10 p-8 rounded-2xl'
            >
              <div className='flex flex-wrap items-start gap-4'>
                {editComm?.user?.imageUrl ? (
                  <img
                    src={editComm?.user?.imageUrl}
                    alt='User Avatar'
                    className='rounded-full object-cover profile-img'
                  />
                ) : (
                  <Avatar
                    className='rounded-full object-cover profile-img'
                    color={'#38AEE3'}
                    name={
                      editComm?.user?.name
                        ?.split(' ') // Split by space
                        .slice(0, 2) // Take first 1–2 words
                        .join(' ')   // Re-join them
                    }
                  />
                )}
                <div className='flex-1'>
                  <p className='font-bold text-2xl capitalize leading-5'>
                    {editComm?.user?.name}
                  </p>

                  <textarea
                    rows='3'
                    value={textAreaValue || editComm.comment} // Default to `editComm.comment` if `textAreaValue` is empty
                    onChange={e => setTextAreaValue(e.target.value)}
                    style={{ resize: 'none' }}
                    className={`w-full p-2 mt-2 border rounded-lg focus:outline-none ${isEmpty ? 'border-red-500' : ''
                      }`}
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-end gap-4 mt-2'>
                <button
                  style={{ border: '1px solid #38AEE3' }}
                  className='hover:opacity-90 px-4 py-2 rounded-full w-36 text-black transition duration-150 ease-in-out'
                  onClick={() => {
                    setEditComm(null)
                    setShowReply(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{ background: '#38AEE3' }}
                  className='hover:opacity-90 px-4 py-2 rounded-full w-36 text-white transition duration-150 ease-in-out'
                  onClick={() =>
                    handlePostReply({ id: editComm._id, update: true })
                  }
                >
                  Update Reply
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  )
}
