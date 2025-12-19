import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(response => {
        if (!response.ok) throw new Error('Backend not responding')
        return response.json()
      })
      .then(json => setData(json))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5' }}>
      <h1>M4 Air Fullstack Test</h1>
      <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {error ? (
          <p style={{ color: 'red' }}>Error: {error} (Check Python tab!)</p>
        ) : data ? (
          <p>Message from Python: <strong>{data.message}</strong></p>
        ) : (
          <p>Connecting...</p>
        )}
      </div>
    </div>
  )
}

export default App
