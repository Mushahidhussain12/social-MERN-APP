import { useState } from "react";
import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import useGetuser from "../hooks/useGetuser";
import Actions from "./Actions";
function Comment({ Comment }) {
  const { user } = useGetuser(Comment.userId);
  if (!user) return null;
  console.log("entered");
  return (
    <>
      <Flex my={2} py={2} gap={4} w={"full"}>
        <Avatar src={user?.profilePic} size={"sm"}></Avatar>
        <Flex w={"full"} gap={1} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user?.username} [Comment]
              </Text>
            </Box>

            <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"} fontSize={"sm"}>
                2min
              </Text>
              <BsThreeDots></BsThreeDots>
            </Flex>
          </Flex>
          <Text>{Comment?.replyText}</Text>
        </Flex>
      </Flex>
      <Divider my={2}></Divider>
    </>
  );
}

export default Comment;
