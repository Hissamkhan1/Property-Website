import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, CheckCircle, X } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { PaymentMethod } from '../../types/Payment';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  amount: number;
}

export default function PaymentModal({ open, onClose, propertyId, propertyTitle, amount }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('easypaisa');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    easypaisaNumber: '',
    bankAccountNumber: '',
    bankName: '',
    accountHolderName: '',
    transactionReference: ''
  });

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'easypaisa') {
        await paymentService.createEasyPaisaPayment({
          amount: amount,
          phoneNumber: formData.easypaisaNumber,
          description: `Payment for ${propertyTitle}`,
          propertyId: propertyId,
          propertyTitle: propertyTitle,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail
        });
      } else if (paymentMethod === 'bank_transfer') {
        await paymentService.createBankTransferPayment({
          amount: amount,
          accountNumber: formData.bankAccountNumber,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
          propertyId: propertyId,
          propertyTitle: propertyTitle,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          transactionReference: formData.transactionReference
        });
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          easypaisaNumber: '',
          bankAccountNumber: '',
          bankName: '',
          accountHolderName: '',
          transactionReference: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h3>
          <p className="text-gray-600 mb-4">
            Your payment request has been submitted successfully. We'll contact you shortly to confirm the payment.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>Amount:</strong> PKr {amount.toLocaleString()}<br />
              <strong>Property:</strong> {propertyTitle}<br />
              <strong>Method:</strong> {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Make Payment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Property:</strong> {propertyTitle}<br />
              <strong>Amount:</strong> PKr {amount.toLocaleString()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  paymentMethod === 'easypaisa'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="h-8 w-8 text-blue-600 mb-2" />
                <div className="font-semibold text-gray-900">EasyPaisa</div>
                <div className="text-sm text-gray-600">Mobile Payment</div>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building className="h-8 w-8 text-green-600 mb-2" />
                <div className="font-semibold text-gray-900">Bank Transfer</div>
                <div className="text-sm text-gray-600">Direct Transfer</div>
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="customerPhone"
                required
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Payment Method Specific Fields */}
          {paymentMethod === 'easypaisa' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">EasyPaisa Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EasyPaisa Number *</label>
                <input
                  type="tel"
                  name="easypaisaNumber"
                  required
                  value={formData.easypaisaNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="03XXXXXXXXX"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the EasyPaisa number you'll use for payment
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Bank Transfer Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    required
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., HBL, UBL, MCB"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    required
                    value={formData.bankAccountNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter account number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  name="accountHolderName"
                  required
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Name on the bank account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference (Optional)</label>
                <input
                  type="text"
                  name="transactionReference"
                  value={formData.transactionReference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bank transaction reference number"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : `Submit ${paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer'} Payment`}
            </button>
          </div>

          {/* Payment Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Payment Instructions:</h4>
            {paymentMethod === 'easypaisa' ? (
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Submit this form to initiate payment</li>
                <li>• You'll receive payment instructions via SMS/email</li>
                <li>• Complete the payment using your EasyPaisa app</li>
                <li>• Payment will be verified within 24 hours</li>
              </ul>
            ) : (
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Submit this form to get bank account details</li>
                <li>• Transfer the amount to the provided account</li>
                <li>• Include your name in the transfer description</li>
                <li>• Payment will be verified within 24-48 hours</li>
              </ul>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
