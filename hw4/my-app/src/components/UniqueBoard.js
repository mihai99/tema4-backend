import React, { useEffect, useState } from "react";
import "./UniqueBoard.scss";
import { get, post } from "../utils/requests";
import PostForm from "./PostForm";
// const fakeData = {
//   name: "Test board",
//   description:
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis elementum nisi et mi volutpat faucibus. Donec non egestas ante, ultrices porta nibh. Sed nunc lectus, ornare lacinia lectus id, efficitur laoreet augue. Integer bibendum nulla quis quam maximus condimentum. Suspendisse eu odio vel turpis condimentum pellentesque. Donec ultricies metus ut efficitur gravida. Quisque scelerisque justo sed odio pharetra porttitor. Nulla consequat ut metus id vestibulum. Vivamus a nunc",
//   posts: [
//     { title: "test post", body: "gnrjtngkrjtng" },
//     {
//       title: "test post1",
//       body:
//         "gnrjtngksit amet, consectetur adipiscing elit. Duis elementum nisi et mi volutpat faucibus. Donec non egestas ante, ultrices porta nibh. Sed nunc lectus, ornare lacinia lectus id, efficitur laoreet augue. Integer bibendum nulla quis quam maximus condimentum. Suspendisse eu odio vel turpis condimentum pellentesque. Donec ultricies metus ut efficitur gravida. Quisque scelerisque justo sed odio pharetra porttitor. Nulla consequat ut metus id vestibulum. Vivamus a nurjtng",
//     },
//     { title: "test post2", body: "gnrjtngkrjtng" },
//   ],
// };

export default function UniqueBoard() {
  const [posts, setPosts] = useState([]);
  const [board, setBoard] = useState();
  const [isFormOn, setIsFormOn] = useState();
  const [boardPosts, setBoardPosts] = useState([]);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const boardId = window.location.pathname;
    console.log(boardId);
    get(boardId)
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        if (result && result.data) {
          setBoard(result.data);
        }
      })
      .catch((err) => console.error("something bad happend", err));
    get(boardId + "/posts")
      .then((result) => result.json())
      .then((result) => {
        console.log("got here");
        if (result && result.posts) {
          setBoardPosts(result.posts);
        }
      })
      .catch((err) => console.error("something bad happend", err));
    // setBoard(fakeData);
  }, []);
  useEffect(() => {
    let postsHtml = [];
    boardPosts &&
      boardPosts.forEach((post) => {
        let postHtml = (
          <div className="post" key={post?.title}>
            <h3>{post?.title}</h3>
            <p>{post?.body}</p>
          </div>
        );
        postsHtml.push(postHtml);
      });
    setPosts(postsHtml);
  }, [boardPosts]);

  const subscribe = async (e) => {
    e.preventDefault();
    const boardPath = window.location.pathname;
    let body = JSON.stringify({ email, boardId: boardPath.split("/")[2] });
    const result = await post(boardPath + "/user", body);
    console.log(result);
  };

  return (
    <div>
      {board ? (
        <div className="board-container">
          <div className="board-details">
            <h1>{board?.name}</h1>
            <p>{board?.description}</p>
            <div className="subscription">
              Subscribe to board:
              <input
                type="email"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <button onClick={subscribe}>Subscribe</button>
            </div>
          </div>
          <div className="button-post">
            <button onClick={() => setIsFormOn(!isFormOn)}>
              Create a post
            </button>
            <PostForm isFormOn={isFormOn}></PostForm>
          </div>
          <div className="posts-space">{posts}</div>
        </div>
      ) : (
        <div className="board-container">
          <h1>Uuupssii, this board doesn't exist</h1>
        </div>
      )}
    </div>
  );
}
