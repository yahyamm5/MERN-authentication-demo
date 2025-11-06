import { Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import HomePage from "./pages/HomePage.jsx";

function App() {

  return (
    <div>

      <Routes>
        <Route path='' element={<HomePage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/verify-email' element={<EmailVerificationPage/>} />
      </Routes>

    </div>
  )
}

export default App
