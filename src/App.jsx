import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { CadastrarAcao } from './pages/CadastrarAcao/CadastrarAcao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/cadastrar"
          element={
            <ProtectedRoute>
              <CadastrarAcao />
            </ProtectedRoute>
          }
        />
        </Routes>

    </BrowserRouter>
  );
}

export default App;