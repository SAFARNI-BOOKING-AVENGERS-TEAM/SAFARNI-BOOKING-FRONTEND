import Link from "next/link";

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
              <li><Link href="/tours" className="hover:text-white transition-colors">Tours</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link></li>
              <li><Link href="/flights" className="hover:text-white transition-colors">Flights</Link></li>
              <li><Link href="/cars" className="hover:text-white transition-colors">Car Rentals</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
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
