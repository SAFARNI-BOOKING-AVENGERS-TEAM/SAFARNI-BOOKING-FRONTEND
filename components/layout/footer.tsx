export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-2">Safarni</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Your integrated travel marketplace for tours, flights, car rentals,
              hotels, and curated vacation packages worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/tours" className="hover:text-white transition-colors">Tours</a></li>
              <li><a href="/hotels" className="hover:text-white transition-colors">Hotels</a></li>
              <li><a href="/flights" className="hover:text-white transition-colors">Flights</a></li>
              <li><a href="/cars" className="hover:text-white transition-colors">Car Rentals</a></li>
              <li><a href="/packages" className="hover:text-white transition-colors">Packages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/login" className="hover:text-white transition-colors">Sign In</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">My Dashboard</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Safarni. All rights reserved.
        </div>
      </div>
    </footer>
  );
}