import axios from 'axios';
import React from 'react';


const AdminPanel = () => {

  const connectToDrive = () => {
    const address = process.env.REACT_APP_SERVER_ADDRESS || '';
    const endpoint = address +'/api/auth/google';

    const token = localStorage.getItem('jwt');
    axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(function (resp) {
      console.log(resp);
      if (resp.data) {
        window.location.href = resp.data;
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div>
      <button onClick={connectToDrive}>Connect drive</button>
    </div>
  );
};

export default AdminPanel;
