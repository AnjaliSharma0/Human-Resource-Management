'use client';
interface FAQCardProps {
  question: string;
  answer: string;
}

export default function FAQCard({ question, answer }: FAQCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200">
      <p className="font-semibold text-lg mb-2">Q: {question}</p>
      <p className="text-gray-700">A: {answer}</p>
    </div>
  );
}