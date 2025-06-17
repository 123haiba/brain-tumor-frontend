import { useNavigate } from "react-router-dom";
import brain from "../../assets/images/brain.svg";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between items-center px-6 sm:px-20  text-white">
      <div className="flex flex-col text-center items-center justify-center gap-4 fade-in-right">
        <h1 className="text-4xl sm:text-[70px] font-extrabold text-center opacity-0 translate-x-10 animate-[fadeInRight_0.8s_ease-out_forwards]">
          Brain Tumor AI
        </h1>

        <p className="text-lg font-medium">Brain health is life health</p>
        <div className="flex flex-wrap justify-center gap-4 text-3xl">
          <button
            onClick={() => navigate("/brain-tumor-ai")}
            className="bg-greenback cursor-pointer hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold"
          >
            Get started
          </button>
          <button
            onClick={() => navigate("/faq")}
            className="bg-greenback cursor-pointer hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold"
          >
            Learn More
          </button>
        </div>
      </div>
      <img src={brain} alt="Brain AI" className=" fade-in-left" />
    </div>
  );
};

export default Home;
