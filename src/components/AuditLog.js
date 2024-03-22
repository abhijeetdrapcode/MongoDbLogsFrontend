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
        const filteredLog = response.data.filter(entry => {
          return ['insertOperation', 'updateOperation', 'removeOperation'].includes(entry.atype) && 
                 entry.param.ns !== 'config.system.sessions' &&
                 !entry.param.ns.includes('local.startup_log');
        });
        setAuditLog(filteredLog);
      } catch (error) {
        console.error('Error fetching audit log:', error);
      }
    };

    fetchData();
  }, []);

  const opeartionName = (type) => {
    switch (type) {
      case 'insertOperation':
        return 'Insert';
      case 'updateOperation':
        return 'Update';
      case 'removeOperation':
        return 'Remove';
      default:
        return type;
    }
  };

  const handleRowClick = (operation) => {
    if (selectedOperation === operation) {
      setSelectedOperation(null);
    } else {
      setSelectedOperation(operation);
    }
  };

  const renderObjectProperties = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className="mb-3 text-center">
            <strong>{key}:</strong>
            <div className="ms-3">
              {renderObjectProperties(value)}
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} className="mb-3 text-center">
            <strong>{key}:</strong> {value}
          </div>
        );
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-white mb-4">MONGODB AUDIT LOGS</h2>
      <div className="table-responsive rounded">
        <table className="table table-bordered table-hover text-center rounded">
          <thead className="thead-dark">
            <tr>
              <th className="bg-dark text-white">Operation Type</th>
              <th className="bg-dark text-white">Timestamp</th>
              <th className="bg-dark text-white">Collection</th>
              <th className="bg-dark text-white">User</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((entry, index) => (
              <React.Fragment key={index}>
                <tr onClick={() => handleRowClick(entry)} style={{ cursor: 'pointer' }}>
                  <td>{opeartionName(entry.atype)}</td>
                  <td>{moment(entry.ts.$date).format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td>{entry.param.ns}</td>
                  <td>{entry.users[0] ? entry.users[0].user : 'Unknown'}</td>
                </tr>
                {selectedOperation === entry && (
                  <tr>
                    <td colSpan="4">
                      <div className="card mb-4 rounded">
                        <div className="card-header bg-dark text-white rounded-top">
                          <h5 className="mb-0">Operation Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <strong>Operation Type:</strong> {opeartionName(selectedOperation.atype)}
                          </div>
                          <div className="mb-3">
                            <strong>Timestamp:</strong> {moment(selectedOperation.ts.$date).format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                          <div className="mb-3">
                            <strong>IP Address:</strong> {selectedOperation.local.ip}
                          </div>
                          <div className="mb-3">
                            <strong>Collection:</strong> {selectedOperation.param.ns}
                          </div>
                          {renderObjectProperties(selectedOperation.param.doc)}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
