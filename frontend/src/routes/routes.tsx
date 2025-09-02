import { Routes, Route, BrowserRouter, } from 'react-router-dom';
import Login from '../features/Login/pages';

const AppRoutes = () => {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </BrowserRouter>

    )
}
export default AppRoutes