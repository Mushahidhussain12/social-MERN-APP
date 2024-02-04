import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { DivertUser } from "../atoms/DivertUser";
import { selectedConversationAtom } from "../atoms/chatAtom";
import { BsCheck2All } from "react-icons/bs";
import { chatAtom } from "../atoms/chatAtom";

function Conversation({ conversation, online }) {
  const userDetails = conversation.participants[0];
  const colorMode = useColorMode();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(DivertUser);
  const lastmsg = conversation.lastMessage;
  return (
    <Flex
      onClick={() => {
        setSelectedConversation({
          _id: conversation._id,
          userProfilePic: userDetails.profilePic,
          userId: userDetails._id,
          username: userDetails.username,
          dummy: conversation.dummy,
        });
      }}
      //background of selected conversation will change if we click on it!

      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.400"
            : "gray.dark"
          : ""
      }
      p={1}
      alignItems={"center"}
      gap={2}
      _hover={{
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
        cursor: "pointer",
      }}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            md: "md",
            sm: "sm",
          }}
          src={userDetails.profilePic}
        >
          {online ? (
            <AvatarBadge boxSize="1rem" bg={"green.500"}></AvatarBadge>
          ) : (
            ""
          )}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {userDetails.username}{" "}
          <Image src="/verified.png" h={4} w={4} ml={1}></Image>
        </Text>
        <Text display={"flex"} fontSize={"xs"} alignItems={"center"} gap={1}>
          {/*now if the length of message is greator than 18 then it will be truncated to 18 */}

          {/* if we are the one sending last message then display a icon of double tick*/}

          {currentUser?._id === lastmsg?.sender ? (
            <BsCheck2All size={16} />
          ) : (
            ""
          )}

          {lastmsg?.text.length > 18
            ? lastmsg.text.substring(0, 18) + "..."
            : lastmsg?.text}
        </Text>
      </Stack>
    </Flex>
  );
}

export default Conversation;
