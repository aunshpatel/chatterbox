import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeleteProfileInstructions from './pages/DeleteProfileInstructions.jsx';
import ContactUs from './pages/ContactUs.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Home from './pages/Home.jsx';
import Header from './pages/components/Header.jsx';
import Footer from './pages/components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/delete-profile-instructions" element={<DeleteProfileInstructions />} />
        <Route path="/contact-us" element={<ContactUs />}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App;