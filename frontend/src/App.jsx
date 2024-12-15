import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/index.jsx';
import Navbar from './components/layout/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="py-4">
              <AppRoutes />
            </main>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
