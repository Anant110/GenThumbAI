import { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";

interface AIResponse {
  score: number;
  titles: string[];
  thumbnailText: string;
  suggestions: string[];
}

const AiHelp = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatisopen, setchatisopen] = useState(false);
  const [message, setMessage] = useState("");
  const [uimessage, setuimessage] =  useState<
  {
    role: "user" | "assistant";
    content: string;
  }[]
>([]);

  const [response, setResponse] = useState<AIResponse | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    // console.log(file);
    // console.log(file["name"]);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    // console.log(image);

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(",")[1];

          const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                inlineData: {
                  mimeType: image.type,
                  data: base64Image,
                },
              },
              {
                text: `
            Analyze this YouTube thumbnail.
            Return ONLY valid JSON:
            {
              "score": number,
              "titles": ["title1","title2","title3"],
              "thumbnailText": "Pick up the one best title from titles and make visible",
              "suggestions": [
                "suggestion1",
                "suggestion2",
                "suggestion3"
              ]
            }
              Rules:
              - score must be a number between 1 and 10.
              - provide suggestions in 5 words each.
`,
              },
            ],
          });
          const res = result.text;
          if (!res) {
            throw new Error("No response text returned from Gemini");
          }

          const cleaned = res
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          const analysis = JSON.parse(cleaned);

          // console.log(analysis);
          setResponse(analysis);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    // console.log(response)
    if(!response){
      return
    }
    const ai_thumbnail_response=response
    if (!message.trim()) return;

    setuimessage((prev) => [...prev,{
      role:'user',
      content:message
    }]);

    const currentMessage=message
    // console.log(message);

    setMessage("");

    try {
      const response=await fetch('https://gen-thumb-serverupdated.vercel.app/chat',{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        message:currentMessage,
        score:ai_thumbnail_response.score,
        suggestions: ai_thumbnail_response.suggestions,
        titles:ai_thumbnail_response.titles
      })
    });

    // this is the ai data
    const data=await response.json()
    // console.log(data)

    // store ai messages
    setuimessage((prev) => [...prev,{
      role:'assistant',
      content:data.reply
    }]);
      
    } catch (error) {
      console.log(error)
    }
  };

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [uimessage]);


  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-9">
          AI Thumbnail Helper
        </h1>

        <p className="text-center text-slate-400 mb-10">
          Upload a thumbnail and get AI-powered suggestions
        </p>

        {/* to show the messages to UI */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="mb-4">
              <label
                htmlFor="thumbnail-upload"
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-indigo-500 transition ${
                  preview ? "h-40" : "h-64"
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 mb-3 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>

                    <p className="text-slate-300 font-medium">
                      Click to Upload Thumbnail
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </>
                )}
              </label>

              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg border border-slate-700"
              />
            )}

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-lg font-semibold"
            >
              {loading ? "Analyzing..." : "Analyze Thumbnail"}
            </button>
          </div>

          {/* AI Response */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            {!response ? (
              <div className="text-slate-400 text-center mt-20">
                Upload a thumbnail to get AI suggestions
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Thumbnail Score</h2>

                  <div className="text-5xl font-bold text-green-400 mt-2">
                    {response.score}/10
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Suggested Titles
                  </h2>

                  <ul className="space-y-2">
                    {response.titles.map((title, index) => (
                      <li key={index} className="bg-slate-800 p-3 rounded-lg">
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Suggested Thumbnail Text
                  </h2>

                  <div className="bg-indigo-600 px-4 py-3 rounded-lg font-bold">
                    {response.thumbnailText}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>

                  <ul className="space-y-2">
                    {response.suggestions.map((item, index) => (
                      <li key={index} className="bg-slate-800 p-3 rounded-lg">
                        ✓ {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setchatisopen(!chatisopen)}
            className="
            fixed bottom-6 right-6
            h-16 w-16
            rounded-full
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            shadow-xl
            flex items-center justify-center
            hover:scale-110
            transition-all
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
              />
            </svg>
          </button>
          {chatisopen && (
            <div
              className="
            fixed
            bottom-24
            right-6
            w-96
            h-[550px]
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            shadow-2xl
            z-50
            flex
            flex-col
          "
            >
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-bold text-white">AI Thumbnail Coach</h3>
              </div>

              {/* <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth h-64 p-4 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none]"> */}
              <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth h-64 p-4 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none]"
                onWheel={(e) => {
    e.stopPropagation();
  }}>
                
                {uimessage.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-[80%]
                        px-4
                        py-3
                        rounded-2xl
                        shadow-md
                        break-words
                        ${
                          msg.role === "user"
                            ? "bg-violet-600 text-white rounded-br-md"
                            : "bg-slate-800 text-slate-100 rounded-bl-md border border-slate-700"
                        }
                      `}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-slate-700">
                <input
                  placeholder="Ask about your thumbnail..."
                  className="w-full bg-slate-800 text-white p-3 rounded-lg"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiHelp;
