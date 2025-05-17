import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

// Virtual Card Component
const VirtualCard = ({
  cardData,
  isVerified = false,
  transactionStatus = null,
}: {
  cardData: any;
  isVerified?: boolean;
  transactionStatus?: string | null;
}) => {
  // Mask card number to show only last 4 digits
  const maskCardNumber = (number: string) => {
    if (!number) return "••••  ••••  ••••  ••••";
    return `••••  ••••  ••••  ${number.slice(-4)}`;
  };

  // Format expiry date
  const formatExpiry = (date: string) => {
    if (!date) return "••/••";
    // If date is in YYYY-MM format, convert to MM/YY
    if (date.includes("-")) {
      const [year, month] = date.split("-");
      return `${month}/${year.slice(-2)}`;
    }
    return date;
  };

  // Background gradient based on verification status
  const getCardBackground = () => {
    if (isVerified && transactionStatus === "success") {
      return "bg-gradient-to-r from-green-500 to-emerald-700"; // Success green
    } else if (isVerified) {
      return "bg-gradient-to-r from-blue-500 to-indigo-700"; // Verified blue
    } else {
      return "bg-gradient-to-r from-purple-500 to-indigo-600"; // Default purple
    }
  };

  return (
    <div
      className={`relative ${getCardBackground()} rounded-xl p-6 shadow-lg w-full max-w-md mx-auto text-white mb-4`}
    >
      {/* Card Chip */}
      <div className="absolute top-6 left-6 w-12 h-8 bg-yellow-400/70 rounded-md border border-yellow-300 flex items-center justify-center">
        <div className="w-8 h-4 bg-yellow-500/50 rounded-sm"></div>
      </div>

      {/* Ghost Pay Logo */}
      <div className="text-right mb-6">
        <h3 className="text-xl font-bold tracking-tight">
          Ghost<span className="font-light">Pay</span>
        </h3>
      </div>

      {/* Card Number */}
      <div className="mt-8 mb-6">
        <h4 className="text-xs uppercase text-white/70 mb-1">Card Number</h4>
        <p className="font-mono text-xl tracking-wider">
          {maskCardNumber(cardData?.cardNumber)}
        </p>
      </div>

      {/* Card Details */}
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-xs uppercase text-white/70 mb-1">Card Holder</h4>
          <p className="font-medium">
            {cardData?.cardHolderName || "••••••••••"}
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase text-white/70 mb-1">Expires</h4>
          <p className="font-medium">{formatExpiry(cardData?.expiryDate)}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase text-white/70 mb-1">CVV</h4>
          <p className="font-medium">•••</p>
        </div>
      </div>

      {/* Verification Badge */}
      {isVerified && (
        <div className="absolute top-4 right-4 bg-white/90 text-green-700 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Transaction Status */}
      {transactionStatus && (
        <div className="absolute bottom-4 right-4 bg-white/90 text-sm font-medium px-2 py-1 rounded-md">
          {transactionStatus === "success" ? (
            <span className="text-green-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          ) : (
            <span className="text-red-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Failed
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Define a type for response data
type ApiResponse = Record<string, any> | null;

// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Store role-specific auth tokens
interface AuthTokens {
  user: string;
  merchant: string;
  admin: string;
  currentRole: string;
}

// Try to load tokens from localStorage
const getSavedTokens = (): AuthTokens => {
  try {
    const savedTokens = localStorage.getItem("ghostpay_tokens");
    if (savedTokens) {
      return JSON.parse(savedTokens);
    }
  } catch (err) {
    console.error("Error loading saved tokens:", err);
  }

  // Default empty tokens
  return {
    user: "",
    merchant: "",
    admin: "",
    currentRole: "",
  };
};

// Initialize tokens from localStorage or empty defaults
const tokens: AuthTokens = getSavedTokens();

// Function to save tokens to localStorage
const saveTokens = () => {
  try {
    localStorage.setItem("ghostpay_tokens", JSON.stringify(tokens));
    console.log("Tokens saved to localStorage");
  } catch (err) {
    console.error("Error saving tokens:", err);
  }
};

// Store card data for reuse
interface CardData {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardHolderName: string;
}

let savedCardData: CardData | null = null;

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle authorization
api.interceptors.request.use(
  (config) => {
    // For admin endpoints, directly set the admin token if available
    if (config.url?.includes("/cards/analytics") && tokens.admin) {
      console.log("Admin interceptor: Adding admin token to request");
      config.headers["Authorization"] = `Bearer ${tokens.admin}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Dashboard = () => {
  const [selectedApi, setSelectedApi] = useState("register-user");
  const [requestPayload, setRequestPayload] = useState("");
  const [responseData, setResponseData] = useState<ApiResponse>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"user" | "merchant" | "admin">("user");
  const [cardId, setCardId] = useState("");
  const [activeTokens, setActiveTokens] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [cardVerified, setCardVerified] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [analyticsRole, setAnalyticsRole] = useState<
    "user" | "merchant" | "admin"
  >("user");
  const [transactionId, setTransactionId] = useState("");

  // Initialize payload based on selected endpoint
  useEffect(() => {
    setRequestPayload(getDefaultPayload(selectedApi));
  }, [selectedApi, role]);

  // Predefined payloads for different API endpoints
  const getDefaultPayload = (endpoint: string) => {
    switch (endpoint) {
      case "register-user":
        return JSON.stringify(
          {
            email: `user${Math.floor(Math.random() * 1000)}@ghostpay.com`,
            password: "ghostpay",
            name: "Test User",
          },
          null,
          2
        );
      case "login":
        return JSON.stringify(
          {
            email: "admin@ghostpay.com", // Default to admin login
            password: "ghostpay",
          },
          null,
          2
        );
      case "issue-card":
        return JSON.stringify(
          {
            cardHolderName: "Example User",
            maxLimit: 10000,
          },
          null,
          2
        );
      case "get-card":
        return ""; // GET request doesn't need a body
      case "charge-card":
        // Use saved card data if available, otherwise use example data
        if (savedCardData) {
          return JSON.stringify(
            {
              cardNumber: savedCardData.cardNumber,
              cvv: savedCardData.cvv,
              expiryDate: savedCardData.expiryDate,
              amount: 1000,
              description: "Purchase at Store XYZ",
            },
            null,
            2
          );
        } else {
          return JSON.stringify(
            {
              cardNumber: "Please issue a card first",
              cvv: "???",
              expiryDate: "MM/YYYY",
              amount: 1000,
              description: "Purchase at Store XYZ",
            },
            null,
            2
          );
        }
      case "card-analytics":
        return ""; // GET request doesn't need a body
      case "transaction-details":
        return ""; // GET request doesn't need a body
      default:
        return "";
    }
  };

  // Get the appropriate token based on endpoint
  const getTokenForEndpoint = (endpoint: string): string => {
    // Card operations require user token
    if (["issue-card", "get-card"].includes(endpoint)) {
      return tokens.user;
    }
    // Charge operations and transaction details require merchant token
    else if (["charge-card", "transaction-details"].includes(endpoint)) {
      return tokens.merchant;
    }
    // Admin operations require admin token
    else if (["card-analytics"].includes(endpoint)) {
      // Log token details for debugging
      console.log("Admin token requested for endpoint:", endpoint);
      console.log(
        "Current admin token:",
        tokens.admin ? tokens.admin.substring(0, 15) + "..." : "No admin token"
      );
      return tokens.admin;
    }
    return "";
  };

  // Get the API endpoint URL
  const getApiUrl = (endpoint: string) => {
    switch (endpoint) {
      case "register-user":
        return `/auth/register/${role}`;
      case "login":
        return `/auth/login`;
      case "issue-card":
        return `/cards`;
      case "get-card":
        return `/cards/${cardId}`;
      case "charge-card":
        return `/charges`;
      case "transaction-details":
        return `/transactions/${transactionId}`;
      case "card-analytics":
        // Return different analytics endpoints based on the selected analytics role
        if (analyticsRole === "merchant") {
          return `/transactions/analytics/merchant`;
        } else if (analyticsRole === "admin") {
          return `/transactions/analytics/admin`;
        } else {
          return `/cards/analytics/overview`;
        }
      default:
        return "";
    }
  };

  // Function to explicitly create analytics URL
  const getAnalyticsUrl = () => {
    // Return different analytics endpoints based on the selected analytics role
    if (analyticsRole === "merchant") {
      return `${BACKEND_URL}/transactions/analytics/merchant`;
    } else if (analyticsRole === "admin") {
      return `${BACKEND_URL}/transactions/analytics/admin`;
    } else {
      return `${BACKEND_URL}/cards/analytics/overview`;
    }
  };

  // Get the HTTP method for the API
  const getHttpMethod = (endpoint: string) => {
    switch (endpoint) {
      case "get-card":
      case "card-analytics":
      case "transaction-details":
        return "GET";
      default:
        return "POST";
    }
  };

  // Update active tokens list for UI display
  const updateActiveTokens = () => {
    const active = [];
    if (tokens.user) active.push("user");
    if (tokens.merchant) active.push("merchant");
    if (tokens.admin) active.push("admin");
    setActiveTokens(active);

    // Save tokens to localStorage when they change
    saveTokens();
  };

  // Handle API endpoint change
  const handleEndpointChange = (endpoint: string) => {
    setSelectedApi(endpoint);
    setResponseData(null);
    setError("");
    setDebugInfo("");

    // If changing to login, default to the appropriate role payload
    if (endpoint === "login") {
      const loginPayload = JSON.stringify(
        {
          email:
            role === "admin"
              ? "admin@ghostpay.com"
              : role === "merchant"
              ? "merchant@ghostpay.com"
              : "user@ghostpay.com",
          password: "ghostpay",
        },
        null,
        2
      );
      setRequestPayload(loginPayload);
    } else {
      setRequestPayload(getDefaultPayload(endpoint));
    }
  };

  // Handle role change for registration
  const handleRoleChange = (newRole: "user" | "merchant" | "admin") => {
    setRole(newRole);

    // If currently on login page, update the email to match the role
    if (selectedApi === "login") {
      const loginPayload = JSON.stringify(
        {
          email:
            newRole === "admin"
              ? "admin@ghostpay.com"
              : newRole === "merchant"
              ? "merchant@ghostpay.com"
              : "user@ghostpay.com",
          password: "ghostpay",
        },
        null,
        2
      );
      setRequestPayload(loginPayload);
    }
  };

  // Add a function to handle analytics role change
  const handleAnalyticsRoleChange = (
    newRole: "user" | "merchant" | "admin"
  ) => {
    setAnalyticsRole(newRole);

    // Update any relevant state for the analytics view
    console.log(`Analytics role changed to: ${newRole}`);

    // Clear previous response data when switching roles
    setResponseData(null);
    setError("");
    setDebugInfo("");
  };

  // Add a function to check if token is available for selected analytics role
  const isAnalyticsTokenAvailable = (): boolean => {
    return !!tokens[analyticsRole]; // Return true if token exists for selected role
  };

  // Real API request handler using axios
  const handleSendRequest = async () => {
    setIsLoading(true);
    setError("");
    setDebugInfo("");

    try {
      // Parse the request payload for POST requests
      let payload = {};
      if (getHttpMethod(selectedApi) === "POST" && requestPayload) {
        payload = JSON.parse(requestPayload);
      }

      // Set auth token based on the endpoint
      const headers: Record<string, string> = {};
      const token =
        selectedApi === "card-analytics"
          ? tokens[analyticsRole] // Use token matching the selected analytics role
          : getTokenForEndpoint(selectedApi);

      if (
        [
          "issue-card",
          "get-card",
          "charge-card",
          "card-analytics",
          "transaction-details",
        ].includes(selectedApi)
      ) {
        // For analytics, use the token for selected role
        if (selectedApi === "card-analytics") {
          if (!tokens[analyticsRole]) {
            setError(
              `No ${analyticsRole} token available. Please login as a ${analyticsRole} first.`
            );
            setIsLoading(false);
            return;
          }
          // Add token for selected analytics role
          headers["Authorization"] = `Bearer ${tokens[analyticsRole]}`;
          setDebugInfo(
            `Using ${analyticsRole} token for authorization: ${tokens[
              analyticsRole
            ].substring(0, 15)}...`
          );
        } else {
          // For non-analytics endpoints, use standard token
          if (!token) {
            // Handle missing token for other endpoints
            const tokenType =
              selectedApi === "charge-card" ||
              selectedApi === "transaction-details"
                ? "merchant"
                : "user";

            setError(
              `No ${tokenType} token available. Please login as a ${tokenType} first.`
            );
            setIsLoading(false);
            return;
          }

          // Add token to headers
          headers["Authorization"] = `Bearer ${token}`;

          // Add detailed debug info for token usage
          const tokenType = selectedApi === "charge-card" || selectedApi === "transaction-details" 
            ? "merchant" 
            : "user";

          setDebugInfo(
            `Using ${tokenType} token for authorization: ${token.substring(
              0,
              15
            )}...`
          );
        }
      }

      // Make the API call with axios
      let response;
      const url = getApiUrl(selectedApi);

      // For card-analytics, add specific debug info and use a direct call approach
      if (selectedApi === "card-analytics") {
        console.log("Admin Auth Details:");
        console.log("- Endpoint:", url);
        console.log("- Admin token being used:", token);
        console.log(
          "- Request headers:",
          JSON.stringify({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          })
        );
        console.log("- All stored tokens:", {
          admin: tokens.admin ? tokens.admin.substring(0, 15) + "..." : "None",
          user: tokens.user ? tokens.user.substring(0, 15) + "..." : "None",
          merchant: tokens.merchant
            ? tokens.merchant.substring(0, 15) + "..."
            : "None",
          currentRole: tokens.currentRole,
        });

        // For admin analytics, use a direct approach with explicit token
        try {
          const analyticsUrl = getAnalyticsUrl();
          console.log("Making direct analytics call to:", analyticsUrl);

          // Use token matching the selected analytics role
          let analyticsToken = tokens[analyticsRole];
          if (!analyticsToken) {
            try {
              const savedTokens = localStorage.getItem("ghostpay_tokens");
              if (savedTokens) {
                const parsed = JSON.parse(savedTokens);
                analyticsToken = parsed[analyticsRole] || "";
                if (analyticsToken) {
                  console.log(
                    `Recovered ${analyticsRole} token from localStorage`
                  );
                  tokens[analyticsRole] = analyticsToken; // Update the in-memory token
                  updateActiveTokens();
                }
              }
            } catch (err) {
              console.error("Error accessing localStorage:", err);
            }
          }

          console.log(
            `With ${analyticsRole} token:`,
            analyticsToken ? analyticsToken.substring(0, 15) + "..." : "None"
          );

          // Use a dedicated auth header for analytics
          const analyticsHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${analyticsToken}`,
          };

          // Make direct axios call without using instance interceptors
          response = await axios.get(analyticsUrl, {
            headers: analyticsHeaders,
          });

          console.log("Direct analytics call succeeded!");
        } catch (adminError) {
          console.error("Direct analytics call failed:", adminError);
          // Fall back to regular request flow
          if (getHttpMethod(selectedApi) === "GET") {
            response = await api.get(url, { headers });
          } else {
            response = await api.post(url, payload, { headers });
          }
        }
      } else {
        // Regular flow for non-admin endpoints
        if (getHttpMethod(selectedApi) === "GET") {
          response = await api.get(url, { headers });
        } else {
          response = await api.post(url, payload, { headers });
        }
      }

      // Handle successful response
      const data = response.data;

      // Store auth token if it's a login/register response
      if (data.token && ["login", "register-user"].includes(selectedApi)) {
        // Check if we're logging in with admin credentials
        if (selectedApi === "login") {
          const loginPayload = JSON.parse(requestPayload);

          // Clear all existing tokens first
          tokens.user = "";
          tokens.merchant = "";
          tokens.admin = "";

          // Set role based on the email used for login, regardless of the selected role
          if (loginPayload.email === "admin@ghostpay.com") {
            tokens.admin = data.token;
            tokens.currentRole = "admin";
            console.log(
              "ADMIN LOGIN DETECTED - Setting admin token:",
              data.token.substring(0, 15) + "..."
            );
          } else if (loginPayload.email === "merchant@ghostpay.com") {
            tokens.merchant = data.token;
            tokens.currentRole = "merchant";
            console.log(
              "MERCHANT LOGIN DETECTED - Setting merchant token:",
              data.token.substring(0, 15) + "..."
            );
          } else {
            tokens.user = data.token;
            tokens.currentRole = "user";
            console.log(
              "USER LOGIN DETECTED - Setting user token:",
              data.token.substring(0, 15) + "..."
            );
          }
        } else {
          // For registration, clear existing tokens and use only the selected role
          tokens.user = "";
          tokens.merchant = "";
          tokens.admin = "";
          tokens[role] = data.token;
          tokens.currentRole = role;
          console.log(
            `${role.toUpperCase()} REGISTRATION - Setting ${role} token:`,
            data.token.substring(0, 15) + "..."
          );
        }

        updateActiveTokens();

        // Additional logging for admin token
        if (tokens.currentRole === "admin") {
          console.log("Admin token details:");
          console.log("- Full token:", data.token);
          console.log("- Token length:", data.token.length);
          console.log("- Token now stored in tokens.admin");
        }
      }

      // If this was a card creation response, store the card data and mark as new
      if (selectedApi === "issue-card" && data.card) {
        if (data.card.id) {
          setCardId(data.card.id);
        }

        // Save card data for reuse in charge-card requests
        if (data.card.cardNumber && data.card.cvv && data.card.expiryDate) {
          savedCardData = {
            cardNumber: data.card.cardNumber,
            cvv: data.card.cvv,
            expiryDate: data.card.expiryDate,
            cardHolderName: data.card.cardHolderName || "Example User",
          };

          // Reset verification status for new card
          setCardVerified(false);
          setTransactionStatus(null);
          console.log("Card data saved for future charge operations");
        }
      }

      // If this was a get-card response, mark the card as verified
      if (selectedApi === "get-card" && data.card) {
        setCardVerified(true);
        setTransactionStatus(null);
      }

      // If this was a charge-card response, mark the transaction status
      if (selectedApi === "charge-card" && data.status) {
        setCardVerified(true);
        setTransactionStatus(
          data.status === "succeeded" ? "success" : "failed"
        );
      }

      // If this was a charge-card response and successful, capture the transaction ID
      if (selectedApi === "charge-card" && data.transaction?.id) {
        // Save transaction ID
        setTransactionId(data.transaction.id);
        setCardVerified(true);
        setTransactionStatus("success");

        // Display guidance for transaction details
        setDebugInfo(
          `Transaction successful with ID: ${data.transaction.id}. Click "View Transaction Details" to see full information.`
        );
      }

      setResponseData(data);
    } catch (err) {
      // Handle axios errors
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        const statusCode = err.response?.status || "unknown";
        setError(`${errorMessage} (Status: ${statusCode})`);

        // Add specific guidance based on the error and endpoint
        if (
          selectedApi === "charge-card" &&
          errorMessage.includes("not found")
        ) {
          setDebugInfo(
            "Try issuing a card first as a user, then use the merchant token for charging."
          );
        } else if (selectedApi === "card-analytics") {
          if (
            errorMessage.includes("denied") ||
            errorMessage.includes("unauthorized") ||
            statusCode === 401 ||
            statusCode === 403
          ) {
            setDebugInfo(
              "Admin authentication failed. Try these steps:\n\n" +
                "1. Make sure you're using 'admin@ghostpay.com' and 'ghostpay' to login (POST /auth/login)\n" +
                "2. Check that the admin token is properly stored after login\n" +
                "3. Make sure you're selecting 'Admin' role before logging in\n" +
                "4. Clear your browser cache and try again\n" +
                "5. Try registering a new admin account first (POST /auth/register/admin)"
            );

            // Log detailed debug info for admin access
            console.error("Admin access debugging information:");
            console.error("- Status code:", statusCode);
            console.error("- Error message:", errorMessage);
            console.error(
              "- Admin token used:",
              tokens.admin
                ? `${tokens.admin.substring(0, 15)}... (length: ${
                    tokens.admin.length
                  })`
                : "No token"
            );
            console.error("- Current role:", tokens.currentRole);
            console.error("- Full response error:", err.response?.data);
            console.error(
              "- Authorization header used:",
              tokens.admin
                ? `Bearer ${tokens.admin.substring(0, 15)}...`
                : "None"
            );
          }
        }
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get requirements text for current endpoint
  const getEndpointRequirements = () => {
    switch (selectedApi) {
      case "issue-card":
      case "get-card":
        return "Requires user authentication";
      case "charge-card":
      case "transaction-details":
        return "Requires merchant authentication";
      case "card-analytics":
        return "Requires admin authentication";
      default:
        return "";
    }
  };

  // Check if token is available for the current endpoint
  const isTokenAvailableForEndpoint = (): boolean => {
    if (
      !["issue-card", "get-card", "charge-card", "card-analytics"].includes(
        selectedApi
      )
    ) {
      return true; // No token needed
    }

    const token = getTokenForEndpoint(selectedApi);
    return !!token; // Return true if token exists
  };

  // Add Analytics Dashboard components
  const UserAnalyticsDashboard = ({ data }: { data: any }) => {
    if (!data || !data.overview) return null;

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-xl font-semibold mb-4 text-primary-dark">
          User Card Analytics
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Cards</p>
            <p className="text-2xl font-bold text-blue-800">
              {data.overview.totalCards}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Active Cards</p>
            <p className="text-2xl font-bold text-green-800">
              {data.overview.activeCards}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Used Cards</p>
            <p className="text-2xl font-bold text-purple-800">
              {data.overview.usedCards}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-600">Total Spent</p>
            <p className="text-2xl font-bold text-amber-800">
              ${data.overview.totalSpent}
            </p>
          </div>
        </div>

        {data.spending &&
          data.spending.byMerchant &&
          data.spending.byMerchant.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium mb-2 text-gray-700">Top Merchants</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2">Merchant</th>
                      <th className="pb-2">Transactions</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.spending.byMerchant.map(
                      (merchant: any, idx: number) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="py-2">{merchant.merchantName}</td>
                          <td className="py-2">{merchant.count}</td>
                          <td className="py-2">${merchant.total}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {data.cards && data.cards.length > 0 && (
          <div>
            <h5 className="font-medium mb-2 text-gray-700">Your Cards</h5>
            <div className="space-y-4">
              {data.cards.map((card: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-mono text-sm">
                        ••••{card.cardNumber.slice(-4)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {card.cardHolderName}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        card.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {card.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Current Balance</p>
                      <p className="font-medium">${card.currentBalance}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max Limit</p>
                      <p className="font-medium">${card.maxLimit}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Transactions</p>
                      <p className="font-medium">{card.totalTransactions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MerchantAnalyticsDashboard = ({ data }: { data: any }) => {
    if (!data || !data.overview) return null;

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-xl font-semibold mb-4 text-primary-dark">
          Merchant Analytics
        </h4>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Merchant</p>
          <p className="font-medium">
            {data.merchant?.name || "Your Merchant Account"}
          </p>
          <p className="text-sm text-gray-500">{data.merchant?.email}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Transactions</p>
            <p className="text-2xl font-bold text-blue-800">
              {data.overview.totalTransactions}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Total Amount</p>
            <p className="text-2xl font-bold text-green-800">
              ${data.overview.totalAmount}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Success Rate</p>
            <p className="text-2xl font-bold text-purple-800">
              {data.overview.successRate}%
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-600">Customers</p>
            <p className="text-2xl font-bold text-amber-800">
              {data.overview.totalCustomers}
            </p>
          </div>
        </div>

        {data.statusBreakdown && (
          <div className="mb-6">
            <h5 className="font-medium mb-2 text-gray-700">
              Transaction Status
            </h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-xl font-bold text-green-800">
                  {data.statusBreakdown.completed}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-sm text-red-600">Failed</p>
                <p className="text-xl font-bold text-red-800">
                  {data.statusBreakdown.failed}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-xl font-bold text-yellow-800">
                  {data.statusBreakdown.pending}
                </p>
              </div>
            </div>
          </div>
        )}

        {data.recentTransactions && data.recentTransactions.length > 0 && (
          <div>
            <h5 className="font-medium mb-2 text-gray-700">
              Recent Transactions
            </h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((tx: any, idx: number) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="py-2 text-sm font-mono">
                        {tx.id.slice(-8)}
                      </td>
                      <td className="py-2">{tx.customerName}</td>
                      <td className="py-2">${tx.amount}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AdminAnalyticsDashboard = ({ data }: { data: any }) => {
    if (!data || !data.overview) return null;

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-xl font-semibold mb-4 text-primary-dark">
          Admin Dashboard
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-800">
              {data.overview.totalUsers}
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600">Total Merchants</p>
            <p className="text-2xl font-bold text-indigo-800">
              {data.overview.totalMerchants}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Transactions</p>
            <p className="text-2xl font-bold text-green-800">
              {data.overview.totalTransactions}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-600">Total Amount</p>
            <p className="text-2xl font-bold text-amber-800">
              ${data.overview.totalAmount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="font-medium mb-2 text-gray-700">User Analysis</h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="font-medium">
                    {data.userAnalysis?.totalActiveUsers}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Users with Cards</p>
                  <p className="font-medium">
                    {data.userAnalysis?.usersWithCards}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Outstanding Amount</p>
                  <p className="font-medium">
                    ${data.userAnalysis?.userOutstandingAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Outstanding</p>
                  <p className="font-medium">
                    ${data.userAnalysis?.averageOutstandingPerUser}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2 text-gray-700">
              Merchant Analysis
            </h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Active Merchants</p>
                  <p className="font-medium">
                    {data.merchantAnalysis?.totalActiveMerchants}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">With Transactions</p>
                  <p className="font-medium">
                    {data.merchantAnalysis?.merchantsWithTransactions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Transactions</p>
                  <p className="font-medium">
                    {data.merchantAnalysis?.averageTransactionsPerMerchant}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Amount</p>
                  <p className="font-medium">
                    ${data.merchantAnalysis?.averageAmountPerMerchant}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {data.transactionAnalysis?.recentTransactions &&
          data.transactionAnalysis.recentTransactions.length > 0 && (
            <div>
              <h5 className="font-medium mb-2 text-gray-700">
                Recent Transactions
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Merchant</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactionAnalysis.recentTransactions.map(
                      (tx: any, idx: number) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="py-2 text-sm font-mono">
                            {tx.id.slice(-8)}
                          </td>
                          <td className="py-2">{tx.customerName}</td>
                          <td className="py-2">{tx.merchantName}</td>
                          <td className="py-2">${tx.amount}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                tx.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : tx.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    );
  };

  // Add a TransactionDetailsView component for displaying transaction information
  const TransactionDetailsView = ({ transaction }: { transaction: any }) => {
    if (!transaction) return null;

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-xl font-semibold mb-4 text-primary-dark">
          Transaction Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="mb-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Transaction ID</p>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {transaction.status || "Unknown"}
                </span>
              </div>
              <p className="font-mono font-medium">
                {transaction.transactionId}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-2xl font-bold text-green-700">
                ${transaction.amount}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{transaction.description}</p>
            </div>
          </div>

          <div>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <h5 className="font-medium mb-2 text-gray-700">
                Card Information
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Card Number</p>
                  <p className="font-mono">
                    •••• {transaction.cardNumber?.slice(-4)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Card Holder</p>
                  <p>{transaction.cardHolderName}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2 text-gray-700">
                Merchant Details
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Merchant</p>
                  <p>{transaction.merchantName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Merchant ID</p>
                  <p className="font-mono text-xs">
                    {transaction.merchantId?._id || transaction.merchantId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {transaction.metadata && (
          <div className="p-4 bg-gray-50 rounded-lg mt-4">
            <h5 className="font-medium mb-2 text-gray-700">
              Additional Information
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="font-mono">{transaction.metadata.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Device Info</p>
                <p className="font-mono text-xs">
                  {transaction.metadata.deviceInfo}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-background pt-[130px] pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-dark">
            API Explorer
          </h1>
          <p className="text-lg text-text mb-12 max-w-3xl leading-relaxed">
            Test the GhostPay-Lite API directly from your browser. Select an
            endpoint, customize the request payload, and see the response.
          </p>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => handleEndpointChange("register-user")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "register-user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => handleEndpointChange("login")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "login"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleEndpointChange("issue-card")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "issue-card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Issue Card
              </button>
              <button
                onClick={() => handleEndpointChange("get-card")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "get-card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Get Card
              </button>
              <button
                onClick={() => handleEndpointChange("charge-card")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "charge-card"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Charge Card
              </button>
              <button
                onClick={() => handleEndpointChange("transaction-details")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "transaction-details"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Transaction Details
              </button>
              <button
                onClick={() => handleEndpointChange("card-analytics")}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedApi === "card-analytics"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-text"
                }`}
              >
                Card Analytics
              </button>
            </div>

            {(selectedApi === "register-user" || selectedApi === "login") && (
              <div className="mb-4 flex gap-3">
                <button
                  onClick={() => handleRoleChange("user")}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    role === "user"
                      ? "bg-secondary text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-text"
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => handleRoleChange("merchant")}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    role === "merchant"
                      ? "bg-secondary text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-text"
                  }`}
                >
                  Merchant
                </button>
                <button
                  onClick={() => handleRoleChange("admin")}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    role === "admin"
                      ? "bg-secondary text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-text"
                  }`}
                >
                  Admin
                </button>
              </div>
            )}

            {activeTokens.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-800">
                  Active Authentication
                </h4>
                <div className="flex gap-2 mt-1">
                  {activeTokens.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {getEndpointRequirements() && selectedApi !== "card-analytics" && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm">
                  <span className="font-medium">Note:</span>{" "}
                  {getEndpointRequirements()}
                </p>
                {!isTokenAvailableForEndpoint() && (
                  <p className="text-red-600 text-sm mt-1">
                    <span className="font-medium">Warning:</span> Required
                    authentication not available
                  </p>
                )}
              </div>
            )}

            {selectedApi === "charge-card" && !savedCardData && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">
                  <span className="font-medium">Warning:</span> You need to
                  issue a card first using a user account before charging.
                </p>
              </div>
            )}

            {selectedApi === "card-analytics" && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Select Analytics View
                </h4>
                <div className="flex gap-3 mb-2">
                  <button
                    onClick={() => handleAnalyticsRoleChange("user")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      analyticsRole === "user"
                        ? "bg-secondary text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-text"
                    }`}
                  >
                    User Analytics
                  </button>
                  <button
                    onClick={() => handleAnalyticsRoleChange("merchant")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      analyticsRole === "merchant"
                        ? "bg-secondary text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-text"
                    }`}
                  >
                    Merchant Analytics
                  </button>
                  <button
                    onClick={() => handleAnalyticsRoleChange("admin")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      analyticsRole === "admin"
                        ? "bg-secondary text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-text"
                    }`}
                  >
                    Admin Analytics
                  </button>
                </div>

                {/* Show warning if the required token is not available */}
                {!isAnalyticsTokenAvailable() && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">
                      <span className="font-medium">Warning:</span> No{" "}
                      {analyticsRole} token available. Please login as a{" "}
                      {analyticsRole} first to access {analyticsRole} analytics.
                    </p>
                  </div>
                )}

                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    <span className="font-medium">Note:</span> Requires{" "}
                    {analyticsRole} authentication
                  </p>
                </div>
              </div>
            )}

            {/* Add transaction ID input field when transaction-details is selected */}
            {selectedApi === "transaction-details" && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <label
                  htmlFor="transaction-id"
                  className="block font-medium text-blue-800 mb-2"
                >
                  Transaction ID
                </label>
                <div className="flex">
                  <input
                    id="transaction-id"
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID (e.g. TXN1234567890)"
                    className="flex-1 p-2 border border-blue-200 rounded-l-md focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <button
                    onClick={handleSendRequest}
                    disabled={isLoading || !transactionId}
                    className={`px-4 py-2 rounded-r-md font-medium transition-colors ${
                      !transactionId
                        ? "bg-blue-300 text-white cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {isLoading ? "Loading..." : "Fetch"}
                  </button>
                </div>
                {transactionId ? (
                  <p className="mt-2 text-sm text-blue-600">
                    Ready to fetch details for transaction: {transactionId}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-blue-600">
                    Enter a transaction ID or process a charge to generate one
                    automatically. Requires merchant authentication.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text">Request</h3>
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
                  className="w-full h-80 p-4 border border-gray-200 rounded-md font-mono text-sm bg-white text-text shadow-inner focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Enter JSON payload..."
                  disabled={getHttpMethod(selectedApi) === "GET"}
                />
                <button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="mt-3 bg-primary hover:bg-primary-dark px-4 py-2 rounded-md font-medium transition-colors text-white flex items-center"
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
                <h3 className="font-semibold mb-3 text-text">Response</h3>
                <div className="h-80 overflow-auto bg-gray-900 rounded-md border border-gray-200">
                  {error ? (
                    <div className="p-4 text-red-400 font-mono text-sm">
                      Error: {error}
                      {debugInfo && (
                        <div className="mt-2 p-2 bg-gray-800 rounded text-yellow-300 text-xs">
                          <strong>Troubleshooting:</strong> {debugInfo}
                        </div>
                      )}
                    </div>
                  ) : responseData ? (
                    selectedApi === "card-analytics" ? (
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
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Response will appear here after sending a request
                    </div>
                  )}
                </div>

                {/* Display the virtual card for card-related endpoints */}
                {responseData &&
                  ["issue-card", "get-card", "charge-card"].includes(
                    selectedApi
                  ) && (
                    <div className="mt-6">
                      <h4 className="font-medium text-text mb-3">
                        Virtual Card
                      </h4>
                      <VirtualCard
                        cardData={
                          selectedApi === "issue-card"
                            ? responseData.card
                            : selectedApi === "get-card"
                            ? responseData.card
                            : savedCardData
                        }
                        isVerified={cardVerified}
                        transactionStatus={transactionStatus}
                      />
                    </div>
                  )}

                {/* Display role-specific analytics dashboards */}
                {responseData && selectedApi === "card-analytics" && (
                  <>
                    {analyticsRole === "admin" && (
                      <AdminAnalyticsDashboard data={responseData} />
                    )}
                    {analyticsRole === "merchant" && (
                      <MerchantAnalyticsDashboard data={responseData} />
                    )}
                    {analyticsRole === "user" && (
                      <UserAnalyticsDashboard data={responseData} />
                    )}
                  </>
                )}

                {/* Add transaction details view for the response */}
                {responseData &&
                  selectedApi === "transaction-details" &&
                  responseData.transaction && (
                    <TransactionDetailsView
                      transaction={responseData.transaction}
                    />
                  )}

                {/* Add button to view transaction details after successful charge */}
                {responseData &&
                  selectedApi === "charge-card" &&
                  responseData.transaction?.id && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="font-medium text-green-800">
                        Charge Processed Successfully
                      </h4>
                      <p className="text-green-700 text-sm mt-1">
                        Transaction ID:{" "}
                        <span className="font-mono">
                          {responseData.transaction.id}
                        </span>
                      </p>
                      <button
                        onClick={() => {
                          setTransactionId(responseData.transaction.id);
                          handleEndpointChange("transaction-details");
                        }}
                        className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition-colors text-white"
                      >
                        View Transaction Details
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-primary-dark">
              Need More Details?
            </h3>
            <p className="mb-6 text-text">
              Check out our comprehensive API documentation to learn about all
              available endpoints, request parameters, response formats, and
              error handling.
            </p>
            <div className="flex">
              <a
                href="/api-docs"
                className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-md font-medium transition-colors text-white"
              >
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
