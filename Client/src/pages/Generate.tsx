import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { colorSchemes, dummyThumbnails, type AspectRatio, type IThumbnail, type ThumbnailStyle } from "../assets/assets";
import { colorSchemes, type AspectRatio, type IThumbnail, type ThumbnailStyle } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { useAuth } from "../context/context";
import toast from "react-hot-toast";
import api from "../configs/api";
import { socket } from './../configs/socket';


const Generate = () => {
  // we are fetching id from the url
  const { id } = useParams();
  // getting the vurrent url and extract the pathname from it
  const {pathname}=useLocation()
  // for handling the navigating from one route to another functionality
  const navigate=useNavigate()
  // getting isLogged in from the backend api
  const {isLoggedIn}=useAuth()
  // for thumbnail we want the title
  const [title, setTitle] = useState("");
  // for thumbnail we want details
  const [additionalDetails, setAdditionalDetails] = useState("");
  // for thumbnail
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  // for loading
  const [loading, setLoading] = useState(false);
  
  // useState is typed with Aspect ratio so only allowed ratios can be stored default is 16:9
  const[aspectRatio,setAspectRatio]=useState<AspectRatio>('16:9')

  // store the colorscheme id
  const[colorSchemeId,setColorSchemeId]=useState<string>(colorSchemes[0].id)

  // Manage the styles
  const[style,setStyle]=useState<ThumbnailStyle>('Bold & Graphic')

  // manage stage to open and close the drop down menu to choose the style by default drop down is closed
  const[styleDropdownOpen, setStyleDropdownOpen]=useState(false)


 // this function helps to generate the thumbnail by the help of an AI when id is not there
  const handleGenerate=async ()=>{
    // checking user is logged in or not
    if(!isLoggedIn) return toast.error('Please login to generate the thumbnails')
      // check when title is present or not
    if(!title.trim()) return toast.error('Title is required')
      setLoading(true)

    // setting up the api payload means what we include inside it to make the good prompt and send it to the backend
    const api_payload={
      title,
      prompt:additionalDetails,
      style,
      aspect_ratio:aspectRatio,
      color_scheme:colorSchemeId,
      text_overlay:true
    }

    // send the api_payload to backend api
    const {data}=await api.post('/api/thumbnail/generate',api_payload)
    
    if(data.thumbnail){
      navigate('/generate/',data.thumbnail._id)
      toast.success(data.message)
    }
  }

  // when id is there then we call the below function
  const fetchThumbnail=async()=>{
    // // when id fetched
    // Now we will fetch the id from the backend and we call the backend and getting comment for the last code
    try {
      const {data}=await api.get(`/api/user/thumbnail/${id}`)
      setThumbnail(data?.thumbnail as IThumbnail)
      setLoading(!data?.thumbnail?.image_url)
      setAdditionalDetails(data?.thumbnail?.user_prompt)
      setTitle(data?.thumbnail?.title)
      setColorSchemeId(data?.thumbnail?.color_scheme)
      setAspectRatio(data?.thumbnail?.aspect_ratio)
      setStyle(data?.thumbnail?.style)
    } catch (error:any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    }



    // front end code
    // if(id){
    //   // not checking the data type of the thumbnail
    //   const thumbnail:any=dummyThumbnails.find((thumbnail)=>thumbnail._id==id)
    //   /*
    //       {
    //     _id: "69451ff3c9ea67e4c930f6a6",
    //     userId: "6942b3bd2a93a220baa331b3",
    //     title: "Top smartwatch under 1499",
    //     style: "Bold & Graphic",
    //     aspect_ratio: "16:9",
    //     color_scheme: "vibrant",
    //     text_overlay: true,
    //     image_url: thumb_1,
    //     prompt_used: "add multiple smartwatches ",
    //     user_prompt: "add multiple smartwatches ",
    //     isGenerating: false,
    //     createdAt: "2025-12-19T09:50:43.727Z",
    //     updatedAt: "2025-12-19T09:51:07.874Z",
    //     __v: 0,
    // },
    //   */
    //   // set the current thumnail json format
    //   setThumbnail(thumbnail)
    //   // set the details of Additional Prompts details in generate.tsx file
    //   setAdditionalDetails(thumbnail.user_prompt)
    //   // set the title of current id topic
    //   setTitle(thumbnail.title)
    //   // set the current color scheme
    //   setColorSchemeId(thumbnail.color_scheme)
    //   // set the current aspect ratio with respect to id
    //   setAspectRatio(thumbnail.aspect_ratio)
    //   // set the thumbnail style of given document
    //   setStyle(thumbnail.style)
    //   // when the thumnail is not there then user click then loading is thete but stops when thumnail is generated
    //   setLoading(false)
    // }
  }

  // useEffect(()=>{
  //   // old code
  //   // if(id){
  //   //   fetchThumbnail()
  //   // }

  //   if(isLoggedIn && id){
  //     fetchThumbnail()
  //   }

  //   // when image is to be loading
  //   if(id && loading && isLoggedIn){
  //     const interval=setInterval(()=>{
  //       // fetching thumbnail every 5 seconds, trying to be executed every after 5 seconds
  //       fetchThumbnail()
  //     },5000);

  //     // before starting another loop ensures that old one should be deleted
  //     return ()=>clearInterval(interval)
  //   }
  //   // this function works any of the these three things changes id or loading or isLoggedIn
  // },[id,loading,isLoggedIn])

   useEffect(()=>{
    // old code
    // if(id){
    //   fetchThumbnail()
    // }

    if(isLoggedIn && id){
      fetchThumbnail()
    }

    // // when image is to be loading
    // if(id && loading && isLoggedIn){
    //   const interval=setInterval(()=>{
    //     // fetching thumbnail every 5 seconds, trying to be executed every after 5 seconds
    //     fetchThumbnail()
    //   },5000);
    socket.emit("join-thumbnail",id)

    // listen for completion
    socket.on("thumbnail-completed",()=>{
      fetchThumbnail()
    })

      // before starting another loop ensures that old one should be deleted
      return ()=>{
        socket.off("thumnail-completed")
      }
    },[id,loading,isLoggedIn])
    // this function works any of the these three things changes id or loading or isLoggedIn
  

  // this effect works when every time pathname is changing
  useEffect(()=>{
    if(!id && thumbnail){
      setThumbnail(null)
    }
  },[pathname])

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* LEFT PANEL */}
            <div className={`space-y-6 ${id && "pointer-events-none"}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-x1 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100mb-1">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI bring it to life
                  </p>
                </div>

                <div className="space-y-6">
                  {/* SET TITLE */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      value={title}
                      // title change to current value by the help of setTitle function
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="eg., 10 Tips for Better Sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 text-zinc-100 placeholder:text-zinc-400 focus: outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end">
                      {/* length changing when we type the characters */}
                      <span className="text-xs text-zinc-400">
                        {title?.length}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* AspectRatioSelector */}
                {/* This component is used to manage the ratio according the users they select the ratios */}
                <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio}/>

                {/* StyleSelector */}
                {/* It displays the selected thumbnail style with icon and description, and toggles a dropdown to allow users to change the style. */}
                <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen}/>

                {/* ColorSchemeSelector */}
                {/* This component manages the color schemes when user selected any of the colors schemes values to be highlighed
                and current selected name is displayed */}
                <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId}/>

                {/* DETAILS */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Additional Prompts
                    <span className="text-zinc-400 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={additionalDetails}
                    // Additional details change to current additional details
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={3}
                    placeholder="Add any specific elements, mood, or style preferences. .. "
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* BUTTON */}
                {/* when id is not there at starting and when loading is true then change to loading otherwise change to Generate Thumbnail */}
                 
                {!id && (
                  // attach the onclick property when id is not there means button is not there so no user clicks 
                  // user clicks button when id is not there
                  <button onClick={handleGenerate} className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-blue-500 to-blue-600 hover:from-blue-700 disabled: cursor-not-allowed transition-colors">
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>
            {/* RIGHT PANEL */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio}/>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
