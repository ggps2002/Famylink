import express from 'express';
import Message from '../Schema/message.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { chatId, sender, content } = req.body;
        const newMessage = new Message({
            chatId,
            sender,
            content,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id).populate('chatId sender');
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content, seen, seenAt } = req.body;
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (content !== undefined) message.content = content;
        if (seen !== undefined) message.seen = seen;
        if (seenAt !== undefined) message.seenAt = seenAt;

        await message.save();
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
