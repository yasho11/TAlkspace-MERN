import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/SigninPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App(){
    const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

    const {theme}= useThemeStore();
    useEffect(() => {
        checkAuth();
    },[]);

    console.log(authUser);
    if(isCheckingAuth&& !authUser)return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin"/>
        </div>
    )
return (
    <div data-theme = {theme}>
        <Navbar />
        <Routes>
            <Route path="/" element={authUser ? <HomePage />: <Navigate to= "/signin"/>} />
            <Route path="/signup" element={!authUser ? <SignUpPage />: <Navigate to = "/"/>}  />
            <Route path="/signin" element={!authUser? <LoginPage /> : <Navigate to = "/"/>} />
            <Route path="/profile" element={authUser?  <ProfilePage />: <Navigate to="/signin"/>} />
            <Route path="/settings" element= {<SettingsPage/>}/>
        </Routes>

    <Toaster/>
    </div>
);
}

export default App;