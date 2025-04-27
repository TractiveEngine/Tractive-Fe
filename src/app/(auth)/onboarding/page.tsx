"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  OnboardingSchemaType,
} from "@/schemas/onboardingSchema";
import Image from "next/image";
import { Button } from "@/components/Button";
import { useState } from "react";
import { IoIosCheckmark } from "react-icons/io";

const states = [
  "Lagos",
  "Abuja",
  "Kano",
  "Kaduna",
  "Oyo",
  "Rivers",
  "Enugu",
  "Delta",
  "Edo",
];

const interests = [
  "fish",
  "Tubers",
  "Grains",
  "Edible",
  "Livestock",
  "Vegetable",
];

export default function OnboardingForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingSchemaType>({
    resolver: zodResolver(onboardingSchema),
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest];

      setValue(
        "interests",
        updated as [
          "fish" | "Tubers" | "Grains" | "Edible" | "Livestock" | "Vegetable",
          ...(
            | "fish"
            | "Tubers"
            | "Grains"
            | "Edible"
            | "Livestock"
            | "Vegetable"
          )[]
        ]
      ); // 🔑 sync with react-hook-form
      return updated;
    });
  };
  const onSubmit = (data: OnboardingSchemaType) => {
    const finalData = {
      ...data,
      interests: selectedInterests,
    };
    console.log("Form Data:", finalData);
  };

  return (
    <>
      <div className="w-full bg-[#f1f1f1] md:bg-[#fefefe] lg:flex">
        <div className="hidden lg:block w-[868px] h-screen">
          <Image
            src="/images/Tomato.png"
            alt="tomatoCarrot"
            width={868}
            height={1080}
            className="w-[868px] h-full"
          />
        </div>

        <div className="w-full lg:w-[70%] lg:mx-auto flex items-center justify-center">
          <div className="w-[90%] md:w-[70%] mx-auto flex flex-col">
            <h1 className="text-[18px] lg:text-[17px] py-4 text-center font-montserrat text-[#538e53] font-normal">
              Kudos! you are almost done!
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-2xl mx-auto space-y-6 p-6"
            >
              {/* State and CAC */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                    State
                  </label>
                  <select
                    {...register("state")}
                    className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  >
                    <option value="">Select</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                    CAC (optional)
                  </label>
                  <input
                    type="text"
                    {...register("CAC")}
                    className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[13px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                    placeholder="Eg 1246474545"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                  Address
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[13px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  placeholder="House address"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Mobile and Alternative */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    {...register("mobile")}
                    className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                    placeholder="Eg 1246474545"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                    Alternative (optional)
                  </label>
                  <input
                    type="tel"
                    {...register("alternativeMobile")}
                    className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                    placeholder="Eg 1246474545"
                  />
                  {errors.alternativeMobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.alternativeMobile.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-[13px] font-montserrat font-normal text-[#2b2b2b]">
                  Business Name
                </label>
                <input
                  type="text"
                  {...register("businessName")}
                  className="mt-1 w-full border-[0.5px] font-montserrat border-[#808080] rounded px-3 py-2 text-[14px] placeholder:text-[12px] placeholder:text-[#808080] focus:outline-none focus:ring-[0.1px] focus:ring-[#538e53] focus:border-[#538e53]"
                  placeholder="Enter business name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              {/* Interests (Toggle Radio) */}
              <div className="flex flex-col gap-2">
                <label className="block text-[12px] font-montserrat font-normal text-[#808080]">
                  I am interested in:
                </label>
                <div className="flex flex-wrap gap-4">
                  {interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <label
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`flex items-center cursor-pointer border-[0.5px] rounded-full px-[7px] py-[4px] gap-2 text-[12.7px] font-montserrat transition-all ${
                          isSelected
                            ? "bg-[#538e53] text-[#fefefe]"
                            : "text-[#808080] border-[#808080]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={interest}
                          checked={isSelected}
                          className="hidden"
                          {...register("interests")}
                          onChange={() => toggleInterest(interest)}
                        />
                        <span
                          className={`w-[1.2rem] h-[1.2rem] rounded-full border flex items-center justify-center ${
                            isSelected ? "bg-[#fefefe]" : "border-[#808080]"
                          }`}
                        >
                          {isSelected && (
                            <IoIosCheckmark className="w-[2rem] h-[2rem] text-[#538e53] rounded-full" />
                          )}
                        </span>
                        {interest}
                      </label>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.interests.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div>
                <Button
                  onClick={() => {
                    handleSubmit(onSubmit)();
                  }}
                  className="w-full py-2 px-4 bg-[#538e53] flex items-center justify-center text-[#fefefe] rounded transition"
                  text="Done"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
