import { Routes, Route, BrowserRouter, } from 'react-router-dom';
import Login from '../features/Login/pages';
import SideBar from '../components/sidebar';
import Test from '../components/test';
import Pill from '../components/Pill';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/sidebar" element={<SideBar />}></Route>
                <Route path="/dashboard" element={<SideBar />}></Route>
                <Route path="/test" element={<Test />}></Route>
                <Route path="/pill" element={<Pill label = "on hold" />}></Route>

            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes