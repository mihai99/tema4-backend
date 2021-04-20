// const serverUrl = "http://localhost:8080";
const serverUrl = "https://cc-tema-3-3cce5.ew.r.appspot.com";

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
