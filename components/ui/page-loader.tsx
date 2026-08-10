/**
 * The exact markup that was duplicated in the customer/provider/admin
 * layouts' `isLoading` branch. Extracted here so it exists in one place.
 */
export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}
