import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import mainBg from "../../assets/images/main-bg.png";
export const MainLayout = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${mainBg})`,
          minHeight: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};
