import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason') || 'Payment was not completed';

  return (
    <>
      <SEO 
        title="Payment Failed - Y7 Sauces"
        description="Payment could not be processed. Please try again or contact support."
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Failed Icon */}
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <XCircle className="w-12 h-12 text-white" />
            </div>

            {/* Failed Message */}
            <div>
              <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
              <p className="text-xl text-gray-300 mb-8">
                We couldn't process your payment. Don't worry, no amount has been charged.
              </p>
            </div>

            {/* Error Details */}
            <div>
              <Card className="bg-gray-900 border-red-800 mb-8">
                <CardContent className="p-6">
                  <div className="text-left">
                    <h3 className="font-semibold mb-4 text-red-400">Payment Details</h3>
                    <div className="space-y-2 text-sm">
                      {orderId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order ID:</span>
                          <span className="font-mono">{orderId}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reason:</span>
                        <span className="text-red-400">{reason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-red-400">Failed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Common Reasons */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Common reasons for payment failure:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Insufficient balance in your account</li>
                <li>• Incorrect card details or expired card</li>
                <li>• Network connectivity issues</li>
                <li>• Bank server temporarily unavailable</li>
                <li>• Transaction limit exceeded</li>
                <li>• Payment cancelled by user</li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">What can you do?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium">Try Again</p>
                  <p className="text-gray-400">Retry the payment with same or different method</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium">Check Details</p>
                  <p className="text-gray-400">Verify your card details and try again</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <HelpCircle className="w-6 h-6 text-black" />
                  </div>
                  <p className="font-medium">Contact Support</p>
                  <p className="text-gray-400">Get help from our customer support team</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/cart">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Payment Again
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/contact">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link to="/shop">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">
                💡 <strong>Tip:</strong> If you continue to face issues, try using a different payment method 
                or contact your bank to ensure online transactions are enabled.
              </p>
            </div>

            {/* Support Contact */}
            <p className="text-sm text-gray-400 mt-6">
              Need immediate help? Call us at <span className="text-yellow-500">+91-XXXXXXXXXX</span> or 
              email <span className="text-yellow-500">support@y7foods.com</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}