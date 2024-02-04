import "../index.css";
import {
  Flex,
  VStack,
  Box,
  Text,
  MenuButton,
  MenuList,
  Button,
  ButtonGroup,
  ToastProvider,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { CgMoreO } from "react-icons/cg";
import { BsInstagram } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Menu, Portal, MenuItem, useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { DivertUser } from "../atoms/DivertUser";

function UserPageHead({ user }) {
  const currentLoggedUser = useRecoilValue(DivertUser);

  //this state will check on the first render, if the user is already following (from database data) then render unfollow button, and if its not then render follow button

  const [following, setFollowing] = useState(
    user.followers.includes(currentLoggedUser?._id)
  );
  const [update, setUpdate] = useState(false);
  const toast = useToast();
  const showtoast = useShowToast();

  function copy() {
    const URL = window.location.href;
    navigator.clipboard.writeText(URL);
    toast({
      title: "Copied to the Clipboard",
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  }

  async function follow() {
    if (!currentLoggedUser) {
      showtoast("Error", "please login to follow", "error");
      return;
    }
    if (update) return;
    setUpdate(true);
    try {
      const response = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.message) {
        showtoast("Success", data.message, "success");

        //we are setting setfollowing manually because state will only get values from server on the first render as the default value

        setFollowing(!following);
      }
      if (data.error) {
        showtoast("error", data.error, "error");
      }

      //just simulating the change in followers number when following or unfollowing, since the data is coming on the refresh only from the server, to provide a better user experience,  we are doing this.

      //if the following is true, then simulate adding a item in the array, and if it becomes false then simulate removing an item

      if (following) {
        user.followers.pop();
      } else {
        user.followers.push(currentLoggedUser?._id);
      }
    } catch (error) {
      showtoast("error", error, "error");
    }
    setUpdate(false);
  }

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              color={"gray.light"}
              borderRadius={"full"}
              p={1}
              bg={"gray.dark"}
            >
              stamin.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.username}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="/zuck-avatar.png"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {/*update button will only be showed if the user details that are stored in local storage matches the user whose profile we are current viewing*/}

      {currentLoggedUser?._id === user._id && (
        <Link to="/update">
          <Button size={"sm"}>Update</Button>
        </Link>
      )}

      {/*follow button will only be showed if the user is viewing profiles other than his*/}

      {/*if there is a currentLoggedUser only then its id will be accessed and compared...otherwise its going to give an error*/}

      {currentLoggedUser?._id !== user._id && (
        <Button isLoading={update} onClick={follow} size={"sm"}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>Instagram.com</Link>
        </Flex>
        <Flex>
          <BsInstagram className="instagram" size={25}></BsInstagram>
          <Box>
            <Menu>
              <MenuButton>
                <CgMoreO size={25} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={copy}>copy profile Link</MenuItem>
                  <MenuItem>Block</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          justifyContent={"center"}
          pb={3.5}
          cursor={"pointer"}
          borderBottom={"1px solid white"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          justifyContent={"center"}
          pb={3.5}
          cursor={"pointer"}
          borderBottom={"1px solid gray"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default UserPageHead;
