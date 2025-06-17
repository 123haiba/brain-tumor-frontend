const TumorCard = ({ title, text, image, bg, textColor = "text-white" }) => {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:w-[90vw] md:max-w-[650px] md:h-[380px] rounded-[40px] shadow-lg ${bg} ${textColor} p-8 items-center justify-between transition-all duration-300`}
    >
      {/* Text Section */}
      <div className="flex-1 pr-4">
        <h3 className="text-4xl sm:text-5xl font-bold italic mb-4 md:mb-10 opacity-90">
          {title}
        </h3>
        <p className="text-lg font-medium italic leading-relaxed opacity-90">
          {text}
        </p>
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0 ml-4">
        <img
          src={image}
          alt={title}
          className="rounded-full w-36 h-36 sm:w-40 sm:h-40 object-cover"
        />
      </div>
    </div>
  );
};

export default TumorCard;
