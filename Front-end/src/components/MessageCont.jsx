import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import InputMessage from "./InputMessage";
import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/chatAtom";
import { DivertUser } from "../atoms/DivertUser";
import { useSocket } from "../context/socketContext";
function MessageCont() {
  const currentUser = useRecoilValue(DivertUser);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [messages, setMessages] = useState([]);
  const showToast = useShowToast();
  const [loading, setLoading] = useState();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setMessages((p) => [...p, message]);
    });

    //useEffect cleanup to stop listening, if the component is unmounted!

    return () => socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    async function getMessages() {
      setMessages([]);
      setLoading(true);
      try {
        if (selectedConversation.dummy) {
          return;
        }
        if (selectedConversation) {
          const response = await fetch(
            `/api/messages/${selectedConversation.userId}`
          );
          const data = await response.json();
          if (data.error) {
            showToast("Error", error, "error");
            return;
          }
          setMessages(data);
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    }
    getMessages();
  }, [showToast, selectedConversation]);
  return (
    <Flex
      flex={70}
      p={2}
      flexDirection={"column"}
      borderRadius={"md"}
      bg={useColorModeValue("gray.200", "gray.dark")}
    >
      {/*message section header*/}
      <Flex w={"full"} alignItems={"center"} gap={2} h={12}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.png" ml={2} h={4} w={4}></Image>
        </Text>
      </Flex>
      <Divider></Divider>
      <Flex
        gap={4}
        flexDirection={"column"}
        my={4}
        px={2.5}
        height={"370px"}
        overflowY={"scroll"}
      >
        {/*Message skeleton body goes here, the array will iterate eight times and which each time,value of index will either be even or odd, and we will arrange skeleton according to that, and also if the value is even we will put skeleton circle is beginning and if its not, we will put it in the end!  */}

        {loading &&
          [0, 1, 2, 4, 5, 6, 7].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              p={1}
              alignItems={"center"}
              border={"md"}
              alignSelf={i % 2 == 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7}></SkeletonCircle>}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"9px"} w={"250px"}></Skeleton>
                <Skeleton h={"9px"} w={"250px"}></Skeleton>
                <Skeleton h={"9px"} w={"250px"}></Skeleton>
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7}></SkeletonCircle>}
            </Flex>
          ))}

        {messages &&
          messages?.map((single) => (
            <Message
              key={single?._id}
              message={single}
              ownMsg={currentUser?._id === single.sender}
            ></Message>
          ))}
      </Flex>

      {/*its very inefficient to call to extract data from server after every message to display, instead we make a global state and store our messages there while sending data to our servers as well to extract on the reload*/}

      <InputMessage setMessages={setMessages}></InputMessage>
    </Flex>
  );
}

export default MessageCont;
