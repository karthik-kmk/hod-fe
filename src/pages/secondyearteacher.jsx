import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { gsap } from "gsap";
import Papa from "papaparse";
import { API_BASE_URL } from "../constants";

const SecondYearTeacher = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name") || "Teacher";

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [tableName, setTableName] = useState("");
  const [allTables, setAllTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableNameModal, setShowTableNameModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = React.useRef(null);

  // Fetch teachers on component mount
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

  // Fetch all tables on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get-all-tables`)
      .then((response) => {
        setAllTables(response.data.tables);
      })
      .catch((err) => {
        console.error("Error fetching tables:", err);
      });
  }, []);

  // Filter tables based on the selected subject prefix
  const filteredTables = allTables.filter((table) =>
    table.startsWith(`${selectedSubject}_`)
  );

  // Handle table name click
  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
    fetchTableData(tableName);
    setShowTableNameModal(true);
  };

  // Fetch table data
  const fetchTableData = async (tableName) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-table-data?table_name=${tableName}`
      );
      setTableData(response.data.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setTableData([]);
    }
    setIsLoading(false);
  };

  // Handle CSV file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          uploadCSV(file);
        },
        header: true,
      });
    }
  };

  // Upload CSV file to the server
  const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("table_name", selectedTable);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-csv-quiz?table_name=${selectedTable}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      fetchTableData(selectedTable); // Refresh table data after upload
    } catch (error) {
      alert("Error uploading file");
    }
  };

  // Handle button click for subject selection
  const handleButtonClick = (buttonName) => {
    const tableName = buttonName.split("_").slice(0, 2).join("_") + "_subjects";
    fetchStudentData(tableName);
    setSelectedSubject(buttonName);
    setOpen(true);
  };

  // Fetch student data
  const fetchStudentData = (tableName) => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/modal-fetch-students?table=${tableName}`)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  };

  // GSAP animation for modal
  useEffect(() => {
    if (open) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, [open]);

  // Format subject name
  const formatSubjectName = (subjectName) =>
    subjectName.replace(/_/g, " ").toUpperCase();

  // Format student name
  const formatStudentName = (studentName) =>
    studentName.replace(/_/g, " ").toUpperCase();

  // Handle adding a new quiz table
  const handleAddQuiz = async () => {
    if (!tableName) {
      alert("Please enter a table name for the quiz.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/create_quiz_table`,
        {
          table_name: `${selectedSubject}_${tableName}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Quiz table created successfully!");
        setAllTables((prevTables) => [
          ...prevTables,
          `${selectedSubject}_${tableName}`,
        ]);
        setTableName("");
      } else {
        alert(`Error creating quiz table: ${response.data.error}`);
      }
    } catch (error) {
      alert(`Error creating quiz table: ${error.message}`);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to 2nd Year, {name}!
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      {teachers.length > 0 ? (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Teacher Details:
          </Typography>
          <Typography>Name: {name}</Typography>
          <Typography>
            Subjects:
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 2 }}
            >
              {teachers[0].subjects
                .split(",")
                .filter((subject) => subject.trim().startsWith("2"))
                .map((subject, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    onClick={() => handleButtonClick(subject.trim())}
                  >
                    {formatSubjectName(subject.trim())}
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

      {/* Modal to display table data and CSV upload */}
      {open && (
        <div
          ref={modalRef}
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
            style={{
              width: "95%",
              height: "90%",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                position: "absolute",
                top: "5%",
                right: "5%",
                color: "black",
                zIndex: 1000,
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginTop: 2,
                marginBottom: 3,
              }}
            >
              <input
                type="text"
                placeholder="Enter quiz table name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuiz}
              >
                Add Quiz
              </Button>
            </Box>

            <Button
              variant="contained"
              onClick={() => setShowStudentModal(true)}
            >
              Show Students
            </Button>

            {/* Modal to show students */}
            {showStudentModal && (
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
                    width: "80%",
                    height: "80%",
                    padding: "20px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    overflowY: "auto",
                    position: "relative",
                  }}
                >
                  <IconButton
                    onClick={() => setShowStudentModal(false)}
                    sx={{
                      position: "absolute",
                      top: "5%",
                      right: "5%",
                      color: "black",
                      zIndex: 1000,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <Typography variant="h6" gutterBottom>
                    Students in {formatSubjectName(selectedSubject)}
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : students.length > 0 ? (
                    <TableContainer component={Paper}>
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
                              <TableCell>
                                {formatStudentName(student.name)}
                              </TableCell>
                              <TableCell>{student.usn}</TableCell>
                              <TableCell>{student.role}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No students found.</Typography>
                  )}
                </div>
              </div>
            )}

            {/* Display filtered tables with the selected subject prefix */}
            {selectedSubject && (
              <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                Tables for {formatSubjectName(selectedSubject)}:
              </Typography>
            )}
            <List>
              {filteredTables.map((table, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleTableClick(table)}
                >
                  <ListItemText primary={table} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      )}

      {/* Modal to display table name and CSV upload */}
      {showTableNameModal && (
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
      zIndex: 1002,
      overflow: "auto",
    }}
  >
    <div
      style={{
        width: "50%",
        height: "auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => setShowTableNameModal(false)}
        sx={{
          position: "absolute",
          top: "5%",
          right: "5%",
          color: "black",
          zIndex: 1000,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" gutterBottom>
        Selected Table:
      </Typography>
      <Typography variant="h5">{selectedTable}</Typography>

      {/* Conditional Rendering Based on Table Name */}
      {selectedTable.endsWith("_results") ? (
        <Typography variant="h4" sx={{ marginTop: 3 }}>
          Hi
        </Typography>
      ) : (
        <>
          <h2>Upload CSV File</h2>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          {isLoading ? (
            <CircularProgress />
          ) : (
            tableData.length > 0 && (
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        "question",
                        "option1",
                        "option2",
                        "option3",
                        "option4",
                        "correct_option",
                      ].map((key) => (
                        <TableCell key={key}>
                          {key.replace("_", " ").toUpperCase()}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        {[
                          "question",
                          "option1",
                          "option2",
                          "option3",
                          "option4",
                          "correct_option",
                        ].map((key, i) => (
                          <TableCell key={i}>{row[key]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}
        </>
      )}
    </div>
  </div>
)}
    </Box>
  );
};

export default SecondYearTeacher;
