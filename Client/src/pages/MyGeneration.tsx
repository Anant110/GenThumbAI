import { useEffect, useState } from "react";
import SoftBackdrop from "../components/SoftBackdrop";
import {
  type IThumbnail,
} from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { useAuth } from "../context/context";
import api from "../configs/api";
import toast from "react-hot-toast";
import {socket} from "./../configs/socket"

const MyGeneration = () => {
  // fetch isLoggedIn varaible from the contex file
  const {isLoggedIn}=useAuth()

  const navigate = useNavigate();

  //ITThumbnail defines the structure (shape) of thumbnails object
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);

  // providing the loading state
  const [loading, setLoading] = useState(false);

  // defining the aspectRartos as key valye pairs where both data type as string
  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  // fetch all the thumnails data from the backend api
  const fetchThumbnails = async() => {
    // old code
    // // treated dummyThumbnails data as ITThumbnail[](forced typecasting)
    // setThumbnails(dummyThumbnails as unknown as IThumbnail[])
    // setLoading(false)
    
    // new code
    try {
      // fetch all the thumnails data
      // console.log(api.defaults.baseURL);
      const {data}=await api.get('/api/user/thumbnails')
      // store the data
      // console.log(data);
      setThumbnails(data.thumbnails || [])
    } catch (error:any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    }

    finally{
      setLoading(false)
    }
  };

  const handleDownload = (image_url: string) => {
    // old code
    // window.open(image_url, "_blank");

    // new code
    const link=document.createElement('a');
    link.href=image_url.replace('/upload','upload/f1_attachment')
    document.body.appendChild(link)
    link.click()
    // cleanUp after download
    link.remove()
  };

  // create the function to delete any thumbnail
  const handleDelete = async (id: string) => {
    // old code
    // console.log(id);

    // new code
    try {
      // creating the confirmation wondow
      const confirm=window.confirm('Are you sure to delete this thumbnail?')
      // when not confirm
      if(!confirm) return
      
      // when confirm delete the specific thumbnail to find the id from the mongodb data
      const {data}=await api.delete(`/api/thumbnail/delete/${id}`)
      toast.success(data.message)
      // filter the thumnails data also,checking the deleted id inside the thumnails data if exist then delete from the thumbnils data
      setThumbnails(thumbnails.filter((t)=>t._id!==id))
      
    } catch (error) {
      console.log(error)
    }
  };

  // run only once when the component get loaded
  // old code
  // useEffect(() => {
  //   fetchThumbnails();
  // }, []);

  // new code
  // when isLoggedin true then only fetchThumbnails
useEffect(() => {
  if (isLoggedIn) {
    fetchThumbnails();

    // const interval = setInterval(() => {
    //   fetchThumbnails();
    // }, 5000); // every 5 sec
    socket.on("thumbnail-completed",()=>{
      fetchThumbnails()
    })

    // return () => clearInterval(interval);
    return () => {
      socket.off("thumbnail-completed")
    }
  }
}, [isLoggedIn]);

  return (
    <>
      <SoftBackdrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 1g:px-24 xl:px-32">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2x1 font-bold text-zinc-200">My Generations</h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage all your AI-generated thumbnails
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* making the 6 boxes and display the UI */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {/* thumbnails is expected a array data type becayse .length function is there */}
        {/* when thumnail is empty and loading is false */}
        {!loading && thumbnails?.length == 0 && (
          <div className="text-center py-24">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails yet
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Generate your first thumbnail to see it here
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && thumbnails?.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 2x1:columns-4 gap-8">
            {/* thumb has the argument same as the ITThumbnail which is the dummythumbnails*/}
            {thumbnails.map((thumb: IThumbnail) => {
              // the variable has the default value 16:9 otherwise use the thumb aspect ratio
              const aspectClass =
                aspectRatioClassMap[thumb.aspect_ratio || "16:9"];

              return (
                <div
                  key={thumb._id}
                  // when user is click on the image navigate to the below link with thumb id
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="mb-8 group relative cursor-pointer
              rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
                >
                  {/* IMAGE */}
                  {/* Fetching the image from the dummythumbnails */}
                  <div
                    className={`relative overflow-hidden rounded-t-xl ${aspectClass} bg-black`}
                  >
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      // when image_url is null then the below line is working
                      <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                        {/* when is Generating is true then Generating otherwise show no image */}
                        {thumb.isGenerating ? "Generating ... " : "No image"}
                      </div>
                    )}

                    {/* when isGenerating is true then doing this */}
                    {/* {thumb.isGenerating && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">Generating ...</div>} */}
                  </div>

                  {/* CONTENT  */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">{thumb.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.style}
                      </span>
                      <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.color_scheme}
                      </span>
                      <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.aspect_ratio}
                      </span>
                      </div>
                      <p>{new Date(thumb.createdAt!).toDateString()}</p>
                  </div>

                  {/* stoppropagation prevents an event from bubbling upto parent component */}
                  {/* parent component is also there with onClick property so we stop the user to don't reach parent component
                  for this we use the stopPropagation */}
                  <div onClick={(e)=>e.stopPropagation()} className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex">
                    {/* this is used for delete */}
                    <TrashIcon 
                    onClick={()=>handleDelete(thumb._id)} className="size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all"/>
                    {/* This is used for download the icon */}
                    <DownloadIcon 
                    onClick={()=>handleDownload(thumb.image_url!)} className='size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all'/>

                    <Link target="_blank" to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}` }>
                    <ArrowUpRightIcon className='size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all'/>
                      </Link>

                    </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGeneration;
