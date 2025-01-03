import { useContext } from "react";
import Login from "./pages/Login"
import { ToastContainer } from 'react-toastify';
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashBoard from "./pages/Admin/DashBoard";
import AllApointments from "./pages/Admin/AllApointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { Routes, Route } from "react-router-dom";
import { DoctorContext } from "./context/DoctorContext";
// import { AdminContext } from "./context/AdminContext"; Note : bundler option no need to import
const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext)
  return (
    <>
      {aToken || dToken ? (
        <div className="bg-[#F8F9FD]">
          <ToastContainer />
          <Navbar/>
          <div className="flex items-start">
            <Sidebar/>
            <Routes>
              <Route path='/' element={<></>}></Route>
              <Route path='/admin-dashboard' element={<DashBoard/>}></Route>
              <Route path='/all-apointments' element={<AllApointments/>}></Route>
              <Route path='/add-doctor' element={<AddDoctor/>}></Route>
              <Route path='/doctor-list' element={<DoctorsList/>}></Route>
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <Login />
          <ToastContainer />
        </div>
      )}
    </>
  );
};


export default App
