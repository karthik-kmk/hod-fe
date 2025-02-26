import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import { gsap } from "gsap"; // Import GSAP

const FourthYearTeacher = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name") || "Teacher"; // Default to "Teacher" if no name is passed

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [students, setStudents] = useState([]); // State for student data
  const [selectedSubject, setSelectedSubject] = useState(""); // State for selected subject
  const [openStudentModal, setOpenStudentModal] = useState(false); // State for student data modal
  const modalRef = useRef(null); // Reference for modal element

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get-teachers-api`)
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((err) => {
        setError("Error fetching teachers");
        console.error(err);
      });
  }, []);

  const teacher = teachers.find((teacher) => teacher.name === name);

  const handleOpenModal = (subject) => {
    // Extract the parent table name from the subject (e.g., "4_csds_maths" -> "4_csds")
    const tableName = subject.split("_").slice(0, 2).join("_") + "_subjects"; // Add the "_subjects" suffix
    console.log("Parent table name:", tableName); // Log the parent table name to the console

    setSelectedSubject(subject); // Set the selected subject
    fetchStudents(tableName); // Fetch students for the selected table name
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    setSelectedSubject(""); // Clear the selected subject
    setStudents([]); // Clear the student data
  };

  const handleOpenStudentModal = () => {
    setOpenStudentModal(true); // Open the student data modal
  };

  const handleCloseStudentModal = () => {
    setOpenStudentModal(false); // Close the student data modal
  };

  // Fetch students from Flask API based on the table name
  const fetchStudents = (tableName) => {
    axios
      .get(`${API_BASE_URL}/modal-fetch-students?table=${tableName}`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        setError("Error fetching student data");
        console.error(err);
      });
  };

  useEffect(() => {
    if (openModal && modalRef.current) {
      // GSAP animation to scale the modal from 0 to 1 when it opens
      gsap.fromTo(
        modalRef.current,
        { scale: 0.5 },
        { scale: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, [openModal]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to 4th Year, {teacher ? teacher.name : name}!
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      {teacher ? (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Teacher Details:
          </Typography>
          <Typography>Name: {teacher.name}</Typography>
          <Typography>
            Subjects:
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 2 }}>
              {teacher.subjects
                .split(",")
                .filter((subject) => subject.trim().startsWith("4"))
                .map((subject, index) => (
                  <Button
                  key={index}
                  variant="contained"
                  onClick={() => handleOpenModal(subject.trim())}
                >
                  {subject.trim().replace(/_/g, " ").toUpperCase()}
                </Button>
                ))}
            </Box>
          </Typography>
        </Box>
      ) : (
        <Typography sx={{ marginTop: 2 }}>
          No teacher found with the name {name}
        </Typography>
      )}

      {/* Regular HTML Modal for subject selection */}
      {openModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            ref={modalRef} // Attach the ref to the modal element
            style={{
              backgroundColor: "white",
              padding: "20px",
              width: "95%",
              height: "90%",
              overflowY: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative", // To position the close icon
            }}
          >
            {/* Close Icon in the top-right corner */}
            <CloseIcon
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "30px",
              }}
            />

<Typography variant="h6" gutterBottom>
   {selectedSubject.replace(/_/g, " ").toUpperCase()}
</Typography>

            {/* Show Students Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenStudentModal}
              sx={{ marginBottom: 2 }}
            >
              Show Students
            </Button>
          </div>
        </div>
      )}

      {/* Modal for displaying student data */}
      {openStudentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              width: "95%",
              height: "90%",
              overflowY: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative", // To position the close icon
            }}
          >
            {/* Close Icon in the top-right corner */}
            <CloseIcon
              onClick={handleCloseStudentModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "30px",
              }}
            />

<Typography variant="h6" gutterBottom>
  Students in {selectedSubject.replace(/_/g, " ").toUpperCase()}
</Typography>
            {/* Material UI Table */}
            <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="students table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>USN</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.usn}</TableCell>
                        <TableCell>{student.role}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} style={{ textAlign: "center" }}>
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </Box>
  );
};

export default FourthYearTeacher;
