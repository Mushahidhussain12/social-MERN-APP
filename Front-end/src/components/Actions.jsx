import { Flex, Text, Box } from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { DivertUser } from "../atoms/DivertUser";
import { useDisclosure } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import {
  Modal,
  FormControl,
  FormLabel,
  Input,
  Button,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@chakra-ui/react";
import postAtom from "../atoms/PostAtom";

function Actions({ post }) {
  const user = useRecoilValue(DivertUser);

  //it will determine the state button based on if the user is included in likes array of post or not!

  const [liked, setLiked] = useState(post?.likes.includes(user?._id));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useRecoilState(postAtom);
  const showToast = useShowToast();
  const [reply, setReply] = useState("");
  const [liking, setLiking] = useState(false);
  const [replying, setReplying] = useState(false);
  const [loading, setLoading] = useState(false);

  async function Likehandler() {
    if (!user) {
      return showToast("Error", "Login to Like the Post", "error");
    }

    //OPTIMIZATION :  if the user is clicking on the like button second time during the fetch processing for the first request, we will not run the fetch twice and set the post to unlike, instead we'll wait for the first request to complete!

    if (liking) return;
    setLiking(true);
    try {
      const response = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      }

      //we are adding or deleting id in our local state to simulate the like numbers since the data from database only gets updated on a refresh.

      if (!liked) {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id)
            return { ...p, likes: p.likes.filter((u_id) => u_id !== user._id) };
        });
        setPosts(updatedPosts);
      }
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLiking(false);
    }
  }

  async function replyhandler(event) {
    event.preventDefault();
    if (!user) return showToast("Error", "login to reply", "error");
    if (replying) return;
    setReplying(true);
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/reply/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, replies: [...p.replies, data] };
          }
          return p;
        });
        setPosts(updatedPosts);
        showToast("Success", "reply added", "success");
        onClose();
        setReply("");
      }
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
      setReplying(false);
    }
  }

  const RepostSVG = () => {
    return (
      <svg
        aria-label="Repost"
        color="currentColor"
        fill="currentColor"
        height="20"
        role="img"
        viewBox="0 0 24 24"
        width="20"
      >
        <title>Repost</title>
        <path
          fill=""
          d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
        ></path>
      </svg>
    );
  };

  const ShareSVG = () => {
    return (
      <svg
        aria-label="Share"
        color=""
        fill="rgb(243, 245, 247)"
        height="20"
        role="img"
        viewBox="0 0 24 24"
        width="20"
      >
        <title>Share</title>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="22"
          x2="9.218"
          y1="3"
          y2="10.083"
        ></line>
        <polygon
          fill="none"
          points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        ></polygon>
      </svg>
    );
  };
  return (
    <Flex flexDirection={"column"}>
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={Likehandler}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          onClick={onOpen}
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <RepostSVG />
        <ShareSVG />
      </Flex>
      <Flex alignItems={"center"} gap={2}>
        <Text
          color={useColorModeValue("gray.dark", "gray.600")}
          fontSize={"sm"}
        >
          {post?.replies.length} Replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"}></Box>
        <Text
          color={useColorModeValue("gray.dark", "gray.600")}
          fontSize={"sm"}
        >
          {post?.likes.length} likes
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add your reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel></FormLabel>
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Add your Reply Here"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              onClick={replyhandler}
              colorScheme="blue"
              mr={3}
            >
              Reply
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Actions;
