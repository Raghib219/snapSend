
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-display font-bold text-lg">Expense<span className="text-gray-400">Snap</span></span>
            <p className="text-gray-500 text-sm mt-1">
              Simplify your expense categorization
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="#" className="text-gray-500 hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-black transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-100 pt-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ExpenseSnap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
