import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <XCircle
          size={80}
          className="mx-auto text-red-500 mb-5"
        />

        <h1 className="text-3xl font-bold text-gray-800">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mt-4 leading-7">
          Your payment has been cancelled.
          <br />
          You can try again anytime.
        </p>

        <div className="flex gap-4 mt-8">

          <Link
            to="/pricing"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold text-center transition"
          >
            Try Again
          </Link>

          <Link
            to="/"
            className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-lg font-semibold text-center transition"
          >
            Home
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Cancel;