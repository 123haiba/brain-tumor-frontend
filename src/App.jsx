import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Otp from "./pages/Auth/Otp";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetPassword2 from "./pages/Auth/ResetPassword2";
import Home from "./pages/Home/Home";
import { MainLayout } from "./components/Layout/MainLayout";
import Categories from "./pages/Categories/Categories";
import Upload from "./pages/Upload/Upload";
import Services from "./pages/Services/Services";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import VerifyAccount from "./pages/Auth/VerifyAccount";
import Profile from "./pages/User/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brain-tumor-ai" element={<Upload />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/reset-password-email" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword2 />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        {/* Redirect to login for any unmatched routes */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
