import { Routes, Route, BrowserRouter, } from 'react-router-dom';
import Login from '../features/Login/pages';
import SideBar from '../components/sidebar';
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/test" element={<SideBar/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes