import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon from Material UI
import gsap from "gsap"; // Import GSAP
import { API_BASE_URL } from "../constants";
const ThirdYearTeacher = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name") || "Teacher"; // Default to "Teacher" if no name is passed

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]); // State to store students data
  const [loading, setLoading] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false); // State for second modal

  const modalRef = useRef(null); // Reference to the modal for GSAP animation

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

  const handleClickOpen = (subject) => {
    setSelectedSubject(subject);
    setOpen(true);
    fetchStudents(subject); // Fetch students when the button is clicked

    // Log the parent table name to the console with the "_subjects" suffix
    const parentTableName = `3_${subject.split("_")[1]}_subjects`; // Add "_subjects" suffix
    console.log("Parent Table Name:", parentTableName); // Display the parent table name in the console
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSubject("");
    setStudents([]); // Clear students data when modal is closed
    setShowStudentsModal(false); // Close the second modal when the first modal is closed
  };

  const fetchStudents = (subject) => {
    setLoading(true);
    const tableName = `3_${subject.split("_")[1]}_subjects`; // Add "_subjects" suffix to table name

    axios
      .get(`${API_BASE_URL}/modal-fetch-students?table=${tableName}`)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching students");
        setLoading(false);
        console.error(err);
      });
  };

  // GSAP animation when modal is opened
  useEffect(() => {
    if (open) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, [open]);

  // Open the second modal to show students
  const handleShowStudents = () => {
    setShowStudentsModal(true);
  };

  // Close the second modal
  const handleCloseStudentsModal = () => {
    setShowStudentsModal(false);
  };

  // Function to format the subject name (replace underscores with spaces and convert to uppercase)
  const formatSubjectName = (subject) => {
    return subject.replace(/_/g, " ").toUpperCase();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to 3rd Year, {teacher ? teacher.name : name}!
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
                .filter((subject) => subject.trim().startsWith("3"))
                .map((subject, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    onClick={() => handleClickOpen(subject.trim())}
                  >
                    {formatSubjectName(subject.trim())} {/* Display formatted subject */}
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

      {/* Custom Modal for Subject Details */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            ref={modalRef} // Attach the ref to the modal
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              width: "95%",
              height: "90%",
              overflowY: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Close Icon from Material UI at the top-right */}
            <CloseIcon
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "30px",
                color: "#333",
              }}
            />

            <Typography variant="h5" gutterBottom>
              {formatSubjectName(selectedSubject)} {/* Display formatted subject */}
            </Typography>
            <Button
              variant="contained"
              onClick={handleShowStudents}
              sx={{ marginBottom: 2 }}
            >
              Show Students
            </Button>
          </div>
        </div>
      )}

      {/* Second Modal to Show Students */}
      {showStudentsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              width: "95%",
              height: "90%",
              overflowY: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CloseIcon
              onClick={handleCloseStudentsModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "30px",
                color: "#333",
              }}
            />
           <Typography variant="h5" gutterBottom>
              Students in {formatSubjectName(selectedSubject)} {/* Display formatted subject */}
            </Typography>

            {loading ? (
              <Typography>Loading students...</Typography>
            ) : students.length > 0 ? (
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>USN</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.usn}</TableCell>
                        <TableCell>{student.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No students found for this subject.</Typography>
            )}
          </div>
        </div>
      )}
    </Box>
  );
};

export default ThirdYearTeacher;
