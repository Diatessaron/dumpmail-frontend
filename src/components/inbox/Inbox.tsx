import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Inbox.css';
import shield from "../../images/shield.png";
import { backendUrl } from "../../utils/config";
import OpenedEmail from "../openedemail/OpenedEmail";

const Inbox: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [openedEmail, setOpenedEmail] = useState<OpenedEmailData | null>(null);

    const handleOpenEmail = async (emailAddress: string, date: Date) => {
        try {
            const response = await fetch(`${backendUrl}/api/email?email=${emailAddress}&date=${new Date(date).getTime()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch email: ${response.statusText}`);
            }

            const emailData: OpenedEmailData = await response.json();
            setOpenedEmail(emailData);
        } catch (error) {
            console.error("Failed to open email:", error);
        }
    };

    const handleCloseEmail = () => {
        setOpenedEmail(null);
    };

    const handleCopyEmail = (email: string | null) => {
        if (!email) {
            console.error("No email to copy!");
            return;
        }

        navigator.clipboard.writeText(email)
    };

    useEffect(() => {
        const fetchAndSetEmail = async () => {
            const fetchedEmail = await fetchEmailData();
            setEmail(fetchedEmail);
        };
        fetchAndSetEmail();
    }, []);

    return (
        <div className="container">
            <aside className="sidebar">
                <Link to="/" className="logo">
                    <div className="logo-icon"> {<img src={shield} alt="Shield" />} </div>
                    <span className="logo-text">DumpMail</span>
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
                {openedEmail ? (
                    <OpenedEmail email={openedEmail} onClose={handleCloseEmail} />
                ) : (
                    <>
                        <div className="header">
                            <h2>Inbox</h2>
                            <EmailComponent email={email} />
                            <button className="copy-btn" onClick={() => handleCopyEmail(email)}>📄</button>
                        </div>
                        <div className="email-list">
                            <EmailList email={email} onOpen={handleOpenEmail}/>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

const EmailList: React.FC<{ email: string | null; onOpen: (emailAddress: string, date: Date) => void }> = ({ email, onOpen }) => {
    const [emails, setEmails] = useState<EmailItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmails = async () => {
        if (!email) return;

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

    useEffect(() => {
        if (!email) return;

        fetchEmails();

        const intervalId = setInterval(() => {
            fetchEmails();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [email]);

    if (loading) return <div>Loading emails...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="email-list">
            {emails.length > 0 ? (
                emails.map((email, index) => (
                    <EmailItem
                        key={index}
                        from={email.from}
                        to={email.to}
                        subject={email.subject}
                        date={email.date}
                        onOpen={() => onOpen(email.to, email.date)}
                    />
                ))
            ) : (
                <div>Don't be shy, receive an email</div>
            )}
        </div>
    );
};

interface EmailItemProps {
    from: string;
    to: string;
    subject: string;
    date: Date;
}

const EmailItem: React.FC<EmailItemProps & { onOpen: () => void }> = ({ from, subject, date, onOpen }) => {
    return (
        <div className="email-item" onClick={onOpen}>
            <div className="email-content">
                <strong>{from}</strong>
                <p>Subject: {subject}</p>
                <p>{new Date(date).toLocaleString()}</p>
            </div>
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

interface OpenedEmailData {
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments: EmailAttachment[];
}

interface EmailAttachment {
    filename: string;
    contentType: string;
    size: number;
    content: string;
}

async function fetchEmailData(): Promise<string | null> {
    try {
        const jwtToken = localStorage.getItem('jwtToken');
        const response = await fetch(`${backendUrl}/api/email`, {
            method: 'POST',
            credentials: "include",
            headers: jwtToken ? {
                'Content-Type': 'application/json',
                'Authorization': jwtToken
            } : {'Content-Type': 'application/json'},
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const [ email, authorization ] = [ (await response.json())?.email, response.headers.get('Authorization') ];
        if (!email || !authorization) throw new Error("email or Authorization token is null")

        localStorage.setItem('jwtToken', authorization);
        return email;
    } catch (error) {
        console.error("Failed to fetch email data:", error);
        return null;
    }
}

export default Inbox;
