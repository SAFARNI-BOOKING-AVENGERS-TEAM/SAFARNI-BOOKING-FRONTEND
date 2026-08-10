export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Safarni</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your gateway to unforgettable journeys
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}