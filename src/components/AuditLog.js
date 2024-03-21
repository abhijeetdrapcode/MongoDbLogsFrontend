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

  return (
    <div className="container mt-5" style={{ fontFamily: 'Arial, sans-serif' }}>
      <h2 className='text-center text-white'>MongoDB Audit Log</h2>
      <div className="table-responsive text-center rounded">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Operation Type</th>
              <th>Timestamp</th>
              <th>Collection</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((entry, index) => (
              <React.Fragment key={index}>
                <tr onClick={() => handleRowClick(entry)}>
                  <td>{opeartionName(entry.atype)}</td>
                  <td>{moment(entry.ts.$date).format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td>{entry.param.ns}</td>
                  <td>{entry.users[0] ? entry.users[0].user : 'Unknown'}</td>
                </tr>
                {selectedOperation === entry && (
                  <tr>
                    <td colSpan="4">
                      <div className="card">
                        <div className="card-body" style={{ textAlign: 'left' }}>
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
                          {Object.keys(selectedOperation.param.doc).map(key => (
                            <div key={key} className="mb-3">
                              <strong>{key}:</strong>
                              {typeof selectedOperation.param.doc[key] === 'object' ? (
                                <pre>{JSON.stringify(selectedOperation.param.doc[key], null, 2)}</pre>
                              ) : (
                                <span>{selectedOperation.param.doc[key]}</span>
                              )}
                            </div>
                          ))}
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


