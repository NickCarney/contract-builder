import React, { useState, useEffect } from 'react';

const LogViewer = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      setLogs((prevLogs) => [...prevLogs, args.join(' ')]);
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  return (
    <div>
      <h2>Logs</h2>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;