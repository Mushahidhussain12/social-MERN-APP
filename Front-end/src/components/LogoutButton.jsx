import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { DivertUser } from "../atoms/DivertUser";
import { useToast } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function LogoutButton() {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const setState = useSetRecoilState(DivertUser);
  async function handle() {
    try {
      setLoading(true);
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      if (data.message) {
        localStorage.removeItem("user-Threads");
        setState(null);
        toast({
          title: "success",
          description: data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate("/");
    }
  }
  return (
    <Button isLoading={loading} size={"sm"} onClick={handle}>
      <FiLogOut />
    </Button>
  );
}

export default LogoutButton;
