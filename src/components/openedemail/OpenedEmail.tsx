import React from 'react';
import './OpenedEmail.css';

interface OpenedEmailProps {
    email: OpenedEmailData | null;
    onClose: () => void;
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

const OpenedEmail: React.FC<OpenedEmailProps> = ({ email, onClose }) => {
    if (!email) {
        return <div className="opened-email">No email selected</div>;
    }

    return (
        <div className="opened-email">
            <div className="email-header">
                <button className="close-btn" onClick={onClose}>Close</button>
                <h2>{email.subject}</h2>
            </div>
            <div className="email-details">
                <p><strong>From:</strong> {email.from}</p>
                <p><strong>To:</strong> {email.to}</p>
            </div>
            <div className="email-body">
                {(email.text && isHtml(email.text)) ? (
                    <>
                        <div
                            className="html-body"
                            dangerouslySetInnerHTML={{ __html: email.text }}
                        ></div>
                    </>
                ) : (<p>{email.text || "No text body available"}</p>)}
            </div>
            {email.attachments.length > 0 && (
                <div className="email-attachments">
                    <ul>
                        {email.attachments.map((attachment, index) => (
                            <li key={index}>
                                <img
                                    src={`data:${attachment.contentType};base64,${attachment.content}`}
                                    alt="Decoded" style={{ maxWidth: "100%" }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

function isHtml(content: string): boolean {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i; // Basic regex to check for HTML tags
    return htmlRegex.test(content);
}

export default OpenedEmail;
