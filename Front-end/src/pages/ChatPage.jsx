import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import MessageCont from "../components/MessageCont";
import { Flex, Input } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import Conversation from "../components/Conversation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatAtom, selectedConversationAtom } from "../atoms/chatAtom";
import { BiConversation } from "react-icons/bi";
import { DivertUser } from "../atoms/DivertUser";
import { SocketContextProvider, useSocket } from "../context/socketContext";

function ChatPage() {
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [conversation, setConversations] = useRecoilState(chatAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const { socket, onlineUsers } = useSocket();
  const user = useRecoilValue(DivertUser);
  const [search, setSearch] = useState("");
  const showToast = useShowToast();

  useEffect(() => {
    async function getConvos() {
      try {
        const convos = await fetch("/api/messages/conversations");
        const data = await convos.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoadingSkeleton(false);
      }
    }
    getConvos();
  }, [setConversations, showToast]);

  async function handleSearch(event) {
    event.preventDefault();
    setLoadingSearch(true);
    try {
      const response = await fetch(`api/users/profile/${search}`);
      const userdata = await response.json();
      if (userdata.error) {
        showToast("Error", userdata.error, "error");
        return;
      }

      //checks if the user is trying to message himself

      if (userdata._id === user._id) {
        showToast("Error", "you can not message yourself", "error");
        return;
      }

      //checks if the conversation already exists then take the user to conversation container directly

      if (
        conversation.find(
          (conversation) => conversation.participants[0]._id === userdata._id
        )
      ) {
        setSelectedConversation({
          _id: conversation.find(
            (conversation) => conversation.participants[0]._id === userdata._id
          )._id,
          userId: userdata._id,
          username: userdata.username,
          userProfilePic: userdata.profilePic,
        });
        return;
      }
      //and if the conversation doesnt exists then create a dummy  conversation to show the user because the actual conversation will only be created once any of the both users send a message

      const dummyConvo = {
        dummy: true,
        lastmsg: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: userdata._id,
            username: userdata.username,
            profilePic: userdata.profilePic,
          },
        ],
      };

      setConversations((pre) => [...pre, dummyConvo]);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoadingSearch(false);
    }
  }

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ lg: "800px", md: "80%", base: "100%" }}
      transform={"translateX(-50%)"}
      padding={5}
    >
      <Flex
        gap={5}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
        flexDirection={{
          base: "column",
          md: "row",
        }}
      >
        {/*first flex will take 30% of total width while other will take rest &0% */}

        <Flex
          flex={30}
          flexDirection={"column"}
          gap={2}
          maxW={{
            sm: "260px",
            md: "full",
            mx: "auto",
          }}
        >
          <Text
            color={useColorModeValue("gray.600", "gray.400")}
            fontWeight={650}
            marginLeft={1}
          >
            Conversations
          </Text>
          <form onSubmit={handleSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="search here"
              ></Input>
              <Button isLoading={loadingSearch} type="submit">
                <SearchIcon></SearchIcon>
              </Button>
            </Flex>
          </form>
          {!loadingSkeleton &&
            conversation.map((con) => (
              <Conversation
                online={onlineUsers.includes(con.participants[0]._id)}
                conversation={con}
              ></Conversation>
            ))}

          {loadingSkeleton &&
            [0, , 2, 3, 4, 1, 2, 6].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                borderRadius={"md"}
                p={"1"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex flexDirection={"column"} gap={3} w={"full"}>
                  <Skeleton h={"10px"} w={"80px"}></Skeleton>
                  <Skeleton h={"8px"} w={"90%"}></Skeleton>
                </Flex>
              </Flex>
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"410px"}
            borderRadius={"md"}
          >
            <BiConversation size={100}></BiConversation>
            <Text fontSize={20}>Select a conversation</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageCont></MessageCont>}
      </Flex>
    </Box>
  );
}

export default ChatPage;
