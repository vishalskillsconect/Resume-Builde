import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-2 sticky-top">
      <Link className="navbar-brand text-info" to="/">Skills Connect</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0 ">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/#Templates">Templates</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/#Features">Features</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/#Services">Services</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/#Blog">Blog</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/#ContactUs">Contact Us</Link>
          </li>
        </ul>

        <ul className='navbar-nav align-items-center'>
          <li className='nav-item'>
            <Link to='/resume-builder' className='nav-link'>
              <button className='btn btn-primary'>
                Create Resume
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;