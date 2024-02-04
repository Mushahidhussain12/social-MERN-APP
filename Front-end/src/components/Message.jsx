import { Avatar, Flex, Text, color } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/chatAtom";
import { DivertUser } from "../atoms/DivertUser";

function Message({ message, ownMsg }) {
  const currentUser = useRecoilValue(DivertUser);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  return (
    <>
      {ownMsg ? (
        <Flex alignSelf={"flex-end"} gap={2}>
          <Text
            fontSize={"sm"}
            maxW={"340px"}
            bg={"blue.600"}
            borderRadius={"md"}
            p={1}
          >
            {message.text}
          </Text>
          <Avatar src={currentUser.profilePic} h={7} w={7} />
        </Flex>
      ) : (
        <Flex alignSelf={"flex-start"} gap={2}>
          <Avatar src={selectedConversation.userProfilePic} h={7} w={7} />
          <Text
            fontSize={"sm"}
            maxW={"340px"}
            bg={"gray.400"}
            color={"black"}
            borderRadius={"md"}
            p={1}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default Message;
