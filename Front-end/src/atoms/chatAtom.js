import { atom } from "recoil";

export const chatAtom = atom({
    key: "conversation",
    default: null,
});

export const selectedConversationAtom = atom({
    key: "selectedConversationAtom",
    default: {
        _id: "",
        userId: "",
        username: "",
        userProfilePic: "",
    },
});