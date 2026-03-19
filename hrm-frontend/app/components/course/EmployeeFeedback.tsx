"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollmentId: number;
  onSave: () => void;
}

export default function FeedbackModal({ isOpen, onClose, onSave, enrollmentId }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }
    try {
      await api.post("/employee/training/feedback", {
        enrollmentId,
        feedback,
      });
      toast.success("Feedback submitted successfully");
      onSave();
      onClose();
      setFeedback("");
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Submit Feedback
        </h2>

        <textarea
          className="w-full border rounded p-2 h-32"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mt-3 w-full flex items-center justify-center gap-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
}