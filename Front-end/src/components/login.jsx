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
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { authScreen } from "../atoms/AuthAtom";
import { useSetRecoilState } from "recoil";
import { useToast } from "@chakra-ui/react";
import { DivertUser } from "../atoms/DivertUser";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useSetRecoilState(authScreen);
  const [inputcontrol, setinputcontrol] = useState({
    username: "",
    password: "",
  });
  const setUser = useSetRecoilState(DivertUser);
  const toast = useToast();

  async function handler() {
    try {
      setLoading(true);
      const response = await fetch("/api/users/login", {
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

        //changing state value so that components that are dependent of state reRender, like going to homepage just after signingUP

        setUser(data);
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
    setLoading(false);
  }
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        marginTop={"120px"}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Log in
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                onChange={(e) =>
                  setinputcontrol({
                    ...inputcontrol,
                    username: e.target.value,
                  })
                }
                value={inputcontrol.username}
                type="text"
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
                isLoading={loading}
                onClick={handler}
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("blue.600", "blue.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
              >
                log in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                don't have an account?{" "}
                <Link color={"blue.400"} onClick={() => setAuth("signup")}>
                  Signup
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
