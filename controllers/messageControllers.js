import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

async function sendMessage(req, res) {
    try {
        const { message, recipientId } = req.body;
        const senderId = req.user._id;
        if (!message || !recipientId) throw "Missing fields";

        //await is only useFull for async nature methods that returns a promise first and then the actual data if the promise gets resolved

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        //If no existing conversation is found create a new one

        if (!conversation) {
            //new object or document for the conversation collection is being created

            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });

            //if doucument doesnt exist then save will create a new one but if it does then save will send perform the update operation for the modified fields.

            await conversation.save();
        }
        //Adding the sent message to the conversation and updating the lastMessage field of the conversation

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
        });

        //promise.all is basically used where the we have multiple await calls

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            }),
        ]);

        const recipientSocketId = getRecipientSocketId(recipientId);

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMessages(req, res) {
    const { otherUserId } = req.params;
    const userId = req.user._id;
    try {
        //now first we will extract the conversation between the both the users and based on that conversation, we will extract all of its messages

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        //and for extra check, if the conversation between the users doesnt exist

        if (!conversation) {
            return res.status(404).json({ error: "conversation not found" });
        }

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 });

        //this will arrange the newest message at the bottom

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getConversations(req, res) {
    const userId = req.user._id;
    try {
        const conversation = await Conversation.find({
            participants: userId,
        }).populate({
            path: "participants",
            select: "username profilePic",
        });

        //remove overselve from the participants array so that we can only display the image of other user in the conversation

        conversation.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participant) => participant._id.toString() !== userId.toString()
            );
        });

        res.status(200).json(conversation);
    } catch (error) {}
}

export { sendMessage, getMessages, getConversations };