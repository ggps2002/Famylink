import express from 'express'
import Auth from './Auth.js'
import UserData from './userData.js'
import Favourite from './favourite.js'
import Edit from './edit.js'
import Update from './Update.js'
import Payment from './payment.js'
import BookHire from './bookHire.js'
import Review from './reviews.js'
import Location from './location.js'
import Chat from './chat.js'
import Message from './message.js'
import Blog from './blogs.js'
import Community from './community.js'
import AdminUser from './adminUser.js'
import Verification from './verification.js'
import NannyShare from './nannyShare.js'
import PostJob from './postJob.js'
import Subscription from './subscription.js'
import Feedback from './feedback.js'
import Revenue from './revenue.js'

const router = express.Router()

router.use('/auth', Auth)
router.use('/userData', UserData)
router.use('/favourite', Favourite)
router.use('/edit', Edit)
router.use('/nannyShare', NannyShare)
router.use('/postJob', PostJob)
router.use('/reviews', Review)
router.use('/location', Location)
router.use('/update', Update)
router.use('/book-hire', BookHire)
router.use('/payment/stripe', Payment)
router.use('/chats', Chat)
router.use('/message', Message)
router.use('/blogs', Blog)
router.use('/community', Community)
router.use('/adminUser', AdminUser)
router.use('/verify', Verification)
router.use('/subscribe', Subscription)
router.use('/feedback', Feedback);
router.use('/revenue', Revenue)

export default router   