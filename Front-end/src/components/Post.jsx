import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Flex,
  Box,
  Text,
  Image,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { DivertUser } from "../atoms/DivertUser";
import postAtom from "../atoms/PostAtom";
function Post({ post, postedBy }) {
  const showtoast = useShowToast();
  const navigate = useNavigate();
  const Current_user = useRecoilValue(DivertUser);
  const [posts, setPosts] = useRecoilState(postAtom);
  const [user, setUser] = useState(null);

  //Post data is coming from getfeed route but the data of OP is extracted using this function

  useEffect(() => {
    async function userdetails() {
      try {
        const response = await fetch(`/api/users/profile/${postedBy}`);
        const data = await response.json();
        if (data.error) {
          showtoast("Error", data.error, "error");
          setUser(null);
          return;
        } else {
          setUser(data);
        }
      } catch (error) {
        showtoast("Error", error, "error");
        setUser(null);
      }
    }
    userdetails();
  }, [postedBy, showtoast]);

  async function deleteHandler(event) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/posts/${post?._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.error) {
        showtoast("Error", data.error, "error");
      }
      if (data.message) {
        showtoast("Success", data.message, "success");
        setPosts(posts.filter((p) => p._id !== post._id));
      }
    } catch (error) {
      showtoast("Error", error, "error");
    }
  }

  return (
    <Link to={`/${user?.username}/posts/${post?._id}`}>
      <Flex mb={5} gap={3} marginTop={"30px"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name="mushahid hussain"
            src={user?.profilePic}
            //when the user clicks on avatar it will take it to the userpage of poster instead of opening the details of post!

            onClick={(event) => {
              event.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box
            w={"1px"}
            h={"full"}
            bg={useColorModeValue("gray.dark", "gray.600")}
            my={2}
          ></Box>
          <Box w={"full"} position={"relative"}>
            {/*if there is atleast one user only then, the first avatar will be displayed and so on, otherwise not */}

            {post?.replies[0] && (
              <Avatar
                name="mushahid-hussain"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                left="14px"
                top={"0px"}
                padding={"2px"}
                size={"xs"}
              />
            )}

            {post?.replies[1] && (
              <Avatar
                name="mushahid-hussan"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                right="-5px"
                bottom={"0px"}
                padding={"2px"}
                size={"xs"}
              />
            )}

            {post?.replies[2] && (
              <Avatar
                name="mushahid-hussai"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                left="5px"
                bottom={"0px"}
                padding={"2px"}
                size={"xs"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/${user.username}`);
                }}
                fontWeight={"bold"}
              >
                {user?.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              {/* <Text
                color={"gray.light"}
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
              >
                {/*this function takes a date and calculate the duration between current time and that date }

                {formatDistanceToNow(new Date(post.createdAt))}
              </Text> */}
              {Current_user?._id === user?._id && (
                <DeleteIcon onClick={deleteHandler} size={20}></DeleteIcon>
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              border={"1px solid"}
              borderColor={"gray.light"}
              overflow={"hidden"}
              borderRadius={6}
            >
              <Image src={post.img} w={"full"}></Image>
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
      <Divider my={8} />
    </Link>
  );
}

export default Post;
