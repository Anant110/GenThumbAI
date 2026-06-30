import {
  Wand2,
  BarChart3,
  Sparkles,
  Trophy,
  Bot,
  Type,
} from "lucide-react";

const services = [
  {
    icon: Wand2,
    title: "AI Thumbnail Generator",
    description:
      "Generate professional YouTube thumbnails in seconds using AI.",
  },
  {
    icon: BarChart3,
    title: "Thumbnail Analysis",
    description:
      "Get an AI score based on readability, contrast, and click potential.",
  },
  {
    icon: Sparkles,
    title: "CTR Optimization",
    description:
      "Receive AI-powered suggestions to improve thumbnail performance.",
  },
  {
    icon: Trophy,
    title: "Thumbnail Comparison",
    description:
      "Compare two thumbnails and discover the stronger option instantly.",
  },
  {
    icon: Bot,
    title: "AI Thumbnail Coach",
    description:
      "Ask questions and get expert thumbnail recommendations instantly.",
  },
  {
    icon: Type,
    title: "Title Suggestions",
    description:
      "Generate attention-grabbing titles that work with your thumbnail.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            AI Powered Services
          </span>

          <h2 className="text-5xl font-bold mt-6">
            Everything You Need To Create
<span className="block mt-3 pb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent leading-tight">
  High CTR Thumbnails
</span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            Generate, analyze, compare and optimize thumbnails using advanced AI.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-blue-500/20
                  bg-white/[0.03]
                  backdrop-blur-xl
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-blue-400/50
                  hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]
                "
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />

                {/* Icon */}
                <div
                  className="
                    w-14 h-14
                    rounded-2xl
                    flex items-center justify-center
                    bg-gradient-to-br
                    from-blue-500
                    to-cyan-400
                    shadow-[0_0_25px_rgba(59,130,246,0.5)]
                  "
                >
                  <Icon size={28} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mt-6 text-white">
                  {service.title}
                </h3>

                <p className="text-gray-400 mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}