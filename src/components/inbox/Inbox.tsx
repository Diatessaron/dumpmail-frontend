import React from 'react';
import { Link } from 'react-router-dom';
import './Inbox.css';
import shield from "../../images/shield.png";
import eye from "../../images/eye.png";
import trashCan from "../../images/trash_can.png";

interface EmailItemProps {
    name: string;
    subject: string;
}

const EmailItem: React.FC<EmailItemProps> = ({ name, subject }) => {
    return (
        <div className="email-item">
            <div className="email-content">
                <strong>{name}</strong>
                <p>Subject: {subject}</p>
            </div>
            <div className="email-actions">
                <button className="view-btn"> <img src={eye} alt="View" className="btn-icon" /> </button>
                <button className="delete-btn"> <img src={trashCan} alt="Delete" className="btn-icon" />️ </button>
            </div>
        </div>
    );
};

const Inbox: React.FC = () => {
    return (
        <div className="container">
            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-icon"> {<img src={shield} alt="Shield"/>} </div>
                    <span className="logo-text">SafeMail</span>
                </div>
                <Link to="/" className="nav-link">Back to Home</Link>
                <div className="folders">
                    <h3>Folders</h3>
                    <ul>
                        <li>Inbox</li>
                        <li>Trash</li>
                    </ul>
                </div>
                <div className="filters">
                    <h3>Filters</h3>
                    <ul>
                        <li>Unread</li>
                        <li>Read</li>
                    </ul>
                </div>
            </aside>

            <main className="main">
                <div className="header">
                    <h2>Inbox</h2>
                    <button className="refresh-btn">Refresh</button>
                </div>
                <div className="email-list">
                    <EmailItem name="Alice Johnson" subject="Meeting Schedule"/>
                    <EmailItem name="Bob Smith" subject="Project Update"/>
                    <EmailItem name="Catherine Lee" subject="Invoice for Services"/>
                </div>
            </main>
        </div>
    );
};

export default Inbox;
