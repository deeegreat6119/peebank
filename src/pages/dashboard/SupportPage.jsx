import { useState } from 'react';
// import './SupportPage.css';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqCategories = [
    {
      id: 'account',
      name: 'Account Management',
      questions: [
        {
          id: 'account-1',
          question: 'How do I open a new account?',
          answer: 'You can open a new account directly from your online banking dashboard. Click on "Open New Account" in the Accounts section, select the account type you want, and follow the instructions. You\'ll need to provide some personal information and may need to upload identification documents.'
        },
        {
          id: 'account-2',
          question: 'How do I close my account?',
          answer: 'To close your account, please visit a branch in person with valid identification. Alternatively, you can call our customer service line at 1-800-BANK-123 to initiate the process. Note that accounts with balances cannot be closed until the funds are transferred or withdrawn.'
        }
      ]
    },
    {
      id: 'transactions',
      name: 'Transactions',
      questions: [
        {
          id: 'transaction-1',
          question: 'Why is my transfer taking so long?',
          answer: 'Transfer times depend on several factors. Internal transfers between your accounts are usually instant. Transfers to other banks typically take 1-3 business days. International transfers may take up to 5 business days. If your transfer is delayed beyond these timeframes, please contact support.'
        },
        {
          id: 'transaction-2',
          question: 'How do I dispute a transaction?',
          answer: 'To dispute a transaction, navigate to the transaction in your account history and click "Dispute Transaction." You\'ll need to provide details about why you\'re disputing the charge. Our team will investigate and respond within 10 business days. For faster service, you can also call our dispute line at 1-800-DISPUTE.'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      questions: [
        {
          id: 'security-1',
          question: 'What should I do if I suspect fraud?',
          answer: 'If you suspect fraudulent activity on your account, immediately call our 24/7 fraud hotline at 1-800-FRAUD-ALERT. We\'ll help you secure your account and investigate any unauthorized transactions. Also change your online banking password and enable two-factor authentication if you haven\'t already.'
        },
        {
          id: 'security-2',
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and follow the instructions to reset your password. You\'ll need access to the email or phone number associated with your account. If you can\'t access these, please call customer support for identity verification and password reset assistance.'
        }
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 1500);
  };

  const toggleQuestion = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  const resetForm = () => {
    setSubmitSuccess(false);
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <h1>Help & Support</h1>
        <p>We're here to help. Choose how you'd like to get support.</p>
      </div>

      <div className="support-tabs">
        <button 
          className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <i className="fas fa-question-circle"></i> FAQs
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <i className="fas fa-envelope"></i> Contact Us
        </button>
        <button 
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <i className="fas fa-comments"></i> Live Chat
        </button>
        <button 
          className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <i className="fas fa-ticket-alt"></i> My Tickets
        </button>
      </div>

      <div className="support-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            <div className="faq-search">
              <input 
                type="text" 
                placeholder="Search FAQs..." 
              />
              <i className="fas fa-search"></i>
            </div>

            <div className="faq-categories">
              {faqCategories.map(category => (
                <div key={category.id} className="faq-category">
                  <h2>{category.name}</h2>
                  <div className="faq-questions">
                    {category.questions.map(q => (
                      <div 
                        key={q.id} 
                        className={`faq-question ${activeQuestion === q.id ? 'active' : ''}`}
                      >
                        <div 
                          className="question-header"
                          onClick={() => toggleQuestion(q.id)}
                        >
                          <h3>{q.question}</h3>
                          <i className={`fas ${activeQuestion === q.id ? 'fa-minus' : 'fa-plus'}`}></i>
                        </div>
                        {activeQuestion === q.id && (
                          <div className="question-answer">
                            <p>{q.answer}</p>
                            <div className="helpful-buttons">
                              <button className="btn-helpful">
                                <i className="fas fa-thumbs-up"></i> Helpful
                              </button>
                              <button className="btn-not-helpful">
                                <i className="fas fa-thumbs-down"></i> Not Helpful
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-footer">
              <p>Still need help? Try our other support options.</p>
              <div className="faq-footer-buttons">
                <button onClick={() => setActiveTab('contact')}>
                  <i className="fas fa-envelope"></i> Contact Support
                </button>
                <button onClick={() => setActiveTab('chat')}>
                  <i className="fas fa-comments"></i> Start Live Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            {submitSuccess ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h2>Message Sent Successfully!</h2>
                <p>We've received your message and will respond within 24 hours. For urgent matters, please call our customer service at 1-800-BANK-HELP.</p>
                <button onClick={resetForm}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="account">Account Issue</option>
                    <option value="transaction">Transaction Problem</option>
                    <option value="security">Security Concern</option>
                    <option value="technical">Technical Issue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="contact-info">
              <div className="info-card">
                <i className="fas fa-phone-alt"></i>
                <h3>Phone Support</h3>
                <p>Available 24/7</p>
                <a href="tel:18009255342">1-800-BANK-HELP</a>
              </div>

              <div className="info-card">
                <i className="fas fa-map-marker-alt"></i>
                <h3>Branch Locator</h3>
                <p>Find a branch near you</p>
                <button onClick={() => window.open('/branches', '_blank')}>
                  View Locations
                </button>
              </div>

              <div className="info-card">
                <i className="fas fa-comments"></i>
                <h3>Live Chat</h3>
                <p>Mon-Fri, 8am-8pm EST</p>
                <button onClick={() => setActiveTab('chat')}>
                  Start Chat Now
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-section">
            <div className="chat-container">
              <div className="chat-header">
                <h2>Live Chat Support</h2>
                <div className="chat-status">
                  <span className="status-indicator online"></span>
                  <span>Online</span>
                </div>
              </div>

              <div className="chat-messages">
                <div className="message agent">
                  <div className="message-content">
                    <div className="message-sender">Bank Support</div>
                    <div className="message-text">
                      Hello! Thank you for contacting Bank Support. How can we help you today?
                    </div>
                    <div className="message-time">2:45 PM</div>
                  </div>
                </div>

                <div className="message user">
                  <div className="message-content">
                    <div className="message-sender">You</div>
                    <div className="message-text">
                      Hi, I'm having trouble with a recent transfer.
                    </div>
                    <div className="message-time">2:46 PM</div>
                  </div>
                </div>
              </div>

              <div className="chat-input">
                <input 
                  type="text" 
                  placeholder="Type your message here..." 
                />
                <button>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>

            <div className="chat-sidebar">
              <h3>Quick Solutions</h3>
              <ul>
                <li onClick={() => setActiveQuestion('transaction-1')}>
                  Why is my transfer delayed?
                </li>
                <li onClick={() => setActiveQuestion('account-1')}>
                  How to open a new account
                </li>
                <li onClick={() => setActiveQuestion('security-2')}>
                  Reset my password
                </li>
                <li onClick={() => setActiveQuestion('transaction-2')}>
                  Dispute a transaction
                </li>
              </ul>

              <div className="chat-options">
                <button>
                  <i className="fas fa-paperclip"></i> Attach File
                </button>
                <button>
                  <i className="fas fa-user"></i> Send to Agent
                </button>
                <button>
                  <i className="fas fa-times"></i> End Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="tickets-section">
            <div className="tickets-header">
              <h2>My Support Tickets</h2>
              <button className="btn-new-ticket" onClick={() => setActiveTab('contact')}>
                <i className="fas fa-plus"></i> New Ticket
              </button>
            </div>

            <div className="tickets-list">
              <div className="ticket-item">
                <div className="ticket-status open">
                  <i className="fas fa-circle"></i> Open
                </div>
                <div className="ticket-content">
                  <h3>Transaction Dispute #45678</h3>
                  <p>Regarding unauthorized charge on 05/15/2023</p>
                  <div className="ticket-meta">
                    <span>Created: May 16, 2023</span>
                    <span>Last Updated: May 17, 2023</span>
                  </div>
                </div>
                <button className="ticket-view">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="ticket-item">
                <div className="ticket-status pending">
                  <i className="fas fa-circle"></i> Pending
                </div>
                <div className="ticket-content">
                  <h3>Account Access Issue #43210</h3>
                  <p>Unable to reset password</p>
                  <div className="ticket-meta">
                    <span>Created: May 10, 2023</span>
                    <span>Last Updated: May 12, 2023</span>
                  </div>
                </div>
                <button className="ticket-view">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="ticket-item">
                <div className="ticket-status resolved">
                  <i className="fas fa-circle"></i> Resolved
                </div>
                <div className="ticket-content">
                  <h3>Mobile App Problem #39876</h3>
                  <p>App crashing on login</p>
                  <div className="ticket-meta">
                    <span>Created: April 28, 2023</span>
                    <span>Resolved: May 2, 2023</span>
                  </div>
                </div>
                <button className="ticket-view">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="tickets-empty">
              <i className="fas fa-ticket-alt"></i>
              <p>No support tickets found</p>
              <button onClick={() => setActiveTab('contact')}>
                Create a new support ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
