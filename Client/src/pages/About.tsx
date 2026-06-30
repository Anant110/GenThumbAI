import {
  Sparkles,
  ImagePlus,
  Download,
} from "lucide-react";

import AboutAI from "../assets/about_ai.png"

const About = () => {
  return (
    <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      
          * {
              font-family: 'Poppins', sans-serif;
          }
      `}</style>
      <h1 className="text-3xl font-semibold text-center mx-auto mt-30">About our apps</h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
          A visual collection of our most recent works - each piece crafted with intention, emotion and style.
      </p>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-0 py-10">
        <img
          className="w-[600px] h-[500px] rounded-xl -ml-30"
          src={AboutAI}
          alt="About AI"
        />
        <div>
    <h1 className="text-3xl font-semibold">AI-Powered Thumbnail Generation</h1>
    <p className="text-sm text-slate-500 mt-2">
        Create eye-catching YouTube, social media, and marketing thumbnails in seconds using AI-powered design automation.
    </p>
    <div className="flex flex-col gap-10 mt-6">
  
  <div className="flex items-center gap-4">
    <div className="size-10 flex items-center justify-center bg-indigo-50 border border-indigo-200 rounded">
      <Sparkles className="w-5 h-5 text-indigo-600" />
    </div>
    <div>
      <h3 className="text-base font-medium text-slate-600">
        AI-Powered Generation
      </h3>
      <p className="text-sm text-slate-500">
        Create stunning thumbnails instantly from simple text prompts.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-4">
    <div className="size-10 flex items-center justify-center bg-indigo-50 border border-indigo-200 rounded">
      <ImagePlus className="w-5 h-5 text-indigo-600" />
    </div>
    <div>
      <h3 className="text-base font-medium text-slate-600">
        Smart Design Suggestions
      </h3>
      <p className="text-sm text-slate-500">
        AI recommends layouts, colors, and styles for better engagement.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-4">
    <div className="size-10 flex items-center justify-center bg-indigo-50 border border-indigo-200 rounded">
      <Download className="w-5 h-5 text-indigo-600" />
    </div>
    <div>
      <h3 className="text-base font-medium text-slate-600">
        One-Click Export
      </h3>
      <p className="text-sm text-slate-500">
        Download high-quality thumbnails optimized for any platform.
      </p>
    </div>
  </div>

</div>
</div>
      </div>
  </>
  )
}

export default About
