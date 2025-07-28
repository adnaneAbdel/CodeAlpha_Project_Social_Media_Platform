import { Login , Register, HomePage, DashboardForAll , DashboardUser, UserProfile } from "./components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
 <>

 <Router>
 <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/DashboardUser" element={<DashboardUser />} />
          <Route path="/DashboardForAll" element={<DashboardForAll />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
    </Router>
  
 </>
  );
}

export default App;