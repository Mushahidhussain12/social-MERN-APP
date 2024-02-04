import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { usePreviewImage } from "../hooks/usePreviewImage";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { DivertUser } from "../atoms/DivertUser";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import postAtom from "../atoms/PostAtom";
import { useParams } from "react-router-dom";

function CreatePost() {
  const user = useRecoilValue(DivertUser);
  const { handleImage, image, setimage } = usePreviewImage();
  const { username } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const [postText, setpostText] = useState();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [remainChar, setremainChar] = useState(300);
  const [update, setupdate] = useState(null);

  async function handleCreatePost() {
    setupdate(true);
    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postedBy: user._id, text: postText, img: image }),
    });
    const data = await res.json();
    if (data.error) {
      showToast("Error", data.error, "error");
    } else {
      showToast("Success", "New Post Created", "success");
      onClose();
      setpostText("");

      //when updating our global post state we have to make sure we dont display our post on other users profile, since state doesnt care about whose post is this, it just updates the value, otherwise the data which will come from server is 100% accurate, we were just facing this problem when updating state in our frontend.

      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      setimage(null);
      setremainChar(300);
    }
    setupdate(false);
  }

  //on writing text, handleText will be called and if the length of text is less than 300 then else statement will run which will do one minus from remaining text and will assign value of text to postText, but once the length of text reaches 300, if statement will run which will cut only 300 characters of text, and will assign them to postText, so now if the user keep on entering the characters but postText will always display first 300 chars

  function handleText(event) {
    const text = event.target.value;

    if (text.length > 300) {
      const truncated = text.slice(0, 300);
      setpostText(truncated);
      setremainChar(0);
    } else {
      setremainChar(300 - text.length);
      setpostText(text);
    }
  }

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const fileRef = useRef(null);
  return (
    <>
      <Button
        onClick={onOpen}
        position={"fixed"}
        bottom={10}
        right={6}
        size={{ base: "sm", sm: "md" }}
        bg={useColorModeValue("gray.300", "gray.dark")}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="What do you want to share today with the world?"
                onChange={handleText}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
              >
                {remainChar}/300
              </Text>
              <input type="file" hidden ref={fileRef} onChange={handleImage} />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              ></BsFillImageFill>
            </FormControl>
            {image && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={image} alt="Post img"></Image>
                <CloseButton
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                  onClick={() => {
                    setimage(null);
                  }}
                ></CloseButton>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={update}
              loadingText="Posting"
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePost;
