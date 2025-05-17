import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              GhostPay<span className="text-secondary-light">Lite</span>
            </h3>
            <p className="text-sm text-gray-300">
              A lightweight, microservice-based payment token API that issues
              single-use virtual cards and processes charges.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-secondary-light transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/api-docs"
                  className="hover:text-secondary-light transition-colors"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-secondary-light transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/your-username/ghostpay-lite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary-light transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-light transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-light transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} GhostPay-Lite. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
