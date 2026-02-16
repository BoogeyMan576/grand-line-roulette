"use client";
import { useState } from "react";
import Link from "next/link";
import "./contact.css";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Yahan apni Formspree ID daalein
    const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      setIsSubmitted(true);
      setLoading(false);
    } else {
      alert("Error! Please check if the email is correct.");
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-card">
        <h1 className="contact-title">CONTACT US</h1>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              {/* --- NAME FIELD --- */}
              <div className="form-group">
                <label>PIRATE NAME</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Luffy" 
                  required 
                />
              </div>

              {/* --- EMAIL FIELD WITH STRICT VALIDATION --- */}
              <div className="form-group">
                <label>EMAIL</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="name@email.com" 
                  required 
                  title="Please enter a valid email address (must include @ and a domain)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>SUBJECT</label>
                <select name="subject" required>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Character Feedback">Character Feedback</option>
                  <option value="System Bug">System Bug</option>
                  <option value="Business">Business</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>YOUR MESSAGE</label>
              <textarea 
                name="message" 
                placeholder="Write your message here..." 
                required
              ></textarea>
            </div>

            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        ) : (
          <div className="success-msg">
            <p>MESSAGE RECEIVED! WE WILL GET BACK TO YOU SOON.</p>
          </div>
        )}

        <Link href="/" className="back-home">RETURN TO GRAND LINE</Link>
        <div className="anchor-decor">⚓</div>
      </div>
    </div>
  );
}