import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import AdminLayout from "./layouts/AdminLayout";
import LayoutWithNavbar from './layouts/LayoutWithNavbar'
import Login from './pages/Login'
import Signup from './components/loginComponents/Signup'
import Profile from './pages/Profile'
import AdminPrivateRoute from "./service/AdminPrivateRoute";
import PrivateRoute from "./service/PrivateRoute";
import UserView from "./pages/UserView";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/user" element={<UserView />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
