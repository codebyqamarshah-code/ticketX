'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    topic: 'general',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto py-10">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--fg)] tracking-tight">
              Contact Fan Support
            </h1>
            <p className="mt-4 text-base text-[var(--fg-sec)]">
              Have questions about your order, tickets, or venue entry? We are here 24/7.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={22} className="text-[var(--fg)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--fg)] mb-1">24/7 Live Chat</h3>
              <p className="text-xs text-[var(--fg-sec)] mb-4">Instant answers from our fan advocates</p>
              <button className="w-full py-2.5 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold rounded-xl hover:opacity-90 transition-all">
                Start Live Chat
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                <Phone size={22} className="text-[var(--fg)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--fg)] mb-1">VIP Phone Hotline</h3>
              <p className="text-xs text-[var(--fg-sec)] mb-4">Dedicated phone line for urgent event day support</p>
              <a
                href="tel:18005558589"
                className="inline-block w-full py-2.5 border border-[var(--border)] text-[var(--fg)] text-xs font-bold rounded-xl hover:bg-[var(--bg-sec)] transition-all"
              >
                +1 (800) 555-TKTX
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                <Mail size={22} className="text-[var(--fg)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--fg)] mb-1">Email Support</h3>
              <p className="text-xs text-[var(--fg-sec)] mb-4">Average response time: under 2 hours</p>
              <a
                href="mailto:support@ticketx.com"
                className="inline-block w-full py-2.5 border border-[var(--border)] text-[var(--fg)] text-xs font-bold rounded-xl hover:bg-[var(--bg-sec)] transition-all"
              >
                support@ticketx.com
              </a>
            </div>
          </div>

          {/* Form & Office Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 p-8 md:p-12 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/5">
              <h2 className="text-2xl font-bold text-[var(--fg)] mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="py-12 text-center">
                  <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[var(--fg)] mb-2">Message Sent Successfully!</h3>
                  <p className="text-sm text-[var(--fg-sec)] max-w-md mx-auto mb-6">
                    Thank you for reaching out. A TicketX support specialist has received your inquiry and will respond to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[var(--fg)] text-[var(--bg)] font-bold text-xs rounded-xl"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                        Order ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        placeholder="e.g. TX-98402"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                        Topic / Category *
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--fg-sec)]"
                      >
                        <option value="general">General Support</option>
                        <option value="refund">Refunds & Cancelled Shows</option>
                        <option value="entry">Mobile Barcode & Venue Entry</option>
                        <option value="resale">Ticket Resale & Transfers</option>
                        <option value="plus">TicketX+ Membership</option>
                        <option value="accessibility">ADA & Accessibility Services</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)] mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your issue in detail..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-sm text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Submit Support Ticket <Send size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Right 1 Col: Global Offices */}
            <div className="p-8 rounded-3xl bg-[var(--bg-sec)] border border-[var(--border)] space-y-6">
              <h3 className="text-xl font-bold text-[var(--fg)] mb-4">TicketX Global Headquarters</h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-[var(--fg-sec)] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--fg)]">Los Angeles</h4>
                    <p className="text-xs text-[var(--fg-sec)] leading-relaxed">
                      1000 Wilshire Boulevard, Suite 1400<br />Los Angeles, CA 90017
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin size={18} className="text-[var(--fg-sec)] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--fg)]">New York</h4>
                    <p className="text-xs text-[var(--fg-sec)] leading-relaxed">
                      350 Fifth Avenue, Floor 42<br />New York, NY 10118
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin size={18} className="text-[var(--fg-sec)] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--fg)]">London</h4>
                    <p className="text-xs text-[var(--fg-sec)] leading-relaxed">
                      100 Bishopsgate, Level 18<br />London EC2N 4AG, United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
