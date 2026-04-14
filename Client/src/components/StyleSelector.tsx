import {
  ChevronDownIcon,
  CpuIcon,
  ImageIcon,
  PenToolIcon,
  SparkleIcon,
  SquareIcon,
} from "lucide-react";
import { thumbnailStyles, type ThumbnailStyle } from "../assets/assets";

// This component mainly manages the thumnail styles as well as descriptions and manages the dropdown values by selection
// one style to another as well as displays the value of discription as well as styles

// style selector component props
// value:currently selected the thumbnail style
// onChange: function the update selected style
// isOpen: controls whether the dropdown opens or closed
// setIsOpen: function to toggle dropdown visibility

// This componenet is monted in generate.tsx file

const StyleSelector = ({
  value,
  onChange,
  isOpen,
  setIsOpen,
}: {
  value: ThumbnailStyle;
  onChange: (style: ThumbnailStyle) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  // object that stores description for each thumbnail style
  //   key:Thumbnail style and value: shown in description
  const styleDescriptions: Record<ThumbnailStyle, string> = {
    "Bold & Graphic": "High contrast, bold typography, striking visuals",
    Minimalist: "Clean, simple, lots of white space",
    Photorealistic: "Photo-based, natural looking",
    Illustrated: "Hand-drawn, artistic, creative",
    "Tech/Futuristic": "Modern, sleek, tech-inspired",
  };

  //  Maps each thumnail style to its corresponding icon for displaing in UI
  const styleIcons: Record<ThumbnailStyle, React.ReactNode> = {
    "Bold & Graphic": <SparkleIcon className="h-4 w-4" />,
    Minimalist: <SquareIcon className="h-4 w-4" />,
    Photorealistic: <ImageIcon className="h-4 w-4" />,
    Illustrated: <PenToolIcon className="h-4 w-4" />,
    "Tech/Futuristic": <CpuIcon className="h-4 w-4" />,
  };

  return (
    <div className="relative space-y-3 dark">
      <label className="block text-sm font-medium text-zinc-200">
        Thumbnail Style
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition bg-white/8 border-white/10 text-zinc-200 hover:bg-white/12"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium">
            {/* showing icons based on the current value */}
            {styleIcons[value]}
            {/* shows style name */}
            <span>{value}</span>
          </div>
          {/* showing the description based on the current value */}
          <p className="text-xs text-zinc-400">{styleDescriptions[value]}</p>
        </div>
        <ChevronDownIcon
          className={[
            "h-5 w-5 text-zinc-400 transition-transform",
            isOpen && "rotate-180",
          ].join(" ")}
        />
      </button>

      {/* It means when user click on the button and isopens is true then*/}
      {isOpen && (
        <div>
            {/* iterates all the thumbnail style one by one */}
          {thumbnailStyles.map((style) => (
            <button
              key={style}
              type="button"
            //   whenever we click on any other style then change with this style and dropdown is closed by selecting that particluar value
              onClick={() => {
                onChange(style);
                setIsOpen(false);
              }}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-black/30"
            >
                {/* displaing in UI the icons of particular thumbnail style */}
              <div className="mt-0.5">{styleIcons[style]}</div>
              <div>
                <p className="font-medium">{style}</p>
                   <p className="text-xs text-zinc-400">
                    {/* showing the description of every thumnail style */}
                     {styleDescriptions[style]}
                   </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleSelector;
