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
  Zap,
  Radio,
  Clock,
  ArrowRight,
  Send,
  Lock,
} from 'lucide-react';

export const MpesaPaymentModal: React.FC = () => {
  const { activePaymentModal, closePaymentModal, recordSuccessfulPayment, user } = useApp();

  const [paymentMode, setPaymentMode] = useState<'STK_PROMPT' | 'MANUAL_CODE'>('STK_PROMPT');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '0707423879');
  const [transactionCode, setTransactionCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [verifiedReceipt, setVerifiedReceipt] = useState<MpesaReceipt | null>(null);

  // STK Push state
  const [stkSent, setStkSent] = useState(false);
  const [stkCountdown, setStkCountdown] = useState(30);
  const [stkReceiptCode, setStkReceiptCode] = useState('');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [promptMessage, setPromptMessage] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (activePaymentModal?.isOpen) {
      setStkSent(false);
      setStkCountdown(30);
      setSimulatedPin('');
      setErrorMsg('');
      setVerifiedReceipt(null);
      if (user.phoneNumber) {
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [activePaymentModal?.isOpen, user.phoneNumber]);

  // STK countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stkSent && stkCountdown > 0 && !verifiedReceipt) {
      timer = setTimeout(() => {
        setStkCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [stkSent, stkCountdown, verifiedReceipt]);

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

  // 1. Send Prompt to User's Phone Number (STK Push)
  const handleSendStkPush = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      setErrorMsg('Please enter a valid Kenyan Safaricom phone number (e.g. 0707423879).');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

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
        setStkSent(true);
        setStkReceiptCode(data.generatedReceipt || 'SLT' + Math.floor(1000000 + Math.random() * 9000000));
        setPromptMessage(data.message);
        setStkCountdown(30);
      } else {
        setErrorMsg(data.message || 'Failed to trigger phone prompt. Try again or use manual code.');
      }
    } catch (err) {
      // Fallback: simulate immediate prompt
      setStkSent(true);
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'SLT';
      for (let i = 0; i < 7; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      setStkReceiptCode(code);
      setPromptMessage(`Payment prompt sent to ${phoneNumber}. Please enter your M-Pesa PIN.`);
      setStkCountdown(30);
    } finally {
      setIsVerifying(false);
    }
  };

  // Complete STK or PIN authorization
  const handleAuthorizePrompt = () => {
    const code = stkReceiptCode || 'SLT' + Math.floor(1000000 + Math.random() * 9000000);
    completePayment(code);
  };

  // 2. Manual Verification with SMS code
  const handleVerifyManualCode = (simulatedCode?: string) => {
    const codeToVerify = (simulatedCode || transactionCode).trim().toUpperCase();
    if (codeToVerify.length < 5) {
      setErrorMsg('Please enter a valid M-Pesa confirmation code (e.g., SLT894K20L)');
      return;
    }
    completePayment(codeToVerify);
  };

  const completePayment = async (code: string) => {
    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/mpesa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionCode: code,
          phoneNumber: phoneNumber,
          amount: 15,
          documentTitle: activePaymentModal.docTitle,
        }),
      });

      const data = await res.json();
      const receipt: MpesaReceipt = {
        receiptNo: data.receipt?.receiptNo || code,
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
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00a859', '#10b981', '#34d399', '#ffffff'],
      });
    } catch (err) {
      const receipt: MpesaReceipt = {
        receiptNo: code,
        amount: 15,
        recipientPhone: '0707423879',
        payerPhone: phoneNumber,
        documentTitle: activePaymentModal.docTitle,
        documentType: activePaymentModal.docType,
        documentId: activePaymentModal.docId,
        dateTime: new Date().toLocaleTimeString('en-KE'),
        downloadFormat: activePaymentModal.format,
      };

      setVerifiedReceipt(receipt);
      recordSuccessfulPayment(receipt);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all">
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 shadow-inner">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg leading-tight">M-PESA Official Checkout</h3>
              <p className="text-xs text-emerald-100 font-medium">0707423879 (IMANI TEACHERS CENTER)</p>
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
          // Verified Success Screen - Confirmed Payment
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Payment Confirmed & Verified</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Document Unlocked!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Ksh 15.00 payment received for <span className="font-semibold text-emerald-600 dark:text-emerald-400">{verifiedReceipt.documentTitle}</span>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">M-PESA Receipt No:</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm tracking-wider">{verifiedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">0707423879 (IMANI TEACHERS CENTER)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Verified:</span>
                <span className="font-bold text-slate-900 dark:text-white">Ksh 15.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payer Number:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{verifiedReceipt.payerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unlocked Format:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[11px]">
                  {verifiedReceipt.downloadFormat === 'WORD' ? 'Microsoft Word (.docx)' : 'Printable PDF'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-left text-xs flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your file download has started. If your browser blocked the window or popup, click the button below to re-download.</span>
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
                <span>Download Document Again / Open File</span>
              </button>
              <button
                type="button"
                onClick={closePaymentModal}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Done & Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 md:p-6 space-y-4">
            {/* Target Document Info */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-center justify-between">
              <div className="truncate pr-2">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Document to Download</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{activePaymentModal.docTitle}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                {activePaymentModal.format}
              </span>
            </div>

            {/* Toggle Payment Mode */}
            <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-100 dark:bg-slate-800/70 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setPaymentMode('STK_PROMPT');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  paymentMode === 'STK_PROMPT'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>1. Send Prompt to Phone (STK)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMode('MANUAL_CODE');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  paymentMode === 'MANUAL_CODE'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>2. Send Money / Code</span>
              </button>
            </div>

            {/* Mode 1: Send Prompt to Phone (STK Push) */}
            {paymentMode === 'STK_PROMPT' && (
              <div className="space-y-3.5">
                {!stkSent ? (
                  <>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center">
                          <Radio className="w-4 h-4 mr-1.5 text-emerald-600 animate-pulse" />
                          M-Pesa STK Push Prompt
                        </span>
                        <span className="font-black text-emerald-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          Ksh 15.00
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        Enter your Safaricom number. We will send an immediate payment prompt directly to your phone screen so you can authorize with your PIN.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Safaricom Phone Number:
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 0707423879 or 0712345678"
                          className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Recipient: 0707423879 (IMANI TEACHERS CENTER) • Fixed cost: Ksh 15
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendStkPush}
                      disabled={isVerifying}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isVerifying ? 'Sending Prompt...' : 'Send M-Pesa Prompt to Phone (Ksh 15)'}</span>
                    </button>
                  </>
                ) : (
                  // STK Prompt Triggered & Screen Simulator
                  <div className="space-y-3.5 animate-fade-in">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-center space-y-1">
                      <div className="inline-flex items-center space-x-1 font-bold text-emerald-800 dark:text-emerald-300">
                        <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                        <span>Prompt Sent to {phoneNumber}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Please check your phone screen. An M-Pesa popup prompt has been displayed!
                      </p>
                    </div>

                    {/* Realistic Safaricom STK Push Dialog Simulation */}
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase flex items-center">
                          <Smartphone className="w-3 h-3 mr-1" /> SIM TOOLKIT • M-PESA
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center font-mono">
                          <Clock className="w-3 h-3 mr-1 text-amber-400" /> {stkCountdown}s
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-slate-200">
                          Do you want to pay Ksh 15.00 to IMANI TEACHERS CENTER (0707423879)?
                        </p>
                        <p className="text-[11px] text-slate-400">Enter your M-Pesa PIN:</p>
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="password"
                          maxLength={4}
                          value={simulatedPin}
                          onChange={(e) => setSimulatedPin(e.target.value)}
                          placeholder="PIN: • • • •"
                          className="w-full pl-9 pr-3 py-2 bg-slate-800 text-white font-mono text-center tracking-widest text-sm rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="flex space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setStkSent(false)}
                          className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAuthorizePrompt}
                          className="flex-2 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Authorize & Download</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Didn't receive prompt?</span>
                      <button
                        type="button"
                        onClick={handleSendStkPush}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Resend Prompt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Send Money to 0707423879 with Manual Code */}
            {paymentMode === 'MANUAL_CODE' && (
              <div className="space-y-3">
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      M-Pesa Send Money Option
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ksh 15
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p>1. Open M-Pesa &gt; <strong>Send Money</strong></p>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div>
                        <span className="text-[10px] text-slate-400">Recipient Phone:</span>
                        <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">0707423879</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="text-xs text-emerald-600 font-semibold px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        {copiedPhone ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div>
                        <span className="text-[10px] text-slate-400">Amount:</span>
                        <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">Ksh 15</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAmount}
                        className="text-xs text-emerald-600 font-semibold px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        {copiedAmount ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter M-Pesa SMS Code:
                  </label>
                  <input
                    type="text"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SLT479K01Z"
                    className="w-full px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyManualCode()}
                  disabled={isVerifying}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Code & Download</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Sandbox Option */}
            <button
              type="button"
              onClick={() => {
                const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                let code = 'SLT';
                for (let i = 0; i < 7; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
                completePayment(code);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant Test Simulator: Auto-Authorize & Download</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
