'use client';
import FAQCard from '@/app/components/helpdesk/FAQCard';
import api from '@/app/src/services/api';
import { useEffect, useState } from 'react';


export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api.get('/helpdesk/faqs').then(res => setFaqs(res.data));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">HR FAQs</h1>
      <div className="grid gap-4">
        {faqs.map((f: any) => (
          <FAQCard key={f.id} question={f.question} answer={f.answer} />
        ))}
      </div>
    </div>
  );
}