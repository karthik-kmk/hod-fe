import React from 'react';

import Sidebar from '../components/sidebar';
import TeachersAdd from '../components/teachersadd';
import AddClass from '../components/addclass';


const hod = () => {
  return (
    
    <div>
      <p>HOD Dashboard</p>
      <Sidebar/>
      <TeachersAdd />
      <AddClass />
     
    
    </div>
  );
};

export default hod;
