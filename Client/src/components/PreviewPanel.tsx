import { DownloadIcon, ImageIcon, Loader2Icon } from "lucide-react";
import type { AspectRatio, IThumbnail } from "../assets/assets"

// 👉 This component is a preview screen for AI-generated thumbnails where:
// User waits → sees loading
// Image ready → sees preview + download
// Nothing yet → sees placeholder

// this component is mounted in generate.tsx file

const PreviewPanel = ({thumbnail,isLoading,aspectRatio}:{thumbnail:IThumbnail | null;isLoading:boolean;aspectRatio:AspectRatio}) => {

const aspectClasses = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
} as Record<AspectRatio, string>;

// Open the image in new window for download the image
const onDownload=()=>{
    if(!thumbnail?.image_url) return;
    // old code
    // // when user click on the button it open the image in new tab
    // window.open(thumbnail.image_url,'_blank')

    // code after the backend complets
    const link=document.createElement('a');
    link.href=thumbnail?.image_url.replace('/upload','upload/f1_attachment')
    document.body.appendChild(link)
    link.click()
    // cleanUp after download
    link.remove()
}

  return (
    <div className="relative mx-auto w-full max-w-2x1">
        <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]}`}>
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25">
                    <Loader2Icon className='size-8 animate-spin text-zinc-400'/>
                    <div className="text-center">
                        <p className="text-sm font-medium text-zinc-200">AI is creating your thumbnail ...</p>
                        <p className="mt-1 text-xs text-zinc-400">This may take 10-20 seconds</p>
                    </div>
                </div>
             )}

             {/* Image Preview */}
             {!isLoading && thumbnail?.image_url && (
                <div className="group relative h-full w-full">
                    <img src={thumbnail?.image_url} alt={thumbnail.title} className="h-full w-full object-cover"/>
                    <div className="absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">

                    {/*when user clicks on the Download button then onDownload button calls and it open image in another tab  */}
                       <button onClick={onDownload} type="button" className="mb-6 flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-medium transition bg-white/30 ring-2 ring-white/40 backdrop-blur hover:scale-105 active:scale-95">
                           {/* Getting the download icon from the lucid react */}
                            <DownloadIcon className="size-4"/>
                            Download Button
                        </button>
                    </div>
                </div>
             )}

             {/* Empty State */}
             {/* when the loading and url is not there then we make the empty state that how the wmpty state look like */}
             {!isLoading && !thumbnail?.image_url && (
                <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-1g border-2 border-dashed border-white/20 bg-black/25">
                   <div className="max-sm:hidden flex size-20 items-center justify-center rounded-full bg-white/10">
                        <ImageIcon className="size-10 text-white opacity-50"/>
                    </div>
                    <div className="px-4 text-center">
                        <p className="font text-zinc-200">Generate your first thumbnail</p>
                        <p className="mt-1 text-xs text-zinc-400">Fill out the form and click Generate</p>
                    </div>
                </div>
             )}
        </div>
    </div>
  )
}

export default PreviewPanel
