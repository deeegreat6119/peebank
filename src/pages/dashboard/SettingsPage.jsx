import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import baseUrl from "../../Constants";
import { showToast } from "../../utils/toast";
// import './AccountSettingsPage.css';

const AccountSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notifications: {
      email: false,
      sms: false,
      push: false,
    },
    security: {
      twoFactorAuth: false,
      biometricLogin: false,
    },
    privacy: {
      dataSharing: "full",
      accountVisibility: "private",
    },
  });
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        // Fetch combined settings data from backend root endpoint
        const response = await fetch(`${baseUrl}/api/settings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();

        if (data.status !== 'success') {
          throw new Error('Failed to load settings data');
        }

        const combinedData = {
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          notifications: {
            email: data.data.notifications.email || false,
            sms: data.data.notifications.sms || false,
            push: data.data.notifications.push || false,
          },
          security: {
            twoFactorAuth: data.data.security.twoFactorAuth || false,
            biometricLogin: data.data.security.biometricLogin || false,
          },
          privacy: {
            dataSharing: "full",
            accountVisibility: "private",
          },
        };

        setFormData(combinedData);
        setInitialData(combinedData);
      } catch {
        showToast("Failed to load settings data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked,
        },
      }));
    } else if (type === "radio") {
      const [parent] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: value,
      }));
    } else if (e.target.tagName === "SELECT") {
      setFormData((prev) => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          accountVisibility: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update profile
      const profileResponse = await fetch(`${baseUrl}/api/settings/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || "Profile update failed");
      }

      // Update notifications
      const notificationsResponse = await fetch(`${baseUrl}/api/settings/notifications`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData.notifications),
      });
      if (!notificationsResponse.ok) throw new Error("Notifications update failed");

      // Update security
      const securityResponse = await fetch(`${baseUrl}/api/settings/security`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData.security),
      });
      if (!securityResponse.ok) throw new Error("Security update failed");

      // Update privacy
      const privacyResponse = await fetch(`${baseUrl}/api/settings/privacy`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData.privacy),
      });
      if (!privacyResponse.ok) throw new Error("Privacy update failed");

      showToast("Settings saved successfully!", "success");
      setInitialData(formData);
    } catch (error) {
      showToast(error.message || "Failed to save settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
      showToast("Changes canceled.", "info");
    }
  };

  return (
    <div className="account-settings-container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>
          Manage your personal information, security, and notification
          preferences
        </p>
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="fas fa-user-circle"></i> Profile Information
          </button>
          <button
            className={`nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <i className="fas fa-shield-alt"></i> Security Settings
          </button>
          <button
            className={`nav-item ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <i className="fas fa-bell"></i> Notifications
          </button>
          <button
            className={`nav-item ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <i className="fas fa-lock"></i> Privacy
          </button>
          <div className="nav-footer">
            <Link to="/dashboard" className="back-link">
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="settings-content">
          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {activeTab === "profile" && (
                <div className="tab-content">
                  <h2>
                    <i className="fas fa-user-edit"></i> Personal Information
                  </h2>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mailing Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="tab-content">
                  <h2>
                    <i className="fas fa-shield-alt"></i> Security Settings
                  </h2>
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="security.twoFactorAuth"
                        checked={formData.security.twoFactorAuth}
                        onChange={handleInputChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Biometric Login</h3>
                      <p>Use fingerprint or face recognition to log in</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="security.biometricLogin"
                        checked={formData.security.biometricLogin}
                        onChange={handleInputChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-group">
                    <Link to="/change-password" className="btn-change-password">
                      Change Password
                    </Link>
                  </div>
                  <div className="security-devices">
                    <h3>Trusted Devices</h3>
                    <div className="device-item">
                      <i className="fas fa-laptop"></i>
                      <div className="device-info">
                        <h4>MacBook Pro</h4>
                        <p>Last accessed: May 15, 2023 at 10:30 AM</p>
                      </div>
                      <button className="btn-remove">Remove</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="tab-content">
                  <h2>
                    <i className="fas fa-bell"></i> Notification Preferences
                  </h2>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Email Notifications</h3>
                      <p>Receive important updates via email</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="notifications.email"
                        checked={formData.notifications.email}
                        onChange={handleInputChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>SMS Alerts</h3>
                      <p>Get text messages for urgent notifications</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="notifications.sms"
                        checked={formData.notifications.sms}
                        onChange={handleInputChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Push Notifications</h3>
                      <p>Enable alerts on your mobile device</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="notifications.push"
                        checked={formData.notifications.push}
                        onChange={handleInputChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="tab-content">
                  <h2>
                    <i className="fas fa-lock"></i> Privacy Settings
                  </h2>
                  <div className="privacy-item">
                    <h3>Data Sharing Preferences</h3>
                    <p>
                      Control how we use your data for personalization and
                      analytics
                    </p>
                    <div className="privacy-options">
                      <label>
                        <input
                          type="radio"
                          name="privacy.dataSharing"
                          value="full"
                          checked={formData.privacy.dataSharing === "full"}
                          onChange={handleInputChange}
                        />
                        Allow all data sharing (recommended for best experience)
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="privacy.dataSharing"
                          value="limited"
                          checked={formData.privacy.dataSharing === "limited"}
                          onChange={handleInputChange}
                        />
                        Limit to essential data only
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="privacy.dataSharing"
                          value="none"
                          checked={formData.privacy.dataSharing === "none"}
                          onChange={handleInputChange}
                        />
                        Opt out of all data sharing
                      </label>
                    </div>
                  </div>
                  <div className="privacy-item">
                    <h3>Account Visibility</h3>
                    <p>Control who can see your profile information</p>
                    <select
                      className="visibility-select"
                      name="privacy.accountVisibility"
                      value={formData.privacy.accountVisibility}
                      onChange={handleInputChange}
                    >
                      <option value="private">Private (only me)</option>
                      <option value="contacts">My Contacts</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
