import { Routes, Route, BrowserRouter, } from 'react-router-dom';
import Login from '../features/Login/pages';
import Pill from '../components/Pill';
import { UsersTablePage } from '../features/Admin/UsersManagement/pages/View';
import { AppLayout } from '../layouts/AppLayout';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<AppLayout />}>
                    <Route path="dashboard" element={<div>Dashboard content</div>} />
                    <Route path="users" element={<UsersTablePage />} />
                    <Route path="pill" element={<Pill label="on hold" />} />
                    <Route path="*" element={<div>Not found</div>} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes