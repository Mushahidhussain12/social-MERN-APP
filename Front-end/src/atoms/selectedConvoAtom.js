import { atom } from "recoil";
export const selectedConvoAtom = atom({
    key: "selectedConvoAtom",
    default: {
        _id: "",
        userId: "",
        username: "",
        userProfilePic: "",
    },
});