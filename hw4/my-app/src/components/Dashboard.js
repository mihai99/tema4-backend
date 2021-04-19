import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Dashboard.scss";
import { post } from "../utils/requests";
export default function Dashboard() {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setboardDescription] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const createBoard = async (e) => {
    e.preventDefault();
    try {
      let body = JSON.stringify({
        name: boardName,
        description: boardDescription,
      });
      post("/board", body)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          history.push("/board/" + response.id);
        });
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  return (
    <div className="full-container">
      <div>
        <h1>Create a board</h1>
        <form onSubmit={createBoard} className="form">
          <p className="error">{error}</p>
          <label>
            <input
              type="text"
              placeholder="Board name"
              onChange={(e) => setBoardName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="Board description"
              onChange={(e) => setboardDescription(e.target.value)}
            />
          </label>
          <div>
            <button type="submit">Create a board -></button>
          </div>
        </form>
      </div>
    </div>
  );
}
