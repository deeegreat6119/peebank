let baseUrl;

if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:5000";
} else {
    baseUrl = "https://peebank-backend.onrender.com";
}

export default baseUrl;