import { atom } from "recoil";

const DivertUser = atom({
    key: "DivertUser",
    default: JSON.parse(localStorage.getItem("user-Threads")),
});
export { DivertUser };