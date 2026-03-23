
'use client';

import { useEffect, useState } from 'react';
import { getFAQs } from '@/app/src/services/helpdesk';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    getFAQs().then((res) => setFaqs(res.data));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">FAQs</h1>

      {faqs.map((f) => (
        <div key={f.id} className="mb-4 border p-4 rounded">
          <h2 className="font-semibold">{f.question}</h2>
          <p className="text-gray-600 mt-2">{f.answer}</p>
        </div>
      ))}
    </div>
  );
}