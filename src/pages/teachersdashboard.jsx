import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const TeacherDashboard = () => {
  const location = useLocation();
  const { name } = location.state || { name: "Teacher" }; // Default to "Teacher" if no name is passed

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch teachers data from the Flask API
    axios
      .get("http://127.0.0.1:5000/get-teachers-api")
      .then((response) => {
        setTeachers(response.data); // Set the teachers data in state
      })
      .catch((err) => {
        setError("Error fetching teachers");
        console.error(err);
      });
  }, []);

  // Filter the teacher that matches the name passed in location state
  const teacher = teachers.find((teacher) => teacher.name === name);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            Navigation
          </Typography>
          <List>
  {["Home", "2nd Year", "3rd Year", "4th Year"].map((text, index) => (
    <ListItem button key={index}>
      <ListItemText
        primary={
          text === "2nd Year" ? (
            <Link to={`/secondyearteacher?name=${name}`}>2nd Year</Link>
          ) : text === "3rd Year" ? (
            <Link to={`/thirdyearteacher?name=${name}`}>3rd Year</Link>
          ) : text === "4th Year" ? (
            <Link to={`/fourthyearteacher?name=${name}`}>4th Year</Link>
          ) : (
            text
          )
        }
      />
    </ListItem>
  ))}
</List>


        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {name}!
        </Typography>
        <Typography variant="body1">This is your dashboard.</Typography>

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
            <List>
              <ListItem>
                <ListItemText
                  primary={`Name: ${teacher.name}`}
                  secondary={`Subjects: ${teacher.subjects}`}
                />
              </ListItem>
            </List>
          </Box>
        ) : (
          <Typography sx={{ marginTop: 2 }}>
            No teacher found with the name {name}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
