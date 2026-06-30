"use client";
import { CheckIcon, ChevronRightIcon, VideoIcon } from "lucide-react";
import TiltedImage from "../components/TiltImage";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/context";
import toast from "react-hot-toast";

export default function HeroSection() {
  // const navigate = useNavigate();
  const { user } = useAuth();

  const specialFeatures = [
    "No design skills needed",
    "Fast Generation",
    "High CTR Templates",
  ];

  return (
    <div className="relative flex flex-col items-center justify-center px-4 md:px-10 lg:px-24 xl:px-32">
      <div className="absolute top-30-z-10 left-1/4 size-72 bg-blue-500 blur-[300px]"></div>
      <motion.a
        className="group flex items-center gap-2 rounded-full p-1 pr-3 mt-40 text-blue-200 bg-blue-300/15"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        <span className="bg-blue-800 text-white text-xs px-3.5 py-1 rounded-full">
          NEW
        </span>
        <p className="flex items-center gap-1">
          <span>Generate your first thumbnail for free </span>
          <ChevronRightIcon
            size={16}
            className="group-hover:translate-x-0.5 transition duration-300"
          />
        </p>
      </motion.a>
      <motion.h1
        className="text-5xl/17 md:text-6xl/21 font-medium max-w-2xl text-center"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
      >
        Create Stunning Thumbnails with{" "}
        <span
          className="
    px-3 rounded-xl text-nowrap font-semibold text-white
    bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600
    shadow-[0_0_20px_rgba(59,130,246,0.7)]
  "
        >
          AI
        </span>{" "}
      </motion.h1>
      <motion.p
        className="text-base text-center text-slate-200 max-w-lg mt-6"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 320,
          damping: 70,
          mass: 1,
        }}
      >
        No complexity. No noise. Just stunning AI-generated
        thumbnails—instantly.
      </motion.p>
      <motion.div
        className="flex items-center gap-4 mt-8 relative z-50"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        <Link to={
          user?.isSubscribed==true?"/generate":"#"
        }
        onClick={(e)=>{
          if(user?.isSubscribed==false){
            e.preventDefault()
            toast.error("Subscribed to Basic Plan")
          }
        }}
        >
          <button
            // onClick={() => navigate("/generate")}
            className="relative z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-7 h-11"
          >
            Generate Now
          </button>
        </Link>

        {/* watch demo button */}
        <button className="flex items-center gap-2 border border-blue-900 hover:bg-blue-950/50 transition rounded-full px-6 h-11">
          <VideoIcon strokeWidth={1} />
          <span>Watch demo</span>
        </button>

        {/* compare now button */}
        <Link
          to={
            user?.product?.name === "Enterprise Plan AI Thumbnail App"
              ? "/compare"
              : "#"
          }
          onClick={(e) => {
            if (user?.product?.name !== "Enterprise Plan AI Thumbnail App") {
              e.preventDefault();
              toast.error("Subscibed to Enterprise Plan");
            }
          }}
        >
          <button
            // onClick={() => navigate("/compare")}
            className="flex items-center gap-2 border text-black bg-white hover:bg-blue-600 transition rounded-full px-6 h-11"
          >
            <span>Compare Now</span>
          </button>
        </Link>
        {/* <button
          onClick={() => navigate("/compare")}
          className="flex items-center gap-2 border text-black bg-white hover:bg-blue-600 transition rounded-full px-6 h-11"
        >
          <span>Compare Now</span>
        </button> */}
      </motion.div>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
        {specialFeatures.map((feature, index) => (
          <motion.p
            className="flex items-center gap-2"
            key={index}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.3 }}
          >
            <CheckIcon className="size-5 text-blue-600" />
            <span className="text-slate-400">{feature}</span>
          </motion.p>
        ))}
      </div>
      <TiltedImage />
    </div>
  );
}
