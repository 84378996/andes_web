import axios from "axios";

const getToken = (username: string, password: string) => {
  console.log("getToken");
  const service = axios.create({
    baseURL: "/api",
    timeout: 5000, // request timeout
  });
  const param =
    "grant_type=password&username=" +
    username.trim() +
    "&password=" +
    password.trim();

  //console.log(param);
  return service({
    method: "post",
    url: "/token",
    data: param,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
};

export { getToken };
