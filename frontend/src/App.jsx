// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import UserSettings from "./pages/UserSettings";
import ProviderDashboard from "./pages/ProviderDashboard";
import Messages from "./pages/Messages";
import ProviderProfile from "./pages/ProviderProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
