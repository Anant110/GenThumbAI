import { colorSchemes } from "../assets/assets";

// This componenet basically manage the colors schemes inside the generator.tsx whenever user select any of the color scheme
// Then this function triggers here
const ColorSchemeSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-200">
        Color Scheme
      </label>

      <div className="grid grid-cols-6 gap-3">
        {colorSchemes.map((scheme)=>(
          <button key={scheme.id}
          onClick={()=>onChange(scheme.id)}
          // highlighted the current value is selected if value equals to current scheme id
          className={`relative rounded-lg transition-all ${value===scheme.id && 'ring-2 ring-pink-500'}`}
          title={scheme.name}>
            <div className='flex h-10 rounded-lg overflow-hidden'>
              {/* we will iterate inside the color array of each scheme value and dispalay in UI for background color */}
              {scheme.colors.map((color,i)=>(
                // updated the value in UI with three colors present in array
                <div key={i} className="flex-1" style={{backgroundColor:color}}/>
              ))}
            </div>
          </button>
        ))}
      </div>
      {/* display the current selected color name */}
      <p className="text-xs text-zinc-400">Selected:{colorSchemes.find((s)=>s.id===value)?.name}</p>
    </div>
  );
};

export default ColorSchemeSelector;
