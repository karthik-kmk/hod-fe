import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import HodDashboard from "./pages/hoddashboard";
import SecondYear from "./pages/secondyear";
import ThirdYear from "./pages/thirdyear";
import FourthYear from "./pages/fourthyear";
import TeachersDashboard from "./pages/teachersdashboard";
import StudentDashboard from "./pages/studentdashboard";
import SecondYearTeacher from "./pages/secondyearteacher";
import ThirdYearTeacher from "./pages/thirdyearteacher";
import FourthYearTeacher from "./pages/fourthyearteacher";




const App = () => {
  return (
    <Router>
      <div>
       
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/hoddashboard" element={<HodDashboard />} />
          <Route path="/secondyear" element={<SecondYear />} />
          <Route path="/thirdyear" element={<ThirdYear />} />
          <Route path="/fourthyear" element={<FourthYear />} />
          <Route path="/teachersdashboard" element={<TeachersDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/secondyearteacher" element={<SecondYearTeacher />} />
          <Route path="/thirdyearteacher" element={<ThirdYearTeacher />} />
          <Route path="/fourthyearteacher" element={<FourthYearTeacher />} />
          
        
        </Routes>
      </div>
    </Router>
  );
};

export default App;
