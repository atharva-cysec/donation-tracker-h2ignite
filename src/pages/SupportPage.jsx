import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CircleHelp,
  ChevronDown,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getStoredDonations } from '../data/mockDonations';
import { validateEmail, validateRequired } from '../utils/validation';

// ─── FAQ Dataset ──────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: 'How do I track my donation?',
    answer:
      "Click 'Check Status' or 'Track' on any donation in your Dashboard or My Donations page. This immediately focuses the interactive Impact Tracker showing each milestone stage from donation receipt to verified fund release.",
  },
  {
    question: 'Where can I see my previous donations?',
    answer:
      "Navigate to 'My Donations' from the sidebar menu. You can review your full contribution history, view compact giving summaries, filter by status (All, In Progress, Completed), and search by cause or partner NGO.",
  },
  {
    question: 'What does "Verified on blockchain" mean?',
    answer:
      "TrustDonate uses Ethereum smart contracts as a tamper-proof transparency layer. Each donation and milestone release is logged on-chain, providing cryptographic evidence that funds were disbursed according to verified objectives.",
  },
  {
    question: 'Why does a donation show "Demo progress"?',
    answer:
      "TrustDonate is running in hackathon demonstration mode. Milestone stages reflect simulated project progress to demonstrate how transparency works prior to live Sepolia smart contract deployment.",
  },
  {
    question: 'How do I refresh donation status?',
    answer:
      "The Impact Tracker dynamically calculates milestone completion based on verified activity. In the future blockchain integration, refreshing queries the smart contract directly for new on-chain events.",
  },
];

const ISSUE_TYPES = [
  'Donation issue',
  'Tracking issue',
  'Verification issue',
  'Account issue',
  'Other',
];

