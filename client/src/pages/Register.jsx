import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import { Mail, Lock, User, Eye, EyeOff, Check, X, ArrowRight, Shield } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Password criteria analysis
  const passwordCriteria = useMemo(() => {
    const pwd = formData.password;
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  }, [formData.password]);

  // Overall password strength calculation
  const strengthScore = useMemo(() => {
    const values = Object.values(passwordCriteria);
    const passedCount = values.filter(Boolean).length;
    return passedCount; // 0 to 5
  }, [passwordCriteria]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 2) return 'var(--error)';
    if (strengthScore <= 4) return 'var(--warning)';
    return 'var(--accent-primary)';
  }, [strengthScore]);

  const strengthLabel = useMemo(() => {
    if (formData.password.length === 0) return '';
    if (strengthScore <= 2) return 'Weak';
    if (strengthScore <= 4) return 'Moderate';
    return 'Strong & Secure';
  }, [formData.password, strengthScore]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formError) setFormError('');
    if (authError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setFormError('Please enter a valid full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (strengthScore < 5) {
      setFormError('Please ensure your password meets all security criteria below.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(formData.name, formData.email, formData.password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Shield size={16} />
            Phase 1 Foundation
          </div>
          <h1>Create Account</h1>
          <p>Begin your AI-powered performance & fitness journey</p>
        </div>

        <Notification
          type="error"
          message={formError || authError}
          onClose={() => {
            setFormError('');
            clearError();
          }}
        />

        <form onSubmit={handleSubmit} noValidate id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">
              Full Name
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <User size={18} />
              </span>
              <input
                id="name-input"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${formError || authError ? 'has-error' : ''}`}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email-input">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="reg-email-input"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="athlete@domain.com"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${formError || authError ? 'has-error' : ''}`}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <label htmlFor="reg-password-input">Password</label>
              {strengthLabel && (
                <span style={{ color: strengthColor, fontSize: '0.8rem', fontWeight: 600 }}>
                  {strengthLabel}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="reg-password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create strong password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${formError || authError ? 'has-error' : ''}`}
                required
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="strength-meter-container">
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${(strengthScore / 5) * 100}%`,
                      backgroundColor: strengthColor,
                    }}
                  />
                </div>
                <div className="strength-criteria">
                  <div className={`criterion-item ${passwordCriteria.minLength ? 'valid' : ''}`}>
                    {passwordCriteria.minLength ? <Check size={13} /> : <X size={13} />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`criterion-item ${passwordCriteria.hasUppercase ? 'valid' : ''}`}>
                    {passwordCriteria.hasUppercase ? <Check size={13} /> : <X size={13} />}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`criterion-item ${passwordCriteria.hasLowercase ? 'valid' : ''}`}>
                    {passwordCriteria.hasLowercase ? <Check size={13} /> : <X size={13} />}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`criterion-item ${passwordCriteria.hasNumber ? 'valid' : ''}`}>
                    {passwordCriteria.hasNumber ? <Check size={13} /> : <X size={13} />}
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`criterion-item ${passwordCriteria.hasSpecial ? 'valid' : ''}`}>
                    {passwordCriteria.hasSpecial ? <Check size={13} /> : <X size={13} />}
                    <span>Special character (!@#)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="confirm-password-input"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${formError || authError ? 'has-error' : ''}`}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="register-submit-btn"
            disabled={isSubmitting}
            style={{ marginTop: '1.25rem' }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="goto-login-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
