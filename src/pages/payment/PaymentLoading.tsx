import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { paymentAPI } from '@/lib/api';
import SEO from '@/components/SEO';

export default function PaymentLoading() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!orderId) {
      navigate('/cart');
      return;
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        // Wait a bit to show loading animation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const response = await paymentAPI.getStatus(orderId);
        const paymentStatus = response.data.data.status;
        
        setProgress(100);
        
        setTimeout(() => {
          if (paymentStatus === 'success' || paymentStatus === 'paid') {
            setStatus('success');
            navigate(`/payment/success?orderId=${orderId}`);
          } else {
            setStatus('failed');
            navigate(`/payment/failed?orderId=${orderId}&reason=Payment verification failed`);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Payment status check error:', error);
        setProgress(100);
        setTimeout(() => {
          setStatus('failed');
          navigate(`/payment/failed?orderId=${orderId}&reason=Unable to verify payment status`);
        }, 1000);
      }
    };

    checkPaymentStatus();

    return () => {
      clearInterval(progressInterval);
    };
  }, [orderId, navigate]);

  return (
    <>
      <SEO 
        title="Processing Payment - Y7 Sauces"
        description="Please wait while we process your payment securely."
      />
      
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8">
                {/* Loading Animation */}
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="animate-spin">
                    <Loader2 className="w-10 h-10 text-black" />
                  </div>
                </div>

                {/* Status Message */}
                <div>
                  <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
                  <p className="text-gray-400 mb-6">
                    Please wait while we securely process your payment...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{progress}% Complete</p>
                </div>

                {/* Order Info */}
                {orderId && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono text-sm">{orderId}</p>
                  </div>
                )}

                {/* Security Features */}
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-green-500" />
                    <p>Secure</p>
                  </div>
                  <div className="text-center">
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <p>Encrypted</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                    <p>Fast</p>
                  </div>
                </div>

                {/* Loading Messages */}
                <div className="mt-6">
                  <div className="space-y-2 text-sm text-gray-400">
                    <p className={progress >= 30 ? 'text-white' : 'opacity-30'}>
                      ✓ Validating payment details...
                    </p>
                    <p className={progress >= 60 ? 'text-white' : 'opacity-30'}>
                      ✓ Processing transaction...
                    </p>
                    <p className={progress >= 90 ? 'text-white' : 'opacity-30'}>
                      ✓ Confirming payment...
                    </p>
                  </div>
                </div>

                {/* Warning */}
                <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-400">
                    ⚠️ Please do not close this window or press the back button while we process your payment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 mt-4">
              This usually takes 10-30 seconds. If it takes longer, please contact support.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}