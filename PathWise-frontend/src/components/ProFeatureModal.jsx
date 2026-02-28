import React from "react";
import { X } from "lucide-react";

const ProFeatureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center">
          Subscribe to <span className="text-emerald-600">Pro Feature</span>
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Unlock premium insights for just <span className="font-semibold">₦2,000</span>
        </p>

        <ul className="space-y-3 text-gray-700 mb-6">
          <li>✨ Real-life job metrics & insights</li>
          <li>👨‍🏫 Access to expert mentorship</li>
          <li>🤖 AI-powered learning analysis</li>
          <li>📘 Personalized skill learning guides</li>
        </ul>

        <button
          onClick={() => alert("Redirect to payment or subscription logic")}
          className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default ProFeatureModal;
