import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/PostAtom";
function Homepage() {
  const showToast = useShowToast();
  const [update, setUpdate] = useState(false);
  const [posts, setPosts] = useRecoilState(postAtom);
  useEffect(() => {
    async function getfeed() {
      setUpdate(true);

      //to not see the flickering effect which we were seeing when shifting from profile to feed // NOT THAT IMPORTANT

      setPosts([]);
      try {
        const response = await fetch("/api/posts/feed");
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        } else {
          setPosts(data);
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setUpdate(false);
      }
    }
    getfeed();
  }, [showToast, setPosts]);
  return (
    <>
      {" "}
      {update && (
        <Flex justifyContent={"center"}>
          {" "}
          <Spinner speed="0.3s" size="xl" thickness="5px"></Spinner>
        </Flex>
      )}
      {!update && posts.length === 0 && (
        <Flex justifyContent={"center"} alignItems={"center"} mt={"150px"}>
          <h1>You need to follow users to see their posts</h1>
        </Flex>
      )}
      {posts.map((singlePost) => (
        <Post
          key={Post._id}
          post={singlePost}
          postedBy={singlePost?.postedBy}
        />
      ))}
    </>
  );
}

export default Homepage;
