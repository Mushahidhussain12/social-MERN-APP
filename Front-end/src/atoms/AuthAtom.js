import { RecoilRoot, atom } from "recoil";

const authScreen = atom({
    key: "authScreen",
    default: "Login",
});

export { authScreen };