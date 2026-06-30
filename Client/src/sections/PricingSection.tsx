"use client";

import SectionTitle from "../components/SectionTitle";
import { pricingData } from "../data/pricing";
import type { IPricing } from "../types";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";
import api from "../configs/api";
import { useAuth } from "../context/context";

export default function PricingSection() {
  const { user } = useAuth();

  const ProductMap: Record<string, string> = {
    Basic: "Basic Plan AI Thumbnail App",
    Pro: "Pro Plan AI Thumbnail App",
    Enterprise: "Enterprise Plan AI Thumbnail App",
  };

  const planLevel: Record<string, number> = {
    "Basic Plan AI Thumbnail App": 1,
    "Pro Plan AI Thumbnail App": 2,
    "Enterprise Plan AI Thumbnail App": 3,
  };

  const handlecheckout = async (product: { name: string; price: number }) => {
    try {
      const { data } = await api.post("/create-checkout-session", {
        product,
      });

      window.location.href = data.url;
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Pricing"
        text2="Our Pricing Plans"
        text3="Flexible pricing options designed to meet your needs — whether you're just getting started or scaling up."
      />

      <div className="flex flex-wrap items-center justify-center gap-8 mt-20">
        {pricingData.map((plan: IPricing, index: number) => {
          const isActivePlan =
            user?.isSubscribed && user?.product?.name === ProductMap[plan.name];

          const currentPlanLevel = user?.product?.name
            ? planLevel[user.product.name]
            : 0;

          const cardPlanLevel = planLevel[ProductMap[plan.name]];

          return (
            <motion.div
              key={index}
              className={`w-72 text-center border border-blue-950 p-6 pb-16 rounded-xl ${
                plan.mostPopular ? "bg-blue-950 relative" : "bg-blue-950/30"
              }`}
              initial={{ y: 150, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 320,
                damping: 70,
                mass: 1,
              }}
            >
              {plan.mostPopular && (
                <p className="absolute px-3 text-sm -top-3.5 left-3.5 py-1 bg-blue-400 rounded-full">
                  Most Popular
                </p>
              )}

              <p className="font-semibold">{plan.name}</p>

              <h1 className="text-3xl font-semibold">
                ${plan.price}
                <span className="text-gray-500 font-normal text-sm">
                  /{plan.period}
                </span>
              </h1>

              <ul className="list-none text-slate-300 mt-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckIcon className="size-4.5 text-blue-600" />
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>

              {isActivePlan ? (
                <div className="w-full py-2.5 mt-7 rounded-md bg-green-500 text-white font-medium">
                  Your Subscription is Active ✅
                </div>
              ) : currentPlanLevel > cardPlanLevel ? (
                <div className="bg-gray-500 text-white py-2.5 rounded-md mt-7">
                  Already Included in Your Plan
                </div>
              ) : (
                <button
                  onClick={() =>
                    handlecheckout({
                      name: ProductMap[plan.name],
                      price: plan.price,
                    })
                  }
                  type="button"
                  className={`w-full py-2.5 rounded-md font-medium mt-7 transition-all ${
                    plan.mostPopular
                      ? "bg-white text-blue-600 hover:bg-slate-200"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Get Started
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
