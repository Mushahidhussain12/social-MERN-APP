import Comment from "../components/Comment";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

import { Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { Flex } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/PostAtom";

function PostPage() {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom);
  const currentP = posts[0];
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getPost() {
      setPosts([]);
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        } else {
          //even though we have just one post but since we have set the datatype of posts global state as array,we will have to send value as an array

          setPosts([data]);
          console.log(data);
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    }
    getPost();
  }, [showToast, id, setPosts]);

  if (loading) {
    return (
      <Flex justifyContent={"center"}>
        {" "}
        <Spinner speed="0.3s" size="xl" thickness="5px"></Spinner>
      </Flex>
    );
  }
  if (!currentP) return null;
  return (
    <>
      <Post post={currentP} postedBy={currentP.postedBy}></Post>
      {currentP.replies.length !== 0 &&
        currentP.replies.map((single) => (
          <Comment key={single.id} Comment={single} />
        ))}
    </>
  );
}

export default PostPage;
