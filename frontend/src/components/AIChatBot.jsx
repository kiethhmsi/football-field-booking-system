import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minus, RefreshCcw, Sparkles, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';

const FAQ_LIST = [
    { id: 1, text: "Làm sao để đặt sân?", icon: <Calendar size={14} /> },
    { id: 2, text: "Chính sách hủy sân?", icon: <X size={14} /> },
    { id: 3, text: "Giá sân như thế nào?", icon: <CreditCard size={14} /> },
    { id: 4, text: "Vị trí các cụm sân?", icon: <MapPin size={14} /> },
];

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Xin chào Anh/Chị! Em là trợ lý ảo **KASPORT AI**. Em có thể giúp gì cho Anh/Chị hôm nay ạ? 😄' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setShowPreview(false);
        }
    }, [messages, isOpen]);

    const handleSend = async (customText = null) => {
        const textToSend = customText || input;
        if (!textToSend.trim()) return;

        const userMsg = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:3000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    history: messages.slice(-6)
                })
            });

            const data = await response.json();
            const replyText = data.success ? data.message : (data.message || '⚠️ Hệ thống đang bận một chút, Anh/Chị thử lại sau nhé!');
            setMessages(prev => [...prev, { role: 'model', text: replyText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: '⚠️ Rất tiếc, em đang gặp trục trặc kết nối. Anh/Chị thử lại sau nhé!' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Bong bóng xem trước lời chào (Thẻ Widget Ngang Nhỏ Gọn) */}
            <AnimatePresence>
                {showPreview && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-20 right-0 w-[270px] bg-white/95 backdrop-blur-md p-3.5 pr-6 rounded-[1.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white/50 mb-2 cursor-pointer group flex flex-row items-center text-left gap-3.5"
                        onClick={() => setIsOpen(true)}
                    >
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white text-slate-400 rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition-colors border border-slate-100"
                        >
                            <X size={12} />
                        </button>
                        
                        {/* Biểu tượng thông minh tỏa sáng ở bên trái */}
                        <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-100 group-hover:scale-110 transition-transform duration-300 shrink-0">
                            <Sparkles size={18} />
                        </div>
                        
                        {/* Chi tiết nội dung chữ căn trái */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-black text-slate-800 tracking-tight leading-tight">KASPORT Assistant</p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug font-medium">
                                Xin chào! Em có thể giúp gì ạ?
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
                        className="mb-4 w-[420px] h-[650px] bg-slate-50/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white flex flex-col overflow-hidden text-left"
                    >
                        {/* Header: Premium Sport Aesthetic */}
                        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                                </svg>
                            </div>
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                            <Bot size={28} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-emerald-600 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-[17px] font-extrabold leading-none tracking-tight">KASPORT AI</h3>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-50">Đang trực tuyến</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setMessages([{ role: 'model', text: 'Em đã sẵn sàng hỗ trợ lại từ đầu ạ! Anh/Chị cần em giúp gì thế?' }])} 
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all border-none bg-transparent text-white cursor-pointer"
                                        title="Làm mới hội thoại"
                                    >
                                        <RefreshCcw size={20} />
                                    </button>
                                    <button 
                                        onClick={() => setIsOpen(false)} 
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all border-none bg-transparent text-white cursor-pointer"
                                    >
                                        <Minus size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'model' && (
                                        <div className="w-9 h-9 bg-emerald-100 rounded-xl shrink-0 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                                            <Bot size={20} />
                                        </div>
                                    )}
                                    <div className={`group relative max-w-[80%] p-4 rounded-[1.5rem] text-[14.5px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                        msg.role === 'user' 
                                        ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                        {msg.text.split('\n').map((line, i) => {
                                            const isListItem = line.trim().startsWith('-') || line.trim().startsWith('*');
                                            const cleanLine = isListItem ? line.trim().replace(/^[-*]\s*/, '') : line;
                                            const content = cleanLine.split('**').map((part, j) => 
                                                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                            );
                                            if (isListItem) {
                                                return (
                                                    <li key={i} className="ml-4 list-disc mt-1 text-[14px]">
                                                        {content}
                                                    </li>
                                                );
                                            }
                                            return (
                                                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                                    {content}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* FAQ Quick Replies */}
                            {messages.length === 1 && !isTyping && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <p className="text-[12px] font-bold text-slate-400 ml-12 uppercase tracking-wider">Gợi ý cho Anh/Chị</p>
                                    <div className="grid grid-cols-2 gap-2 ml-12">
                                        {FAQ_LIST.map((faq) => (
                                            <motion.button
                                                key={faq.id}
                                                whileHover={{ scale: 1.02, backgroundColor: '#fff' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSend(faq.text)}
                                                className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl text-[13px] text-slate-600 text-left hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm cursor-pointer"
                                            >
                                                <span className="text-emerald-500">{faq.icon}</span>
                                                {faq.text}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isTyping && (
                                <div className="flex justify-start gap-3">
                                    <div className="w-9 h-9 bg-emerald-100 rounded-xl shrink-0 flex items-center justify-center text-emerald-600">
                                        <Bot size={20} />
                                    </div>
                                    <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 shadow-sm border border-slate-100">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input & Footer Area */}
                        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                            <div className="relative flex items-center mb-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Nhập tin nhắn..."
                                    className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-[14.5px] outline-none focus:border-emerald-500 focus:bg-white transition-all pr-14 shadow-inner"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    className="absolute right-2 w-11 h-11 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all border-none cursor-pointer shadow-lg shadow-emerald-100"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between px-1">
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Trợ lý ảo thông minh KASPORT
                                </p>
                                <a href="/fields" className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 hover:underline decoration-2">
                                    Đặt sân ngay <ChevronRight size={12} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_15px_40px_rgba(16,185,129,0.4)] transition-all border-none cursor-pointer relative overflow-hidden group
                    ${isOpen ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'}
                `}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                
                <div className="relative z-10">
                    <Bot size={32} />
                    {!isOpen && (
                        <>
                            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                        </>
                    )}
                </div>
            </motion.button>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default AIChatBot;
