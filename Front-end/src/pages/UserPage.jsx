import { useEffect, useState } from "react";
import UserPageHead from "../components/UserPageHead";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, useToast } from "@chakra-ui/react";

import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/PostAtom";
function UserPage() {
  const [user, setuser] = useState(null);
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fetching, setFetching] = useState(true);

  //extracting name from react router link using useParams hook and then sending request for the data of that user to the API

  const { username } = useParams();
  const [update, setupdate] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    async function getuser() {
      try {
        //we dont have to pass headers in get request
        const response = await fetch(`/api/users/profile/${username}`);
        const data = await response.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        } else {
          setuser(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setupdate(false);
      }
    }
    async function getPosts() {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setPosts([]);
        } else {
          setPosts(data);
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetching(false);
      }
    }

    getuser();
    getPosts();
  }, [username, showToast, setPosts]);

  //this thing i have to look at that why the value of the valid user is being sent null if we are not writing this!

  if (!user && update) {
    return (
      <Flex justifyContent={"center"}>
        {" "}
        <Spinner speed="0.3s" size="xl" thickness="5px"></Spinner>
      </Flex>
    );
  }
  if (!user && !update) {
    return <h1>User not Found</h1>;
  }

  return (
    <>
      <UserPageHead user={user}></UserPageHead>
      {!fetching && posts.length === 0 && (
        <Flex
          fontSize={20}
          justifyContent={"center"}
          alignItems={"center"}
          marginTop={20}
        >
          <h1>This User has no posts</h1>
        </Flex>
      )}
      {fetching && (
        <Flex my={10} justifyContent={"center"}>
          {" "}
          <Spinner speed="0.3s" size="xl" thickness="5px"></Spinner>
        </Flex>
      )}
      {posts.map((single) => (
        <Post key={posts._id} post={single} postedBy={single.postedBy} />
      ))}
    </>
  );
}
export default UserPage;
