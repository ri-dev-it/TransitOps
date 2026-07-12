import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages([...messages, userMsg, { sender: 'bot', text: data.reply }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 h-96 bg-white border border-[#D8C9A7] rounded-2xl shadow-xl p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((m, i) => <p key={i} className={m.sender === 'user' ? 'text-right' : 'text-left'}>{m.text}</p>)}
          </div>
          <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-2 border rounded-full" />
          <button onClick={sendMessage} className="mt-2 bg-[var(--accent)] text-white rounded-full py-1">Send</button>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-[var(--accent)] text-white p-4 rounded-full shadow-lg">Chat</button>
    </div>
  );
}