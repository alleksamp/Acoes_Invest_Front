import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Se não tiver token, redireciona para a página de login
    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
};