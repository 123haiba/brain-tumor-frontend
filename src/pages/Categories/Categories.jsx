import { useState } from "react";
import TumorCard from "../../components/Shared/TumorCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Glioma from "../../assets/images/Glioma.png";
import Pituitary from "../../assets/images/Pituitary.png";
import Meningioma from "../../assets/images/Meningioma.png";

const tumors = [
  {
    title: "Glioma",
    text: "A glioma is a type of brain tumor that originates from glial cells, which support and protect neurons. These tumors can vary in severity, from slow-growing low-grade gliomas to aggressive high-grade forms like glioblastoma.",
    image: Glioma,
    bg: "bg-[#8da89b]",
    textColor: "text-white",
  },
  {
    title: "Pituitary",
    text: "A pituitary tumor is a growth in the pituitary gland, a small gland at the base of the brain that controls hormones. Most are non-cancerous but can affect body functions by pressing on nearby areas or changing hormone levels.",
    image: Pituitary,
    bg: "bg-[#c46c2b]",
    textColor: "text-[#e6cfc2]",
  },
  {
    title: "Meningioma",
    text: "A meningioma is a type of brain tumor that develops from the meninges, the protective membranes covering the brain and spinal cord. These tumors are typically benign but can cause various symptoms depending on their location and size.",
    image: Meningioma,
    bg: "bg-[#263C8D]",
    textColor: "text-[#e6cfc2]",
  },
];

const Categories = () => {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? tumors.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === tumors.length - 1 ? 0 : i + 1));
  const nextIndex = (index + 1) % tumors.length;

  return (
    <div className="min-h-screen flex items-start mt-5 md:mt-30 relative overflow-hidden">
      <div className="w-full max-w-[1100px] px-4 flex items-center justify-center relative">
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-60 md:left-80 sm:-bottom-46 -bottom-20 md:-bottom-20 sm:-translate-x-0  bg-transparent text-[#0a174e] w-14 h-14 rounded-full flex items-center justify-center text-2xl border-[3px] cursor-pointer border-white hover:bg-[#0a174e] hover:text-white transition z-20"
        >
          <FaArrowLeft className="text-white" />
        </button>

        {/* Cards Row */}
        <div className="flex flex-row items-center pl-40 w-full relative overflow-visible min-h-[340px] sm:pl-40 sm:flex-row sm:min-h-[340px] sm:justify-start justify-center  min-[320px]:pl-0 min-[320px]:pr-0 min-[320px]:min-h-0">
          {/* Current Card (left-aligned) */}
          <div className="z-10 sm:ml-[150px] ml-0 mb-4 sm:mb-0 flex justify-center">
            <TumorCard {...tumors[index]} textColor="text-white" />
          </div>
          {/* Next Card (half-shown on right) */}
          <div
            className="z-0 opacity-80 pointer-events-none hidden sm:block"
            style={{ transform: "scale(0.92)", marginLeft: 20 }}
          >
            <TumorCard {...tumors[nextIndex]} />
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-70 md:-right-80 sm:-bottom-46 -bottom-20 md:-bottom-20 sm:-translate-x-0 translate-x-[10px] bg-transparent text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl border-[3px] cursor-pointer border-white hover:bg-[#0a174e] hover:text-white transition z-20"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Categories;
