import React, { useState, useEffect, useRef, Fragment } from 'react';
import './styles/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import jsonData from './data.json';
import { useReactToPrint } from 'react-to-print';
import Form from './components/Form';
import Resume from './components/Resume';

const App = () => {
    const [data, setData] = useState();
    const [preset] = useState([
        { primary: '#009688', background: '#ebf5f4', skills: '#e5f4f3' },
        { primary: '#2196f3', background: '#e8f4fe', skills: '#e2f2ff' },
        { primary: '#263238', background: '#f0f0f0', skills: '#e0e0e0' },
        { primary: '#3f51b5', background: '#ebedf7', skills: '#e1e3f8' },
    ]);

    const [color, setColor] = useState({
        primary: '#009688',
        background: '#e5f4f3',
        skills: '#e5f4f3',
    });

    useEffect(() => {
        setData(jsonData);
    }, []);

    const componentRef = useRef(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Resume',
        onBeforePrint: () => setIsPrinting(true),
        onAfterPrint: () => setIsPrinting(false),
        removeAfterPrint: true
    });

    return (
        <div className='mainContent'>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Navigate to="/resume-builder" />} />
                    <Route path='/resume-builder' element={
                        data ? (
                            <Fragment>
                                <div className='left'>
                                    <Form data={data} setData={setData} preset={preset} setColor={setColor} />
                                </div>
                                <div className='right'>
                                    <div ref={componentRef} className="print-content">
                                        <Resume data={data} color={color} />
                                    </div>
                                </div>
                                <button
                                    className='printBtn'
                                    onClick={handlePrint}
                                    disabled={isPrinting}
                                >
                                    {isPrinting ? 'Preparing...' : 'Download / Print'}
                                </button>
                            </Fragment>
                        ) : (
                            <div>Loading...</div>
                        )
                    } />
                </Routes>
            </Router>
        </div>
    );
};

export default App;