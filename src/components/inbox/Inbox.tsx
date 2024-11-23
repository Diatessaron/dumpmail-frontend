import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Inbox.css';
import shield from "../../images/shield.png";
import { backendUrl } from "../../utils/config";

const Inbox: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndSetEmail = async () => {
            const fetchedEmail = (await fetchEmailData())?.email;
            setEmail(fetchedEmail);
        };
        fetchAndSetEmail();
    }, []);

    return (
        <div className="container">
            <aside className="sidebar">
                <Link to="/" className="logo">
                    <div className="logo-icon"> {<img src={shield} alt="Shield" />} </div>
                    <span className="logo-text">SafeMail</span>
                </Link>
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
                    <EmailComponent email={email} />
                    <button className="refresh-btn">Refresh</button>
                </div>
                <div className="email-list">
                    <EmailList email={email} />
                </div>
            </main>
        </div>
    );
};

const EmailList: React.FC<{ email: string | null }> = ({ email }) => {
    const [emails, setEmails] = useState<EmailItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!email) return; // Don't fetch if email is null

        const fetchEmails = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/email/all?email=${email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch emails');
                }
                const data: EmailItemProps[] = await response.json();
                setEmails(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, [email]);

    if (loading) return <div>Loading emails...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="email-list">
            {emails.length > 0 ? (
                emails.map((email, index) => (
                    <EmailItem key={index} from={email.from} subject={email.subject} />
                ))
            ) : (
                <div>Don't be shy, receive an email</div>
            )}
        </div>
    );
};

interface EmailItemProps {
    from: string;
    subject: string;
}

const EmailItem: React.FC<EmailItemProps> = ({ from, subject }) => {
    return (
        <div className="email-item">
            <div className="email-content">
                <strong>{from}</strong>
                <p>Subject: {subject}</p>
            </div>
            <div className="email-actions"></div>
        </div>
    );
};

function EmailComponent({ email }: { email: string | null }) {
    return (
        <div className="email-container">
            <p className="placeholder">{email ? email : "Email is not available"}</p>
        </div>
    );
}

async function fetchEmailData() {
    try {
        const response = await fetch(`${backendUrl}/api/email`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Failed to fetch email data:", error);
    }
}

export default Inbox;
