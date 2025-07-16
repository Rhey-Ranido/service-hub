import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId is required" });

  try {
    let chat = await Chat.findOne({
      users: { $all: [req.user._id, userId], $size: 2 },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) return res.status(200).json(chat);

    const newChat = await Chat.create({ users: [req.user._id, userId] });
    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );
    res.status(201).json(fullChat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Accessing chat failed", error: err.message });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populated = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(populated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching chats failed", error: err.message });
  }
};
