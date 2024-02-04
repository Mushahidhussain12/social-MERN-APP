import { Link } from "react-router-dom";
import { Avatar, Flex, Box, Text, Image, Divider } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

function PostPagePost({ likes, replies, postImage, postTitle }) {
  const [liked, setliked] = useState(false);
  let likedADD = liked ? 1 : 0;
  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex mb={5} gap={3} marginTop={"30px"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name="mushahid hussain" src={postImage} />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box w={"full"} position={"relative"}>
            <Avatar
              name="mushahid-hussain"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              left="14px"
              top={"0px"}
              padding={"2px"}
              size={"xs"}
            />
            <Avatar
              name="mushahid-hussan"
              src="/zuck-avatar.png"
              position={"absolute"}
              right="-5px"
              bottom={"0px"}
              padding={"2px"}
              size={"xs"}
            />
            <Avatar
              name="mushahid-hussai"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              left="5px"
              bottom={"0px"}
              padding={"2px"}
              size={"xs"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                Mark Zuckerberg
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text color={"gray.light"} fontStyle={"sm"}>
                8h
              </Text>
              <BsThreeDots></BsThreeDots>
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{postTitle}</Text>
          <Box
            border={"1px solid"}
            borderColor={"gray.light"}
            overflow={"hidden"}
            borderRadius={6}
          >
            <Image src={postImage} w={"full"}></Image>
          </Box>
          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setliked} />
          </Flex>
          <Flex alignItems={"center"} gap={2}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {replies}
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {parseInt(likes) + likedADD} likesss
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Divider my={8} />
    </Link>
  );
}

export default PostPagePost;
