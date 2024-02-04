import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { GrSend } from "react-icons/gr";
import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatAtom, selectedConversationAtom } from "../atoms/chatAtom";
import Conversation from "./Conversation";
function InputMessage({ setMessages }) {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversation = useRecoilState(chatAtom);
  const showToast = useShowToast();
  const [text, setText] = useState("");
  async function handle(event) {
    event.preventDefault();
    if (!text) {
      return;
    }
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);
      // setConversation((previous) => {
      //   const updated = previous.map((conversation) => {
      //     if (conversation._id === selectedConversation._id) {
      //       return {
      //         ...conversation,
      //         lastmsg: {
      //           text: text,
      //           sender: data.sender,
      //         },
      //       };
      //     }
      //     return conversation;
      //   });
      //   console.log(updated);
      // });
      setText("");
    } catch (error) {
      showToast("Error", error, "error");
    }
  }

  return (
    <form onSubmit={handle}>
      <InputGroup>
        <Input
          onChange={(e) => setText(e.target.value)}
          value={text}
          w={"full"}
          placeholder="Type your message here"
        ></Input>
        <InputRightElement
          children={
            <Button type={"submit"} cursor={"pointer"}>
              <GrSend Size={20}></GrSend>
            </Button>
          }
        />
      </InputGroup>
    </form>
  );
}

export default InputMessage;
