import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../configs/api";
import { toast } from 'react-hot-toast'


// How do we know which function should be sync and async
// 🔹 3. Easy real-life trick 🧠

// Ask yourself:

// 👉 “Does this need time?”

// Task	                                                         Type
// API call            	                                        Async
// Database         	                                        Async
// Timer	                                                    Async
// Simple variable update	                                    Sync
// Math calculation	                                            Sync
// 🔹 4. In YOUR AuthContext
// login/signup/logout → call backend → ⏳ →   async
// setUser/setisLoggedIn → just update state → ⚡ → sync
// 🔹 Final shortcut (remember this)

// 👉 Promise = async
// 👉 No Promise = sync

interface AuthContextProps {
    isLoggedIn:boolean,
    setisLoggedIn:(isLoggedIn:boolean)=>void,
    // user can be an object Iuser or null when not logged in
    user:IUser | null
    // takes user or null, updates the user state
    setUser:(user:IUser | null)=>void,
    // It means it is a async function which takes email and password as argument
    login:(user:{email:string,password:string})=>Promise<void>;
    // It is the async function which takes name, email, passowrd as input and it is also the async function
    // async:
    // start a task but don't wait move to next task
    // sync:
    // you must finsh the one task before starting the next task
    signup:(user:{name:string,email:string,password:string})=>Promise<void>
    logout:()=>Promise<void>;
}

// create a global data container
// It is used to create global storage box and use it anywhere in app
// It means this this context follow the structure of AuthContextProps
// In createContext we always initialize the values
const AuthContext=createContext<AuthContextProps>({
    isLoggedIn:false,
    setisLoggedIn:()=>{},
    user:null,
    setUser:()=>{},
    login:async()=>{},
    signup:async()=>{},
    logout:async()=>{}
})

export const AuthProvider=({children}:{children:React.ReactNode})=>{
    const [user,setUser]=useState<IUser | null>(null)
    const [isLoggedIn,setisLoggedIn]=useState<boolean>(false)

    const signup=async({name,email,password}:{name:string,email:string,password:string})=>{
        try {
            const {data}=await api.post('/api/auth/register',{name,email,password})
            console.log(data)
            if(data.user){
                // stores the fetching data inside the curent state in place of null
                setUser(data.user as IUser)
                // set login state to true
                setisLoggedIn(true)
            }
            // success message comes from the backend that passed inside the response
            toast.success(data.message) 
        } catch (error) {
            console.log(error)
        }
    }

    const login=async({email,password}:{email:string,password:string})=>{
        try {
            const {data}=await api.post('/api/auth/login',{email,password})
            console.log(data)
            if(data.user){
                // stores the fetching data inside the curent state in place of null
                setUser(data.user as IUser)
                // set login state to true
                setisLoggedIn(true)
            }
            // success message comes from the backend that passed inside the response
            toast.success(data.message) 
        } catch (error) {
            console.log(error)
        }
    }

    const logout=async()=>{
        try {
            const {data}=await api.post('/api/auth/logout')
            setUser(null)
            setisLoggedIn(false)
            toast.success(data.message)
            
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUser=async()=>{
        try {
            const {data}=await api.get('/api/auth/verify')
            console.log(data)
            if (data.user){
                setUser(data.user as IUser)
                setisLoggedIn(true)
           }   
        } catch (error) {
            console.log(error)
                // console.log("Error:", error);
                // console.log("Message:", error.message);
                // console.log("Code:", error.code);
                // console.log("Response:", error.response?.data);
        }
    }

    // useeffect can't be async diretely so we use like this, react doesn't allow this
    useEffect(()=>{
        // IIFE function means immediately invoked function,it is async because fetchuser calls the api of the server
        (async()=>{
            await fetchUser()
        })() // calling immediately invoked function by using ()
        // runs once we put []
    },[])


    const value={
        user, setUser, isLoggedIn, setisLoggedIn,signup,login,logout
    }
    
    return(
        // provider wrapping up the component
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// useContext is the react hook that reads the data from the AuthContext
// useAuth()=> give me the data stored in AuthContext
export const useAuth=()=>useContext(AuthContext)