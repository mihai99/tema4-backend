// const serverUrl = "http://localhost:8080";
import { graphConfig } from "./authConfig";
// const serverUrl = "https://cc-tema-3-3cce5.ew.r.appspot.com";
const serverUrl = "http://localhost:8080"
const axios = require('axios')
export const post = (path, body) => {
  return fetch(serverUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
};
export const get = async (path) => {
  return fetch(serverUrl + path);
};

export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}



export const postFile = (data,id)=>{
  axios.post(serverUrl+'/file/upload/:'+id,data).catch(e=>{
    console.log(e)
  })
}

export const getFile = (id)=>{
  return axios.get(serverUrl+"/file/"+id).then(e=>{
    console.log(e)
    
   return e.data
  }).catch(err=>{
    console.log(err)
  })
}