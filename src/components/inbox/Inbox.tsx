import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Inbox.css';
import shield from "../../images/shield.png";
import { backendUrl } from "../../utils/config";
import OpenedEmail from "../openedemail/OpenedEmail";

const Inbox: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [openedEmail, setOpenedEmail] = useState<OpenedEmailData | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleOpenEmail = async (emailAddress: string, date: Date) => {
        emailAddress = "5a7d7a1e-6@domain.com";
        try {
            const response = await fetch(
                `${backendUrl}/api/email?email=${emailAddress}&date=${date.getTime()}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch email: ${response.statusText}`);
            }

            const emailData: OpenedEmailData = await response.json();
            setOpenedEmail(emailData);
        } catch (error) {
            console.error("Failed to open email:", error);
        }
    };

    const handleCloseEmail = () => setOpenedEmail(null);

    useEffect(() => {
        const fetchEmail = async () => {
            const fetchedEmail = (await fetchEmailData())?.email;
            setEmail(fetchedEmail);
        };
        fetchEmail();
    }, []);

    return (
        <div className="container">
            <header className="header">
                <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
                <div className="logo">
                    <img src={shield} alt="Shield" />
                    <span>DumpMail</span>
                </div>
                <button className="refresh-btn">Refresh</button>
            </header>

            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <button className="close-sidebar" onClick={toggleSidebar}>×</button>
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
                    <div className="email-list">
                        <EmailList email={email} onOpen={handleOpenEmail} />
                    </div>
                )}
            </main>
        </div>
    );
};

const EmailList: React.FC<{ email: string | null; onOpen: (emailAddress: string, date: Date) => void }> = ({ email, onOpen }) => {
    const [emails, setEmails] = useState<EmailItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!email) return;

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
    textBody: string;
    htmlBody: string;
    attachments: EmailAttachment[];
}

interface EmailAttachment {
    filename: string;
    contentType: string;
    size: number;
    content: string;
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