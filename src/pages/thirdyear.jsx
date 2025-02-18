import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./year.css";

const SecondYear = () => {
  const [tableList, setTableList] = useState([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openAddSubjectsModal, setOpenAddSubjectsModal] = useState(false);
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const location = useLocation();
  const year = location.pathname.includes("secondyear")
    ? "2"
    : location.pathname.includes("thirdyear")
    ? "3"
    : location.pathname.includes("fourthyear")
    ? "4"
    : "";

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_tables", {
          params: { year: year },
        });
        setTableList(response.data.tables);
      } catch (error) {
        setMessage(error.response?.data?.error || "An error occurred.");
      }
    };
    fetchTables();

    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_teachers");
        setTeachers(response.data.teachers);
      } catch (error) {
        setMessage(
          error.response?.data?.error ||
            "An error occurred while fetching teachers."
        );
      }
    };
    fetchTeachers();
  }, [year]);

  const handleDeleteTable = async (table) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/delete_table", {
        table_name: table,
      });
      setMessage(response.data.message);
      setTableList((prevList) => prevList.filter((t) => t !== table));
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  const handleAddSubjects = async () => {
    if (!selectedTable) {
      setMessage("No table selected.");
      return;
    }

    if (subjects.some((subject) => !subject.name || !subject.teacher)) {
      setMessage("Please fill in all subject names and teachers.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create_class_subjects",
        {
          table_name: selectedTable,
          subjects: subjects, // Sending both subject name and teacher
        }
      );
      setMessage(response.data.message);
      handleCloseAddSubjectsModal();
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "An error occurred while creating subjects."
      );
    }
  };
  const handleOpenModal = async (table) => {
    setSelectedTable(table);
    setOpenModal(true);

    console.log("API called with table_name:", table); // Log the table name

    try {
      const tableResponse = await axios.get(
        "http://127.0.0.1:5000/get_students_data",
        {
          params: { table_name: `${table}_subjects` },
        }
      );
      setTableData(tableResponse.data.data);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred while fetching data."
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTable(null);
    setCsvFile(null);
    setTableData([]);
  };

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleUploadCsv = async () => {
    if (!csvFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("table_name", selectedTable);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload_students",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message);
      handleCloseModal();
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "An error occurred while uploading the file."
      );
    }
  };

  const handleOpenAddSubjectsModal = () => {
    setOpenAddSubjectsModal(true);
  };

  const handleCloseAddSubjectsModal = () => {
    setOpenAddSubjectsModal(false);
    setNumSubjects(0);
    setSubjects([]);
  };

  const handleNumSubjectsChange = (event) => {
    setNumSubjects(event.target.value);
  };

  const handleGenerateSubjects = () => {
    const subjectInputs = [];
    for (let i = 0; i < numSubjects; i++) {
      subjectInputs.push({
        name: "",
        teacher: "",
      });
    }
    setSubjects(subjectInputs);
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value,
    };
    setSubjects(updatedSubjects);
  };

  return (
    <div>
      <Sidebar />
      <div style={{ padding: "20px" }} className="year">
        <h1>HOD Page</h1>
        {message && <p>{message}</p>}

        <div style={{ marginTop: "20px" }}>
          <h2>Created Tables</h2>
          {tableList
            .filter((table) => (table.match(/_/g) || []).length === 1) // Keep only tables with exactly one underscore
            .map((table, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onClick={() => handleOpenModal(table)}
                >
                  {table.replace(/_/g, " ").toUpperCase()}{" "}
                  {/* Replace underscore with space and convert to uppercase */}
                </button>
                <DeleteIcon
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={() => handleDeleteTable(table)}
                />
              </div>
            ))}
        </div>

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogContent>
            <p>
              {" "}
              CLASS:
              {selectedTable
                ? selectedTable.replace(/_/g, " ").toUpperCase()
                : ""}
            </p>
            {tableData.length > 0 ? (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {/* Extract column order from the first row of tableData, reverse it */}
                      {tableData.length > 0 &&
                        Object.keys(tableData[0])
                          .filter((key) => key !== "id") // Exclude "id"
                          .reverse() // Reverse the order
                          .map((key, index) => (
                            <th
                              key={index}
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              {key.toUpperCase()}
                            </th>
                          ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(row)
                          .filter((key) => key !== "id") // Exclude "id"
                          .reverse() // Reverse the order
                          .map((key, colIndex) => (
                            <td
                              key={colIndex}
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              {row[key]}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <p>Add Students Data</p>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <Button
                  onClick={handleUploadCsv}
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  Upload CSV
                </Button>
              </div>
            )}
            {/* Conditionally render the "Add Subjects" button */}
            {tableData.length === 0 && (
              <Button
                onClick={handleOpenAddSubjectsModal}
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Add Subjects
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAddSubjectsModal}
          onClose={handleCloseAddSubjectsModal}
        >
          <DialogTitle>Add Subjects</DialogTitle>
          <DialogContent>
            <TextField
              label="Number of Subjects"
              type="number"
              variant="outlined"
              fullWidth
              value={numSubjects}
              onChange={handleNumSubjectsChange}
              style={{ marginBottom: "10px" }}
            />
            <Button
              onClick={handleGenerateSubjects}
              color="primary"
              style={{ marginBottom: "20px" }}
            >
              Generate Subjects
            </Button>
            {subjects.map((subject, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <TextField
                  label={`Subject ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={subject.name}
                  onChange={(e) =>
                    handleSubjectChange(index, "name", e.target.value)
                  }
                  style={{ marginBottom: "10px" }}
                />
                <FormControl fullWidth>
                  <InputLabel>Teacher</InputLabel>
                  <Select
                    value={subject.teacher}
                    onChange={(e) =>
                      handleSubjectChange(index, "teacher", e.target.value)
                    }
                  >
                    {teachers.map((teacher, index) => (
                      <MenuItem key={index} value={teacher}>
                        {teacher}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddSubjectsModal} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddSubjects} color="primary">
              Add Subjects
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SecondYear;
