import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('@AcoesInvest:token');

    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
};