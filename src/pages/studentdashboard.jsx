import React from "react";
import { useLocation } from "react-router-dom";

const StudentDashboard = () => {
  const location = useLocation();
  const studentName = location.state?.name || "Student";  // Get name from state

  return (
    <div>
      <h2>Welcome, {studentName}!</h2>
    </div>
  );
};

export default StudentDashboard;
