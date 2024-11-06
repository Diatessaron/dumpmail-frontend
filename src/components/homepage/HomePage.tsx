import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './HomePage.css';
import envelopeImage from '../../images/Envelop.png';
import personWithShield from '../../images/person_with_shield.png'
import shield from '../../images/shield.png';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hasSession = document.cookie.includes("session");
        if (hasSession) {
            navigate("/inbox");
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <header className="header">
                <div className="logo">
                    <div className="logo-icon"> {<img src={shield} alt="Shield"/>} </div>
                    <span className="logo-text">SafeMail</span>
                </div>
                <div className="privacy-text">Your Privacy, Our Priority</div>
            </header>

            <main className="main-content">
                <div className="envelope-icon">
                    <img src={envelopeImage} alt="Envelope" />
                </div>
                <div className="privacy-message">
                    <div className="icon-container">
                        <div className="icon"> {<img src={personWithShield} alt="PersonWithShield" />} </div>
                        <span className="icon-text">Privacy First</span>
                    </div>
                    <p>No sweet talks.<br/>Each email address is disposable.<br/>No data collected.</p>
                </div>
                <button className="create-email-btn"><Link to="/inbox">Create Disposable Email</Link></button>
            </main>

            <footer className="footer">
                <p>Contact us at: support@safemail.com</p>
                <p>About SafeMail: Your number one choice for disposable email addresses</p>
            </footer>
        </div>
    );
};

export default HomePage;
