let baseUrl;

if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:5000";
} else {
    baseUrl = "https://nodesockect.onrender.com/";
}

export default baseUrl;