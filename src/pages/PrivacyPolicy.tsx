import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Interior of AI</title>
        <meta name="description" content="Privacy Policy for Interior of AI - Learn how we collect, use, and protect your personal information." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 15, 2026</p>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                AvailableView LLC ("we," "our," or "us") operates Interior of AI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered interior design platform. We are committed to protecting your privacy and complying with applicable data protection laws, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password, and profile details when you create an account</li>
                <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely through Stripe)</li>
                <li><strong>User Content:</strong> Images you upload for AI processing and design preferences</li>
                <li><strong>Communications:</strong> Messages you send through our contact forms or support channels</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, click patterns</li>
                <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and improve our AI interior design services</li>
                <li>Process transactions and manage your account</li>
                <li>Send service-related communications and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR)</h2>
              <p className="text-muted-foreground mb-4">For users in the European Economic Area, we process your data based on:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Contract Performance:</strong> To provide services you've requested</li>
                <li><strong>Legitimate Interests:</strong> To improve our services and prevent fraud</li>
                <li><strong>Legal Compliance:</strong> To meet our legal obligations</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights Under GDPR</h2>
              <p className="text-muted-foreground mb-4">If you are in the EEA, you have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Restrict Processing:</strong> Request limitation of processing</li>
                <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at privacy@interiorofai.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights Under CCPA</h2>
              <p className="text-muted-foreground mb-4">If you are a California resident, you have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Know:</strong> What personal information we collect, use, and disclose</li>
                <li><strong>Delete:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Opt out of the sale of personal information (we do not sell personal information)</li>
                <li><strong>Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To submit a CCPA request, email us at privacy@interiorofai.com or call (307) 555-0100.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Service Providers:</strong> Third parties that help us operate our platform (payment processors, cloud hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. When we transfer data outside the EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information, including encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. When you delete your account, we will delete or anonymize your data within 30 days, except where we are required to retain it for legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, contact us:
              </p>
              <div className="text-muted-foreground space-y-1">
                <p><strong>AvailableView LLC</strong></p>
                <p>30 N Gould St STE R</p>
                <p>Sheridan, WY 82801</p>
                <p>Email: privacy@interiorofai.com</p>
                <p>Support: support@interiorofai.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Data Protection Officer</h2>
              <p className="text-muted-foreground leading-relaxed">
                For GDPR-related inquiries, you may contact our Data Protection Officer at dpo@interiorofai.com.
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
