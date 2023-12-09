import axios from "axios";

const API_KEY = "41146356-b4088fdd71d4692a67ba75dd6";


export async function getPhoto(currentPage, query) {
    const options = { page: currentPage, q: query, key: API_KEY, image_type: "photo", orientation: "horizontal", safesearch: true, per_page: 40};
    try {
        
        const { data } = await axios("https://pixabay.com/api/", { params: options });
        return data;
        
    } catch (error) {
        console.log(error.message);
        
    }
}
