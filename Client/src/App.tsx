import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import {Toaster} from 'react-hot-toast'
import AiHelp from "./pages/AiHelp";
import MyContact from "./pages/MyContact";
import About from "./pages/About";
import {useEffect } from "react";
import Compare from "./pages/Compare";
import Service from "./pages/Service";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
 
export default function App() {

    const {pathname}=useLocation()

    // this hook is call when the path is changed, whenever the path changes this function calls
    useEffect(()=>{
        // when user change the page the automatic go to top
        window.scrollTo(0,0)
    },[pathname])

    return (
        <>
        {/* using the toast notification on any part of the application */}
        <Toaster/>
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:id" element={<Generate />} />
                <Route path="/my-generation" element={<MyGeneration />} />
                <Route path="/preview" element={<YtPreview />} />
                <Route path="/login" element={<Login />} />
                <Route path="/help" element={<AiHelp />} />
                <Route path="/contact" element={<MyContact/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/compare" element={<Compare/>}/>
                <Route path="/service" element={<Service/>}/>
                <Route path="/success" element={<Success/>}/>
                <Route path="/cancel" element={<Cancel/>}/>
            </Routes>
            <Footer />
        </>
    );
}