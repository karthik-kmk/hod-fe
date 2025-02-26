import React, { useState } from 'react';
import axios from 'axios';
import "./teachersadd.css"

const AddTeacher = () => {
  const [file, setFile] = useState(null);
  const [teacherName, setTeacherName] = useState('');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle manual input changes
  const handleNameChange = (event) => setTeacherName(event.target.value);
  const handleUsnChange = (event) => setUsn(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value);

  // Handle Add Teacher (both CSV and manual input)
  const handleAddTeacher = async () => {
    if (file) {
      // Handle CSV upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://127.0.0.1:5000/upload_teacher', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(response.data.message);
        setFile(null); // Clear file input
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while uploading the CSV.');
      }
    } else if (teacherName.trim() && usn.trim() && password.trim()) {
      // Handle manual input
      try {
        const response = await axios.post('http://127.0.0.1:5000/add_teacher_manually', {
          name: teacherName,
          usn: usn,
          password: password,
          role: role
        });
        setMessage(response.data.message);
        setTeacherName('');
        setUsn('');
        setPassword('');
        setRole('teacher'); // Reset to default role
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while adding the teacher.');
      }
    } else {
      setMessage('Please fill all the fields or upload a CSV file.');
    }
  };

  return (
    <div style={{ padding: '20px' }} className='teachersadd-main'>
      <h1>Add Teacher</h1>

      {/* Manual Input */}
      <div style={{ marginCenter: '10px' }}>
        <input
          type="text"
          value={teacherName}
          onChange={handleNameChange}
          placeholder="Enter teacher name"
          style={{ padding: '5px', width: '200px', marginRight: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={usn}
          onChange={handleUsnChange}
          placeholder="Enter USN"
          style={{ padding: '5px', width: '200px', marginRight: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
          style={{ padding: '5px', width: '200px', marginRight: '10px' }}
        />
      </div>


      {/* File Input */}
      <div style={{ marginBottom: '20px' }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>

      {/* Add Teacher Button */}
      <button onClick={handleAddTeacher} style={{ padding: '10px 20px' }}>
        Add Teacher
      </button>

      {/* Message Display */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddTeacher;
