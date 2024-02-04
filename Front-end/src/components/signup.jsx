import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { authScreen } from "../atoms/AuthAtom";
import { DivertUser } from "../atoms/DivertUser";
export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [inputcontrol, setinputcontrol] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const setUser = useSetRecoilState(DivertUser);
  const toast = useToast();
  const setAuth = useSetRecoilState(authScreen);
  async function handler() {
    try {
      //we are not writing complete link because we have already created a proxy in vite config

      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputcontrol),
      });
      const data = await response.json();
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
        });
      }
      if (data.message) {
        localStorage.setItem("user-Threads", JSON.stringify(data));
        console.log(data);

        //changing state value so that components that are dependent of state reRender, like going to homepage just after signingUP

        setUser(data);
        console.log();
        toast({
          title: "success",
          description: data.message,
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        marginTop={"110px"}
      >
        {/* <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack> */}
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setinputcontrol({ ...inputcontrol, name: e.target.value })
                    }
                    value={inputcontrol.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setinputcontrol({
                        ...inputcontrol,
                        username: e.target.value,
                      })
                    }
                    value={inputcontrol.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setinputcontrol({ ...inputcontrol, email: e.target.value })
                }
                value={inputcontrol.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  onChange={(e) =>
                    setinputcontrol({
                      ...inputcontrol,
                      password: e.target.value,
                    })
                  }
                  value={inputcontrol.password}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={handler}
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("blue.600", "blue.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuth("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
