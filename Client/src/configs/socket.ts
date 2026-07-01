import {io} from 'socket.io-client'
export const socket=io(
    "https://gen-thumb-serverupdated.vercel.app",
    {
        transports: ["polling"],
        withCredentials:true
    }
)