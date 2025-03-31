import React from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simply redirect to Skills Connect without auth
        navigate('/resume-builder');
    };

    return (
        <div className="sign-up">
            <div className="container">
                <div className="text-center py-4">
                    <Link to="/" className="text-info nav-link">
                        <h2>Skills Connect</h2>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="py-3">
                    <h1 className='lead text-center py-3'>Welcome!</h1>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" type="submit">
                            Continue to Skills Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;