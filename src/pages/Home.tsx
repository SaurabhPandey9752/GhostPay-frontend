import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardFront = {
    initial: { opacity: 0, rotateY: 0 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 180 },
  };

  const cardBack = {
    initial: { opacity: 0, rotateY: -180 },
    animate: { opacity: 1, rotateY: -180 },
    exit: { opacity: 0, rotateY: 0 },
  };

  const generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Generate full card number but only display last 4 digits
  const fullCardNumber = `${generateRandom(4000, 4999)}${generateRandom(
    1000,
    9999
  )}${generateRandom(1000, 9999)}${generateRandom(1000, 9999)}`;

  const lastFourDigits = fullCardNumber.slice(-4);
  const maskedCardNumber = `**** **** **** ${lastFourDigits}`;

  const demoExpiry = `${String(generateRandom(1, 12)).padStart(
    2,
    "0"
  )}/${String(generateRandom(24, 28))}`;
  const demoCVV = String(generateRandom(100, 999));

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white pt-[130px] pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Secure Single-Use{" "}
                <span className="text-secondary-light">Virtual Cards</span> for
                Modern Payments
              </h1>
              <p className="text-xl mb-8">
                A lightweight, microservice-based payment token API that issues
                single-use virtual cards and processes charges securely and
                efficiently.
              </p>
              <div className="flex space-x-4">
                <Link to="/dashboard" className="btn btn-secondary">
                  Get Started
                </Link>
                <Link
                  to="/api-docs"
                  className="btn btn-outline bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  API Documentation
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div
                className="perspective-1000 w-full max-w-md cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {!isFlipped ? (
                  <motion.div
                    className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-primary-light to-primary rounded-xl shadow-lg p-6 flex flex-col justify-between preserve-3d"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={cardFront}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="text-xl font-bold text-white">
                          GhostPay
                          <span className="text-secondary-light">Lite</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-white/40 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-secondary"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 h-8 w-14 bg-gray-300/20 rounded"></div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl text-white tracking-widest font-mono mb-2 flex items-center">
                        <span className="mr-2">
                          <svg
                            className="w-4 h-4 inline-block"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        {maskedCardNumber}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-white/60 uppercase">
                            Valid Thru
                          </div>
                          <div className="text-white font-mono">
                            {demoExpiry}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/60 uppercase">
                            Cardholder
                          </div>
                          <div className="text-white font-medium">
                            GHOST USER
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-6 text-white/40 text-xs">
                      Click to flip
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg p-6 flex flex-col justify-between preserve-3d"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={cardBack}
                  >
                    <div className="absolute top-6 left-0 w-full h-10 bg-gray-800"></div>
                    <div className="absolute top-20 right-6 flex flex-col items-end">
                      <div className="bg-white/80 h-8 w-full max-w-[180px] flex items-center justify-end px-2 font-mono">
                        <span className="text-gray-900">{demoCVV}</span>
                      </div>
                      <div className="mt-2 h-12 w-16 bg-gray-600/50"></div>
                    </div>
                    <div className="absolute bottom-6 left-6 text-xs text-white/50 max-w-[240px]">
                      This card is for demo purposes only. Single-use virtual
                      cards are generated via API.
                    </div>
                    <div className="absolute bottom-4 right-6 text-white/40 text-xs">
                      Click to flip
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Advanced Security Features
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-3xl mx-auto">
            Our cutting-edge payment infrastructure ensures your transactions
            remain secure and protected at all times.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all bg-white group hover:border-primary">
              <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                PCI Compliant Encryption
              </h3>
              <p className="text-text-muted">
                Military-grade encryption with masked card numbers and
                tokenization for maximum data protection.
              </p>
              <ul className="mt-4 text-sm text-left space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>End-to-end data protection</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Zero PII storage on servers</span>
                </li>
              </ul>
            </div>

            <div className="card flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all bg-white group hover:border-primary">
              <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-time Fraud Detection
              </h3>
              <p className="text-text-muted">
                Advanced ML algorithms detect suspicious patterns and prevent
                unauthorized transactions instantly.
              </p>
              <ul className="mt-4 text-sm text-left space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Behavior anomaly detection</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Rate-limiting protection</span>
                </li>
              </ul>
            </div>

            <div className="card flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all bg-white group hover:border-primary">
              <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Role-Based Access Control
              </h3>
              <p className="text-text-muted">
                Granular permissions system ensures only authorized users can
                access specific card functionality.
              </p>
              <ul className="mt-4 text-sm text-left space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>JWT authentication</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Comprehensive audit logging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create an account now and start issuing secure single-use virtual
            cards for your payment needs.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/dashboard" className="btn btn-secondary">
              Register Now
            </Link>
            <Link
              to="/api-docs"
              className="btn btn-outline bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              View API Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
