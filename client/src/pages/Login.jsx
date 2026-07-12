import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { departmentAPI } from '../api/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentAPI.getAll();
        const depts = Array.isArray(res) ? res : res.departments || [];
        setDepartments(depts);
      } catch {
        // Silently fail — departments are only needed for registration
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await auth.login(formData.email, formData.password);
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        await auth.register(formData);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
        setFormData((prev) => ({ ...prev, password: '' }));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>
            <span className="logo-accent">Asset</span>Flow
          </h1>
          <p>Enterprise Asset Management</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                <User size={16} /> Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <Mail size={16} /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <Lock size={16} /> Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  <User size={16} /> Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Employee">Employee</option>
                  <option value="Asset Manager">Asset Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  <Building2 size={16} /> Department
                </label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {isLogin ? (
              <>
                <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
              </>
            ) : (
              <>
                <UserPlus size={18} /> {loading ? 'Registering...' : 'Register'}
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
