import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MpesaReceipt } from '../types';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Download,
  X,
  CreditCard,
  Send,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
} from 'lucide-react';

export const MpesaPaymentModal: React.FC = () => {
  const { activePaymentModal, closePaymentModal, recordSuccessfulPayment, user } = useApp();

  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '0707423879');
  const [transactionCode, setTransactionCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingPrompt, setIsSendingPrompt] = useState(false);
  const [promptSentMessage, setPromptSentMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [verifiedReceipt, setVerifiedReceipt] = useState<MpesaReceipt | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (activePaymentModal?.isOpen) {
      setTransactionCode('');
      setIsVerifying(false);
      setIsSendingPrompt(false);
      setPromptSentMessage('');
      setErrorMsg('');
      setVerifiedReceipt(null);

      const targetPhone = user.phoneNumber || '0707423879';
      setPhoneNumber(targetPhone);
    }
  }, [activePaymentModal?.isOpen]);

  if (!activePaymentModal || !activePaymentModal.isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0707423879');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText('15');
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Optional: Trigger STK Push prompt to user's phone
  const handleTriggerStkPush = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      setErrorMsg('Please enter a valid Safaricom phone number to receive prompt (e.g. 0712345678).');
      return;
    }

    setIsSendingPrompt(true);
    setErrorMsg('');
    setPromptSentMessage('');

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: 15,
          documentTitle: activePaymentModal.docTitle,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPromptSentMessage(
          `Payment prompt sent to ${phoneNumber}! Enter your M-Pesa PIN on your phone, then copy the confirmation code from Safaricom SMS and paste it below.`
        );
      } else {
        setErrorMsg(data.message || 'Failed to trigger phone prompt. Please use Send Money to 0707423879.');
      }
    } catch (err) {
      setPromptSentMessage(
        `Payment prompt dispatched to ${phoneNumber}. Once you approve and receive the Safaricom confirmation SMS, enter the reference code below.`
      );
    } finally {
      setIsSendingPrompt(false);
    }
  };

  // MANDATORY: Verify M-Pesa transaction reference code before downloading!
  const handleConfirmMpesaCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const codeToVerify = transactionCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!codeToVerify || codeToVerify.length < 8) {
      setErrorMsg(
        'Please enter a valid M-Pesa SMS reference code (e.g., TD7491NM82 or SLT894K20L) received after paying Ksh 15 to 0707423879.'
      );
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/mpesa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionCode: codeToVerify,
          phoneNumber: phoneNumber,
          amount: 15,
          documentTitle: activePaymentModal.docTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Verification failed. Please check the transaction code and try again.');
        setIsVerifying(false);
        return;
      }

      // Valid payment confirmed!
      const receipt: MpesaReceipt = {
        receiptNo: data.receipt?.receiptNo || codeToVerify,
        amount: 15,
        recipientPhone: '0707423879',
        payerPhone: phoneNumber,
        documentTitle: activePaymentModal.docTitle,
        documentType: activePaymentModal.docType,
        documentId: activePaymentModal.docId,
        dateTime: data.receipt?.dateTime || new Date().toLocaleTimeString('en-KE'),
        downloadFormat: activePaymentModal.format,
      };

      setVerifiedReceipt(receipt);
      recordSuccessfulPayment(receipt);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00a859', '#10b981', '#34d399', '#ffffff'],
      });
    } catch (err: any) {
      setErrorMsg('Network error while verifying transaction code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 shadow-inner">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg leading-tight">M-PESA Payment Confirmation</h3>
              <p className="text-xs text-emerald-100 font-medium">Recipient: 0707423879 (IMANI TEACHERS CENTER)</p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {verifiedReceipt ? (
          // Verified Success Screen - Confirmed Payment by Reference Code
          <div className="p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Payment Confirmed by M-Pesa</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Document Unlocked!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Ksh 15.00 payment verified for <span className="font-semibold text-emerald-600 dark:text-emerald-400">{verifiedReceipt.documentTitle}</span>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">M-PESA Reference Code:</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm tracking-wider">{verifiedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">0707423879 (IMANI TEACHERS CENTER)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900 dark:text-white">Ksh 15.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Format:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[11px]">
                  {verifiedReceipt.downloadFormat === 'WORD' ? 'Microsoft Word (.docx)' : 'Printable PDF'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-left text-xs flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your download has begun. You can also re-download the document at any time below.</span>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (activePaymentModal?.callback) {
                    activePaymentModal.callback();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Document Again</span>
              </button>
              <button
                type="button"
                onClick={closePaymentModal}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Done & Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 md:p-6 space-y-4 overflow-y-auto">
            {/* Target Document Info */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-center justify-between">
              <div className="truncate pr-2">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Document to Download
                </p>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {activePaymentModal.docTitle}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2.5 py-0.5 text-xs font-black rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 block">
                  Ksh 15.00
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-bold uppercase">
                  {activePaymentModal.format}
                </span>
              </div>
            </div>

            {/* STEP 1: PAYMENT INSTRUCTIONS (Ksh 15 to 0707423879) */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200 uppercase tracking-wide flex items-center">
                  <CreditCard className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Step 1: Pay Ksh 15 via M-Pesa
                </span>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                  Fixed Fee: Ksh 15
                </span>
              </div>

              {/* Quick Copy Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">Recipient Phone:</span>
                    <strong className="font-mono text-slate-900 dark:text-white text-xs md:text-sm">0707423879</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 px-2.5 py-1 rounded-lg ml-1 shrink-0 cursor-pointer"
                  >
                    {copiedPhone ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Amount:</span>
                    <strong className="font-mono text-slate-900 dark:text-white text-xs md:text-sm">Ksh 15</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 px-2.5 py-1 rounded-lg ml-1 shrink-0 cursor-pointer"
                  >
                    {copiedAmount ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* 3 Step Instructions */}
              <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                <p>1. Open M-Pesa on your phone &gt; <strong>Send Money</strong></p>
                <p>2. Enter Phone: <strong className="text-emerald-700 dark:text-emerald-400">0707423879</strong> (IMANI TEACHERS CENTER)</p>
                <p>3. Enter Amount: <strong className="text-emerald-700 dark:text-emerald-400">Ksh 15</strong> and complete with your PIN</p>
              </div>

              {/* Optional STK prompt button */}
              <div className="pt-1 border-t border-emerald-200/60 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Your Safaricom phone e.g. 0712345678"
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTriggerStkPush}
                  disabled={isSendingPrompt}
                  className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSendingPrompt ? 'Sending...' : 'Request STK Push'}</span>
                </button>
              </div>

              {promptSentMessage && (
                <div className="p-2 bg-emerald-100/80 dark:bg-emerald-950/50 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center space-x-1.5 animate-fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{promptSentMessage}</span>
                </div>
              )}
            </div>

            {/* STEP 2: CONFIRM PAYMENT WITH M-PESA REFERENCE CODE */}
            <form onSubmit={handleConfirmMpesaCode} className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-emerald-400 uppercase tracking-wide flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                  Step 2: Enter M-Pesa Reference Code
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Compulsory</span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  M-Pesa Transaction Reference Code (from Safaricom SMS):
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    required
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TD7491NM82 or SLT894K20L"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 text-white font-mono text-sm uppercase tracking-wider font-extrabold rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10.5px] text-slate-400">
                  Check your phone SMS from MPESA after sending Ksh 15 to <strong>0707423879</strong>.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  {isVerifying ? 'Confirming with M-Pesa...' : 'Confirm M-Pesa Payment & Download Document'}
                </span>
              </button>
            </form>

            {errorMsg && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
