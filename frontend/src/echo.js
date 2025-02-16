import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "pusher",
    key: process.env.REACT_APP_PUSHER_KEY,
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    forceTLS: true,
    authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use your auth token logic
        },
    },
});

export default echo;
