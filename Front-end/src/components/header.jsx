import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { DivertUser } from "../atoms/DivertUser";
import { AiFillHome } from "react-icons/ai";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Switch } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import LogoutButton from "./LogoutButton";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [value, setValue] = useState(null);
  const navigate = useNavigate();
  const user = useRecoilValue(DivertUser);
  function handler() {
    navigate(`/${value}`);
  }
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      <Flex gap={2} alignItems={"center"}>
        {user && (
          <Link to={"/"}>
            <AiFillHome size={28}></AiFillHome>
          </Link>
        )}
        <Switch
          colorScheme="teal"
          marginTop={1}
          isChecked={colorMode == "dark"}
          onChange={toggleColorMode}
        />
      </Flex>

      <InputGroup marginLeft={"7px"} marginRight={"5px"} w={"20rem"} size="md">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          pr="4.5rem"
          placeholder="search here!"
        />
        <InputRightElement width="4.5rem">
          <Button onClick={handler} h="1.75rem" size="sm">
            <RiSearchLine></RiSearchLine>
          </Button>
        </InputRightElement>
      </InputGroup>

      {/* <Image
        cursor={"pointer"}
        alt="logo"
        w={7}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      /> */}

      <Flex gap={3} alignItems={"center"}>
        <Link to={"/chat"}>
          <BiSolidMessageRoundedDetail size={25}></BiSolidMessageRoundedDetail>
        </Link>
        {user && (
          <Link to={`/${user.username}`}>
            <RxAvatar size={28}></RxAvatar>
          </Link>
        )}

        <LogoutButton></LogoutButton>
      </Flex>
    </Flex>
  );
}

export default Header;
