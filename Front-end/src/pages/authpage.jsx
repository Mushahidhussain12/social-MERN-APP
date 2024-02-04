import { Box } from "@chakra-ui/react";
import Signup from "../components/signup";
import Login from "../components/login";
import { useRecoilValue } from "recoil";
import { authScreen } from "../atoms/AuthAtom";
function Auth() {
  const authstate = useRecoilValue(authScreen);
  return <>{authstate === "signup" ? <Signup /> : <Login />}</>;
}
export default Auth;
