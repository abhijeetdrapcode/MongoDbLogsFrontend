import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api');
        setAuditLog(response.data);
      } catch (error) {
        console.error('Error fetching audit log:', error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (operation) => {
    setSelectedOperation(operation);
  };

  return (
    <div className="container mt-5">
      <h2>Audit Log</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Operation Type</th>
            <th>Timestamp</th>
            <th>Collection</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {auditLog.map((entry, index) => (
            <tr key={index} onClick={() => handleRowClick(entry)}>
              <td>{entry.atype}</td>
              <td>{moment(entry.ts.$date).format('YYYY-MM-DD HH:mm:ss')}</td>
              <td>{entry.param.ns}</td>
              <td>{entry.users[0] ? entry.users[0].user : 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOperation && (
        <div className="mt-5">
          <h3>Selected Operation Details</h3>
          <div className="card">
            <div className="card-body">
              <pre>{JSON.stringify(selectedOperation, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
