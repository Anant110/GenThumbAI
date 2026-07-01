import { useState } from "react";
import { Upload, Trophy, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/api";
// import { GoogleGenAI } from "@google/genai";

export default function Compare() {
  const [thumb1, setThumb1] = useState<File | null>(null);
  const [thumb2, setThumb2] = useState<File | null>(null);
  const [loading, setLoading]=useState(false)

  const[result,setresult]=useState<any>(null)


const [preview1, setPreview1] = useState<string>("");
const [preview2, setPreview2] = useState<string>("");

  const handleCompare = async () => {
    if (!thumb1 || !thumb2) {
      toast.error("Please upload both thumbnail");
      return;
    }
    try {
    setLoading(true)
    const formData = new FormData();
    formData.append("images", thumb1);
    formData.append("images", thumb2);
    // console.log(formData);
    // console.log(formData.get("thumbnail1"));
    // console.log(formData.get("thumbnail2"));
    // console.log(typeof(thumb1));
    // console.log(typeof(thumb2));
      const { data } = await api.post("/compare-thumbnail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(data);
      setresult(data)
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className=" text-blue-500 text-5xl font-bold">
            AI Thumbnail Comparison
          </h1>

          <p className="text-gray-400 mt-4">
            Upload two thumbnails and let AI decide which one performs better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Thumbnail A */}
          <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
            <h2 className="font-semibold mb-4">Thumbnail A</h2>

            <label className="border-2 border-dashed border-zinc-700 rounded-2xl h-80 flex flex-col justify-center items-center cursor-pointer">
              <Upload size={40} />
              <p className="mt-3 text-gray-400">Upload Thumbnail</p>
              <input
                type="file"
                hidden
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setThumb1(file);
                    setPreview1(URL.createObjectURL(file)); // Store Preview URL
                  }
                }}
              />
            </label>

            {thumb1 && <img src={preview1} alt="" className="mt-4 rounded-xl" />}
          </div>

          {/* VS */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
              VS
            </div>
          </div>

          {/* Thumbnail B */}
          <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
            <h2 className="font-semibold mb-4">Thumbnail B</h2>

            <label className="border-2 border-dashed border-zinc-700 rounded-2xl h-80 flex flex-col justify-center items-center cursor-pointer">
              <Upload size={40} />
              <p className="mt-3 text-gray-400">Upload Thumbnail</p>

              <input
                type="file"
                hidden
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setThumb2(file);
                    setPreview2(URL.createObjectURL(file)); // Store Preview URL
                  }
                }}
              />
            </label>

            {thumb2 && <img src={preview2} alt="" className="mt-4 rounded-xl" />}
          </div>
        </div>

        <div onClick={handleCompare} className="text-center mt-10">
          <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-full font-semibold text-lg">
            {loading? "Analyzing...":"Compare with AI"}
          </button>
        </div>

        {/* Result Card */}
{ result && (<div className="mt-12 bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-yellow-500" />
            <h2 className="text-2xl font-bold">Winner: {result.winner}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-800 p-5 rounded-2xl">
              <h3 className="font-semibold">Thumbnail A Score</h3>

              <p className="text-5xl font-bold text-green-400 mt-3">{result.thumbnailAScore}</p>
            </div>

            <div className="bg-zinc-800 p-5 rounded-2xl">
              <h3 className="font-semibold">Thumbnail B Score</h3>

              <p className="text-5xl font-bold text-red-400 mt-3">{result.thumbnailBScore}</p>
            </div>
          </div>

          <div className="mt-8 bg-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles />
              <h3 className="font-bold">AI Suggestions</h3>
            </div>

            <ul className="space-y-3 text-gray-300">
              {/* <li>✓ Increase text size in Thumbnail B</li>
              <li>✓ Improve color contrast</li>
              <li>✓ Add stronger emotional expression</li>
              <li>✓ Reduce visual clutter</li>
              <li>✓ Use brighter CTA elements</li> */}
              {result.suggestions.map((item:string,index:number)=>(
                <li key={index}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>)}
      </div>
    </div>
  );
}
