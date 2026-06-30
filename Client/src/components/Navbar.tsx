import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/context";
import toast from "react-hot-toast";

export default function Navbar() {
  // import the isLoggedIn, user and logout functionality from the useAuth
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to="/">
          <img src="/logo1.svg" alt="logo" className="h-8.5 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to="/" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link to={user?.isSubscribed==true?"/generate":"#"} 
          className="hover:text-blue-500 transition"
          onClick={(e)=>{
            if(user?.isSubscribed==false){
              e.preventDefault()
              toast.error("Subscribed to Basic Plan")
            }
          }}
          >
          Generate
          </Link>
          {/* when the user is loggedin then only show the My Generations other wise shwing the about */}
          {isLoggedIn ? (
            <Link
              to={user?.product?.name=="Pro Plan AI Thumbnail App"?"/my-generation":"#"}
              onClick={(e)=>{
                if(user?.product?.name!=="Pro Plan AI Thumbnail App"){
                  e.preventDefault()
                  toast.error("Subscribed to Pro Plan")
                }
              }}
              className="hover:text-blue-500 transition"
            >
              My Generations
            </Link>
          ) : (
            <Link to="/about" className="hover:text-blue-500 transition">
              About
            </Link>
          )}

          {/* For Analyze Page */}
          {isLoggedIn && (
            <Link
              to={user?.product?.name==="Enterprise Plan AI Thumbnail App"?"/help":"#"}
              onClick={(e)=>{
                if(user?.product?.name!=="Enterprise Plan AI Thumbnail App"){
                  e.preventDefault() //prevent navigation
                  toast.error("Subscribed to Enterprise")
                }
              }}
              className="hover:text-blue-500 transition"
            >
              Analyze
            </Link>
          )}

          <Link to="/contact" className="hover:text-blue-500 transition">
            My Contact
          </Link>

          {/* For Service Page */}
          {isLoggedIn && (
            <Link
              to="/service"
              className="hover:text-blue-500 transition"
            >
              Services
            </Link>
          )}

        </div>
        <div className="flex items-center gap-2">
          {/* when the user not logged in then show the get started button which naigavigates to login and user is logged in then showing the first caharcter of the user in upper case */}
          {isLoggedIn ? (
            <div className="relative group">
              <button className="rounded-full size-8 bg-white/20 border-2 border-white/10">
                {user?.name?.charAt(0)?.toUpperCase()}
              </button>
              <div className="absolute hidden group-hover:block top-6 right-0 pt-4">
                {/* make the button for the logout when user clicks on the logout then it sets to logout by trigger fucntion
                in authcontext */}
                <button
                  onClick={() => logout()}
                  className="bg-white/20 border-2 border-white/10 px-5 py-1.5 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-full"
            >
              Get Started
            </button>
          )}
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <MenuIcon size={26} className="active:scale-90 transition" />
          </button>
        </div>
      </motion.nav>

      <div
        className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/generate" onClick={() => setIsOpen(false)}>
          Generate
        </Link>
        {isLoggedIn ? (
          <Link to="/my-generation" onClick={() => setIsOpen(false)}>
            My Generations
          </Link>
        ) : (
          <Link to="#" onClick={() => setIsOpen(false)}>
            About
          </Link>
        )}

        {/* For the Analyze Feature */}
        {isLoggedIn ? (
          <Link to="/help" onClick={() => setIsOpen(false)}>
           Analyze
          </Link>
        ) : (
          <Link to="#" onClick={() => setIsOpen(false)}>
            hfsijdif
          </Link>
        )}

        <Link to="#" onClick={() => setIsOpen(false)}>
          Contact Us
        </Link>
        {isLoggedIn ? (
          <Link
            to="#"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
          >
            Logout
          </Link>
        ) : (
          <Link to="/login" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        )}

        <button
          onClick={() => setIsOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
