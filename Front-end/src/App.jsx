import { Box, Button, Container, useColorModeValue } from "@chakra-ui/react";
import { Navigate, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Header from "./components/header";
import UserPage from "./pages/UserPage";
import UpdatePage from "./pages/UpdatePage";
import PostPage from "./pages/PostPage";
import Auth from "./pages/authpage";
import { DivertUser } from "./atoms/DivertUser";
import Homepage from "./pages/Homepage";
import { useRecoilValue } from "recoil";
import CreatePost from "./components/CreatePost";
function App() {
  const location = useLocation();
  const user = useRecoilValue(DivertUser);

  // Check if the current route is "/auth"
  const isAuthRoute = location.pathname === "/auth";
  return (
    <Box
      width={"full"}
      bgImage={isAuthRoute ? "url(/6231375.jpg)" : "none"}
      bgSize={"cover"}
      minH="100vh"
    >
      <Box width={"full"} position={"relative"}>
        <Container maxW="700px">
          {isAuthRoute ? null : <Header />}
          <Routes>
            {/* now if the user has opened the site,he will always be redirected to root path and root path will check if he has logged in or not, if he has then root path will render homepage component but if not then the user will be redirected to auth route to login/signup first*/}
            <Route
              path="/"
              element={user ? <Homepage /> : <Navigate to="/auth" />}
            />

            {/*After the user has been redirected to auth path, auth path will check will moniter if the user has created account or not, Once the user has loggedin or signedup, authpath will redirect it to root path, after which the homepage component will be rendered*/}

            <Route
              path="/auth"
              element={!user ? <Auth /> : <Navigate to="/" />}
            />
            <Route
              path="/update"
              element={user ? <UpdatePage /> : <Navigate to="/auth" />}
            />

            {/*will only show create Post button on the profile page of the user */}

            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    <UserPage></UserPage>
                    <CreatePost></CreatePost>
                  </>
                ) : (
                  <UserPage />
                )
              }
            />
            <Route path="/auth" element={<Auth />}></Route>
            <Route path="/:username/posts/:id" element={<PostPage />} />
            <Route
              path="/chat"
              element={user ? <ChatPage></ChatPage> : <Navigate to={"/auth"} />}
            ></Route>
          </Routes>

          {/* now the user state will keep on check if there is a value in localStorage or not,once the user hits on logout button, setstatevalue will become null and user will be redirected to auth instead of home as well as localstorge will also be cleared so that state dont get its default value on refresh and cookies will be deleted as well so that user can not request api response from server without loggingIN again*/}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
