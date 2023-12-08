import { getPhoto } from "./api";

getPhoto(1, "cat").then(responce => console.log(responce.hits));

