import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / → Login page dikhao */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App