import React, {useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = login(username, password);
        if (!success) {
            setError('Invalid username or password');
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                    <div className="login-header">
                        <h1>Sistema de Administración</h1>
                        <h2>Iniciar Sesión</h2>
                    </div>
            
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Usuario:</label>
                        <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Ingresa tu usuario"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Ingresa tu contraseña"
                        />
                    </div>
            
                    {error && <div className="error-message">{error}</div>}
            
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            
                <div className="demo-credentials">
                        <h3>Credenciales de prueba:</h3>
                        <div className="credential-item">
                            <strong>Admin:</strong> admin / admin123
                        </div>
                        <div className="credential-item">
                    <strong>Test:</strong> test / test
                    </div>
                </div>
                <footer className="login-footer">
                    <img src="public/LogoSophia.svg" alt="Logo" className="footer-logo" />
                </footer>
            </div>
            
        </div>

    );
};

export default LoginForm;