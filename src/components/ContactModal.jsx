import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'
import { fireGrandConfetti } from '../utils/confetti.js'

const TOPICS = [
  { id: 'job', label: '💼 Job Opportunity' },
  { id: 'collab', label: '🤝 Project / Collab' },
  { id: 'chat', label: '☕ Tech Chat' },
  { id: 'systems', label: '⚡ Distributed Systems / IRCTC' },
  { id: 'other', label: '✨ Other' },
]

export default function ContactModal({ isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'job',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [copiedDraft, setCopiedDraft] = useState(false)

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setErrors({})
    }
  }, [isOpen])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief message'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Simulate sending dispatch
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      fireGrandConfetti()
    }, 700)
  }

  const handleCopyDraft = () => {
    const draft = `From: ${formData.name} <${formData.email}>\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
    navigator.clipboard.writeText(draft)
    setCopiedDraft(true)
    setTimeout(() => setCopiedDraft(false), 2000)
  }

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`[Portfolio Contact] ${formData.topic} from ${formData.name}`)
    const body = encodeURIComponent(
      `Hi Chiranjeevi,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
    )
    return `mailto:varmapenmatsa4567@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="contact-modal-backdrop" onClick={() => setIsOpen(false)}>
          <motion.div
            className="contact-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="contact-modal-header">
              <div className="contact-modal-badge mono">
                <Sparkles size={14} className="accent-color" /> Direct Message
              </div>
              <button
                type="button"
                className="contact-modal-close"
                onClick={() => setIsOpen(false)}
                title="Close (ESC)"
              >
                <X size={18} />
              </button>
            </div>

            {!isSuccess ? (
              <>
                <div className="contact-modal-intro">
                  <h3>Let&apos;s build something <span className="grad-text">extraordinary</span></h3>
                  <p>Drop a note below. I typically reply within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  {/* Topic selector pills */}
                  <div className="form-group">
                    <label className="form-label mono">Topic</label>
                    <div className="topic-pill-group">
                      {TOPICS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`topic-pill ${formData.topic === t.id ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, topic: t.id })}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email in 2 columns */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label mono">
                        <User size={13} /> Your Name *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g. Alex Rivera"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (errors.name) setErrors({ ...errors, name: null })
                        }}
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label mono">
                        <Mail size={13} /> Email Address *
                      </label>
                      <input
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="e.g. alex@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          if (errors.email) setErrors({ ...errors, email: null })
                        }}
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="form-group">
                    <div className="form-label-row">
                      <label className="form-label mono">
                        <MessageSquare size={13} /> Message *
                      </label>
                      <span className="char-count mono">
                        {formData.message.length} chars
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="Tell me about your project, ideas, or opportunity..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value })
                        if (errors.message) setErrors({ ...errors, message: null })
                      }}
                    />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send Message & Trigger Confetti
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Celebration State */
              <motion.div
                className="contact-success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                <div className="success-icon-badge">
                  <CheckCircle2 size={44} className="accent-color" />
                </div>
                <h3>Message Sent Successfully! 🎉</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>! Your note regarding &quot;
                  {TOPICS.find((t) => t.id === formData.topic)?.label.split(' ')[1] || formData.topic}
                  &quot; has been recorded. I&apos;ll get back to you at <code>{formData.email}</code>.
                </p>

                <div className="success-actions">
                  <a
                    href={getMailtoUrl()}
                    className="btn btn-ghost success-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={15} /> Open in Email App as Backup
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost success-btn"
                    onClick={handleCopyDraft}
                  >
                    {copiedDraft ? <Check size={15} /> : <Copy size={15} />}
                    {copiedDraft ? 'Copied to Clipboard!' : 'Copy Draft Text'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary success-btn"
                    onClick={() => {
                      setFormData({ name: '', email: '', topic: 'job', message: '' })
                      setIsSuccess(false)
                    }}
                  >
                    Send Another Note
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
