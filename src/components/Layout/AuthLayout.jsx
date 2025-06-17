import mainBg from "../../assets/images/main-bg.png";
export const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Video background */}
      <video
        src="/vid.MP4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay for readability */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-10 opacity-70"
        style={{ backgroundImage: `url(${mainBg})` }}
      />

      <div className="relative z-20 w-[95%] max-w-[1100px] h-[90vh] rounded-md flex items-center justify-center">
        <div className="bg-[#ffffff08] backdrop-blur-sm rounded-xl p-8 sm:p-12 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
