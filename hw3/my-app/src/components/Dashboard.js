import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Dashboard.scss";
import { callMsGraph, get, post } from "../utils/requests";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../utils/authConfig";
export default function Dashboard() {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setboardDescription] = useState("");
  const [error, setError] = useState("");
  const [id, setId] = useState(null);
  const [allBoards, setAllBoards] = useState([])
  const {instance, accounts} = useMsal();
  const history = useHistory();

  
  useEffect(() => {
    if (accounts[0]) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((resp) => {
          callMsGraph(resp.accessToken).then((response) => {
            var resp = 0;
            for (var i = 0; i <= response.id.length; i++) {
              resp = resp.toString() + response.id.charCodeAt(i);
              console.log(response.id[i], response.id.charCodeAt(i));
            }
            const id = resp.substr(0, resp.length - 3);
            setId(resp.substr(0, resp.length - 3));
          });
        });
    }
  }, [accounts]);

  useEffect(() => {
    if(id) {
      get(`/boards/all/${id}`).then(resp=> resp.json()).then(resp => {
        console.log("aici", resp);
        if(resp.data) {
          setAllBoards(resp.data)
          console.log(resp.data);
        }
      })
    }
  }, [id])

  const createBoard = async (e) => {
    e.preventDefault();
    try {
      let body = JSON.stringify({
        name: boardName,
        description: boardDescription,
        userId: id
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
            <button type="submit">Create a board </button>
          </div>
        </form>
      </div>
      <div className="boards-container"> 
        {
          allBoards.map(x => (
            <div className="board"  onClick={() => history.push(`/board/${x.id}`)}>
              <p>{x.name} board</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
