import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy | Interior of AI</title>
        <meta name="description" content="Refund Policy for Interior of AI - Clear terms for credit purchases and subscription refunds." />
        <link rel="canonical" href="https://interiorofai.com/refund" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 15, 2026</p>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 text-primary">30-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground">
                We stand behind our service. If you're not satisfied with your subscription within the first 30 days, we'll provide a full refund—no questions asked.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                AvailableView LLC ("we," "our," or "us") wants you to be completely satisfied with Interior of AI. This Refund Policy outlines the terms and conditions for refunds on credit purchases and subscription plans. By making a purchase, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Subscription Refunds</h2>
              
              <h3 className="text-xl font-medium mb-3">2.1 New Subscriptions - 30-Day Guarantee</h3>
              <p className="text-muted-foreground mb-4">
                If you subscribe to a paid plan (Pro or Enterprise) and are not satisfied, you may request a full refund within 30 days of your initial subscription date. This applies to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>First-time subscribers only</li>
                <li>The first billing period of any subscription tier</li>
                <li>Users who have used fewer than 50% of their monthly credits</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">2.2 Subscription Renewals</h3>
              <p className="text-muted-foreground mb-4">
                For subscription renewals (second month and beyond):
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Refunds are generally not available for renewed subscriptions</li>
                <li>You may cancel at any time to prevent future charges</li>
                <li>Cancelled subscriptions remain active until the end of the current billing period</li>
                <li>Prorated refunds may be considered in exceptional circumstances at our discretion</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">2.3 Annual Subscriptions</h3>
              <p className="text-muted-foreground mb-4">
                For annual subscription plans:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Full refund available within 30 days of initial purchase</li>
                <li>After 30 days, prorated refunds may be available for the unused portion</li>
                <li>Prorated refunds are calculated based on remaining full months</li>
                <li>Any promotional discounts will be deducted from refund calculations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Credit Pack Refunds</h2>
              
              <h3 className="text-xl font-medium mb-3">3.1 Unused Credits</h3>
              <p className="text-muted-foreground mb-4">
                For one-time credit pack purchases:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Full refund available within 14 days if no credits have been used</li>
                <li>Partial refund available if less than 20% of credits have been used</li>
                <li>No refunds available if 20% or more credits have been used</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">3.2 Promotional Credits</h3>
              <p className="text-muted-foreground">
                Bonus credits received through promotions, referrals, or free trials are non-refundable and have no cash value. When requesting a refund, promotional credits will be deducted first from any used amount.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Non-Refundable Items</h2>
              <p className="text-muted-foreground mb-4">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Credits that have been used to generate designs</li>
                <li>Free credits or promotional bonuses</li>
                <li>Subscriptions cancelled after the refund window</li>
                <li>Accounts terminated for Terms of Service violations</li>
                <li>Purchases made more than 30 days ago (for subscriptions) or 14 days ago (for credit packs)</li>
                <li>Enterprise custom plans (subject to individual contract terms)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
              
              <h3 className="text-xl font-medium mb-3">5.1 Refund Process</h3>
              <p className="text-muted-foreground mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Email us at support@interiorofai.com with subject line "Refund Request"</li>
                <li>Include your account email address and order/transaction ID</li>
                <li>Provide a brief reason for your refund request</li>
                <li>Our team will review your request within 2-3 business days</li>
              </ol>

              <h3 className="text-xl font-medium mb-3 mt-6">5.2 Required Information</h3>
              <p className="text-muted-foreground mb-4">
                Please include in your refund request:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Email address associated with your account</li>
                <li>Date of purchase</li>
                <li>Payment method used (last 4 digits of card if applicable)</li>
                <li>Order confirmation number or transaction ID</li>
                <li>Reason for refund request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Refund Processing</h2>
              
              <h3 className="text-xl font-medium mb-3">6.1 Timeline</h3>
              <p className="text-muted-foreground mb-4">
                Once approved, refunds are processed as follows:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Credit/Debit Cards: 5-10 business days</li>
                <li>PayPal: 3-5 business days</li>
                <li>Bank transfers: 7-14 business days</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Processing times may vary depending on your financial institution.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6">6.2 Refund Method</h3>
              <p className="text-muted-foreground">
                Refunds are issued to the original payment method used for the purchase. We cannot process refunds to a different payment method or account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Account Status After Refund</h2>
              <p className="text-muted-foreground mb-4">
                After a refund is processed:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Your subscription will be cancelled immediately</li>
                <li>Any remaining credits from the refunded purchase will be removed</li>
                <li>Your account will revert to the Free tier</li>
                <li>Previously generated designs will remain accessible</li>
                <li>You may repurchase a subscription at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Chargebacks</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you file a chargeback with your bank or credit card company before contacting us, we reserve the right to suspend your account pending investigation. We encourage you to contact our support team first, as we are committed to resolving issues fairly and quickly. Fraudulent chargebacks may result in permanent account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Technical Issues</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you experience technical issues that prevent you from using the service, please contact our support team. We will work to resolve the issue and may offer credits, extended service time, or refunds on a case-by-case basis for legitimate technical failures on our end.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting. Your continued use of our services after changes constitutes acceptance of the updated policy. We will notify users of significant changes via email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For refund requests or questions about this policy:
              </p>
              <div className="text-muted-foreground space-y-1">
                <p><strong>AvailableView LLC</strong></p>
                <p>30 N Gould St STE R</p>
                <p>Sheridan, WY 82801</p>
                <p>Email: support@interiorofai.com</p>
                <p>Billing inquiries: billing@interiorofai.com</p>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default RefundPolicy;
