import React, { useState } from 'react';
import axios from 'axios';
import "./addclass.css"
const 
AddTable = () => {
  const [tableName, setTableName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateTable = async () => {
    if (!tableName) {
      setMessage('Table name is required.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/create_table', {
        table_name: tableName,
      });
      setMessage(response.data.message);
      setTableName('');  // Clear the input after adding
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className='class-main'>
      <input
        type="text"
        placeholder="Enter table name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={handleCreateTable} style={{ padding: '5px 10px' }}>
        Add Table
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddTable;