export default function SupportPage() {
  const { user } = useAuth();
  const location = useLocation();
  const donations = useMemo(() => getStoredDonations(user?.id), [user?.id]);

  // Accordion state for FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // ─── Contact Form State ───
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactErrors, setContactErrors] = useState({});
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // ─── Report Issue Form State ───
  const [issueType, setIssueType] = useState('Donation issue');
  const [selectedDonationId, setSelectedDonationId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // Preselect donation if passed from Donation Details
  useEffect(() => {
    if (location.state?.preselectedDonationId) {
      setSelectedDonationId(location.state.preselectedDonationId);
    }
  }, [location.state]);

  // Keep contact name/email in sync if user logs in
  useEffect(() => {
    if (user?.name && !contactName) setContactName(user.name);
    if (user?.email && !contactEmail) setContactEmail(user.email);
  }, [user]);

  // ─── Contact Submit Handler ───
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSuccess(false);

    const nameVal = validateRequired(contactName, 'Name');
    const emailVal = validateEmail(contactEmail);
    const subjectVal = validateRequired(contactSubject, 'Subject');
    const messageVal = validateRequired(contactMessage, 'Message');

    const errs = {};
    if (!nameVal.isValid) errs.name = nameVal.message;
    if (!emailVal.isValid) errs.email = emailVal.message;
    if (!subjectVal.isValid) errs.subject = subjectVal.message;
    if (!messageVal.isValid) errs.message = messageVal.message;

    setContactErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setContactLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setContactLoading(false);
    setContactSuccess(true);
    setContactSubject('');
    setContactMessage('');
  };

  // ─── Report Issue Submit Handler ───
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportSuccess(false);
    setReportError('');

    if (!issueDescription.trim()) {
      setReportError('Please provide a description of the issue.');
      return;
    }

    setReportLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Isolate reports by user ID for privacy
    const userStorageKey = `trustdonate_reports_${user?.id || 'guest'}`;
    const newReport = {
      id: `report-${Date.now()}`,
      userId: user?.id || 'guest',
      userEmail: user?.email || '',
      issueType,
      donationId: selectedDonationId || null,
      description: issueDescription.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      localStorage.setItem(userStorageKey, JSON.stringify([newReport, ...existing]));
    } catch (err) {
      console.warn('Could not store report in localStorage', err);
    }

    setReportLoading(false);
    setReportSuccess(true);
    setIssueDescription('');
  };

  return (
    <MainLayout title="Help & Support">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2F7D5B]">
          Donor Assistance
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1">
          Help & Support
        </h2>
        <p className="text-sm text-[#68746F] mt-1 max-w-xl leading-relaxed">
          Find quick answers about donation tracking, send a message to our team,
          or report an issue with a donation or milestone.
        </p>
      </div>

      <div className="space-y-10 max-w-4xl">
        {/* ─── 1. HELP & FAQ SECTION ─── */}
        <section aria-labelledby="help-faq-heading" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E4E8E5]">
            <CircleHelp className="w-5 h-5 text-[#2F7D5B]" />
            <h3 id="help-faq-heading" className="text-base font-bold text-[#1D2925]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-2.5">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className="bg-white rounded-xl border border-[#E4E8E5] overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B]"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-[#1D2925]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#68746F] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2F7D5B]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#E4E8E5]/60 text-xs text-[#68746F] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 2. CONTACT US SECTION ─── */}
        <section aria-labelledby="contact-us-heading" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E4E8E5]">
            <Mail className="w-5 h-5 text-[#2F7D5B]" />
            <h3 id="contact-us-heading" className="text-base font-bold text-[#1D2925]">
              Contact Us
            </h3>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 sm:p-7 shadow-xs">
            <p className="text-xs text-[#68746F] mb-6 leading-relaxed">
              Have a question or feedback regarding the TrustDonate platform? Send us a message.
            </p>

            {contactSuccess && (
              <div
                role="alert"
                className="mb-6 rounded-xl bg-[#EAF3EE] border border-[#C8DFD2] p-4 flex items-start gap-3 text-xs text-[#2F7D5B]"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Thanks for reaching out.</p>
                  <p className="mt-0.5 leading-relaxed">
                    This contact form is currently running in prototype demo mode. In production, your message will be routed directly to our support desk.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="contact-name"
                  label="Your Name"
                  placeholder="Jane Smith"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  error={contactErrors.name}
                  disabled={contactLoading}
                />
                <Input
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  error={contactErrors.email}
                  disabled={contactLoading}
                />
              </div>

              <Input
                id="contact-subject"
                label="Subject"
                placeholder="e.g. Question about educational campaign milestones"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                error={contactErrors.subject}
                disabled={contactLoading}
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-[#1D2925]"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="How can we help you today?"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  disabled={contactLoading}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1D2925] placeholder:text-[#9BAB9E] transition-all duration-150 outline-none focus:ring-2 focus:ring-[#2F7D5B]/40 focus:border-[#2F7D5B] ${
                    contactErrors.message
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-[#E4E8E5] hover:border-[#9BAB9E]'
                  }`}
                />
                {contactErrors.message && (
                  <p className="text-xs text-red-600 font-medium">
                    {contactErrors.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#9BAB9E]">
                  Demo prototype mode
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={contactLoading}
                  disabled={contactLoading}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* ─── 3. REPORT AN ISSUE / COMPLAINT SECTION ─── */}
        <section aria-labelledby="report-issue-heading" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E4E8E5]">
            <AlertTriangle className="w-5 h-5 text-[#2F7D5B]" />
            <h3 id="report-issue-heading" className="text-base font-bold text-[#1D2925]">
              Report an Issue
            </h3>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 sm:p-7 shadow-xs">
            <p className="text-xs text-[#68746F] mb-6 leading-relaxed">
              Something doesn't look right with a donation or its progress? Let us know so our verification audit can review it.
            </p>

            {reportSuccess && (
              <div
                role="alert"
                className="mb-6 rounded-xl bg-[#EAF3EE] border border-[#C8DFD2] p-4 flex items-start gap-3 text-xs text-[#2F7D5B]"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Report recorded for this demo session.</p>
                  <p className="mt-0.5 leading-relaxed">
                    Your issue report has been saved locally for your account. In production, this opens a formal milestone audit ticket.
                  </p>
                </div>
              </div>
            )}

            {reportError && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3 text-xs text-[#B91C1C] font-medium"
              >
                {reportError}
              </div>
            )}

            <form onSubmit={handleReportSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Issue Type */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="issue-type"
                    className="text-sm font-medium text-[#1D2925]"
                  >
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="issue-type"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    disabled={reportLoading}
                    className="w-full rounded-xl border border-[#E4E8E5] bg-white px-4 py-2.5 text-xs font-semibold text-[#1D2925] outline-none focus:ring-2 focus:ring-[#2F7D5B]/40 focus:border-[#2F7D5B]"
                  >
                    {ISSUE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Related Donation Selector (Optional) */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="related-donation"
                    className="text-sm font-medium text-[#1D2925]"
                  >
                    Related Donation <span className="text-[#9BAB9E] text-xs font-normal">(Optional)</span>
                  </label>
                  <select
                    id="related-donation"
                    value={selectedDonationId}
                    onChange={(e) => setSelectedDonationId(e.target.value)}
                    disabled={reportLoading}
                    className="w-full rounded-xl border border-[#E4E8E5] bg-white px-4 py-2.5 text-xs font-semibold text-[#1D2925] outline-none focus:ring-2 focus:ring-[#2F7D5B]/40 focus:border-[#2F7D5B]"
                  >
                    <option value="">-- General Issue (No specific donation) --</option>
                    {donations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.cause} (₹{d.amount.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="issue-description"
                  className="text-sm font-medium text-[#1D2925]"
                >
                  Description of Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="issue-description"
                  rows={4}
                  placeholder="Please describe what appears inconsistent or incorrect..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  disabled={reportLoading}
                  className="w-full rounded-xl border border-[#E4E8E5] bg-white px-4 py-3 text-sm text-[#1D2925] placeholder:text-[#9BAB9E] transition-all duration-150 outline-none focus:ring-2 focus:ring-[#2F7D5B]/40 focus:border-[#2F7D5B]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#9BAB9E]">
                  Isolated to current user session
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={reportLoading}
                  disabled={reportLoading}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit Report</span>
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
