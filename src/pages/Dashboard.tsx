import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Dashboard = () => {
  const [selectedApi, setSelectedApi] = useState("issue-card");
  const [requestPayload, setRequestPayload] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Predefined payloads for different API endpoints
  const getDefaultPayload = (endpoint: string) => {
    switch (endpoint) {
      case "issue-card":
        return JSON.stringify(
          {
            amount: 100.0,
            currency: "USD",
            description: "Test payment",
            metadata: {
              order_id: "ORD-12345",
            },
          },
          null,
          2
        );
      case "charge-card":
        return JSON.stringify(
          {
            card_id: "card_123abc456def",
            amount: 100.0,
            currency: "USD",
            description: "Charge for order #12345",
          },
          null,
          2
        );
      case "auth-register":
        return JSON.stringify(
          {
            email: "user@ghostpay.com",
            password: "securepassword",
            name: "Test User",
          },
          null,
          2
        );
      case "auth-login":
        return JSON.stringify(
          {
            email: "admin@ghostpay.com",
            password: "ghostpay",
          },
          null,
          2
        );
      default:
        return "";
    }
  };

  // Get the API endpoint URL
  const getApiUrl = (endpoint: string) => {
    switch (endpoint) {
      case "issue-card":
        return "/api/cards";
      case "get-card":
        return "/api/cards/{id}";
      case "charge-card":
        return "/api/charges";
      case "auth-register":
        return "/api/auth/register/merchant";
      case "auth-login":
        return "/api/auth/login";
      default:
        return "";
    }
  };

  // Get the HTTP method for the API
  const getHttpMethod = (endpoint: string) => {
    switch (endpoint) {
      case "get-card":
        return "GET";
      default:
        return "POST";
    }
  };

  // Handle API endpoint change
  const handleEndpointChange = (endpoint: string) => {
    setSelectedApi(endpoint);
    setRequestPayload(getDefaultPayload(endpoint));
    setResponseData(null);
    setError("");
  };

  // Mock API request (in real app, this would call your actual API)
  const handleSendRequest = () => {
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Parse the request payload
        const payload = JSON.parse(requestPayload);

        // Mock successful responses based on the endpoint
        let response;

        switch (selectedApi) {
          case "issue-card":
            response = {
              id: "card_" + Math.random().toString(36).substring(2, 10),
              card_number:
                "4111 " +
                Math.floor(1000 + Math.random() * 9000) +
                " " +
                Math.floor(1000 + Math.random() * 9000) +
                " " +
                Math.floor(1000 + Math.random() * 9000),
              expiry_month: String(Math.floor(1 + Math.random() * 12)).padStart(
                2,
                "0"
              ),
              expiry_year: String(24 + Math.floor(Math.random() * 5)),
              cvv: String(Math.floor(100 + Math.random() * 900)),
              amount: payload.amount,
              currency: payload.currency,
              status: "active",
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 86400000).toISOString(),
              metadata: payload.metadata,
            };
            break;

          case "auth-register":
            response = {
              message: "User registered successfully",
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              user: {
                id: Math.random().toString(36).substring(2, 15),
                email: payload.email,
                name: payload.name,
                role: "merchant",
              },
            };
            break;

          case "auth-login":
            response = {
              message: "Login successful",
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              user: {
                id: Math.random().toString(36).substring(2, 15),
                email: payload.email,
                name: "Test User",
                role: payload.email.includes("admin") ? "admin" : "merchant",
              },
            };
            break;

          default:
            response = { success: true, data: payload };
        }

        setResponseData(response);
      } catch (err) {
        setError("Invalid JSON payload");
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="bg-gradient-to-b from-primary/40 to-background pt-[130px] pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">API Explorer</h1>
          <p className="text-lg text-white/90 mb-8">
            Test the GhostPay-Lite API directly from your browser. Select an
            endpoint, customize the request payload, and see the response.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => handleEndpointChange("issue-card")}
                className={`px-3 py-2 rounded-md ${
                  selectedApi === "issue-card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Issue Card
              </button>
              <button
                onClick={() => handleEndpointChange("charge-card")}
                className={`px-3 py-2 rounded-md ${
                  selectedApi === "charge-card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Charge Card
              </button>
              <button
                onClick={() => handleEndpointChange("auth-register")}
                className={`px-3 py-2 rounded-md ${
                  selectedApi === "auth-register"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Register User
              </button>
              <button
                onClick={() => handleEndpointChange("auth-login")}
                className={`px-3 py-2 rounded-md ${
                  selectedApi === "auth-login"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Login
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Request</h3>
                  <div className="flex space-x-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        getHttpMethod(selectedApi) === "POST"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {getHttpMethod(selectedApi)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-mono text-xs">
                      {getApiUrl(selectedApi)}
                    </span>
                  </div>
                </div>
                <textarea
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  className="w-full h-80 p-4 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Enter JSON payload..."
                />
                <button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="mt-3 btn btn-primary flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Response</h3>
                <div className="h-80 overflow-auto bg-gray-900 rounded-md">
                  {error ? (
                    <div className="p-4 text-red-400 font-mono text-sm">
                      Error: {error}
                    </div>
                  ) : responseData ? (
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.375rem",
                        height: "100%",
                      }}
                    >
                      {JSON.stringify(responseData, null, 2)}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Response will appear here after sending a request
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Need More Details?</h3>
            <p className="mb-4">
              Check out our comprehensive API documentation to learn about all
              available endpoints, request parameters, response formats, and
              error handling.
            </p>
            <div className="flex">
              <a href="/api-docs" className="btn btn-primary">
                View API Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
