import { getPhoto } from "./api";

const form = document.querySelector('.search-form');
const btn = document.querySelector('button');



getPhoto(1, "cat").then(responce => console.log(responce.hits));

