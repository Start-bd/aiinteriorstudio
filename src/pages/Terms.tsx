import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Interior of AI</title>
        <meta
          name="description"
          content="Terms of Service for Interior of AI - AI-powered interior design platform by AvailableView LLC."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Terms of <span className="text-gradient-gold">Service</span>
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: January 15, 2025
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  1. Agreement to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and AvailableView LLC ("Company," "we," "us," or "our"), governing your access to and use of the Interior of AI platform, including our website at interiorofai.com and all related services, features, and content (collectively, the "Service").
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Interior of AI is an artificial intelligence-powered interior design platform that enables users to generate, visualize, and transform interior design concepts. The Service includes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  <li>AI-powered room design generation</li>
                  <li>Before and after room transformations</li>
                  <li>Design style applications and customization</li>
                  <li>Image gallery and collection features</li>
                  <li>User account management and profiles</li>
                  <li>Credit-based usage system</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  3. User Accounts
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security and confidentiality of your login credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You must be at least 18 years old to create an account and use the Service. By creating an account, you represent and warrant that you meet this age requirement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  4. Credits and Payments
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service operates on a credit-based system. Credits are required to generate AI-powered designs and may be purchased through our platform. By purchasing credits, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  <li>Pay all applicable fees and charges</li>
                  <li>Provide valid payment information</li>
                  <li>Authorize us to charge your payment method</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Credits are non-refundable except as required by applicable law. Unused credits do not expire unless your account is terminated. We reserve the right to modify pricing and credit packages at any time with notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  5. Subscription Services
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer subscription plans that provide recurring credits and additional features. Subscriptions automatically renew unless cancelled before the renewal date. You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  6. Intellectual Property Rights
                </h2>
                <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
                  Our Intellectual Property
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Service, including its original content, features, functionality, and underlying technology, is owned by AvailableView LLC and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. "Interior of AI" is a registered trademark of AvailableView LLC.
                </p>
                <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
                  Your Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of any images you upload to the Service. By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your content solely for the purpose of providing and improving the Service.
                </p>
                <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
                  Generated Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Subject to your compliance with these Terms and payment of applicable fees, you are granted a license to use AI-generated images created through your use of the Service for personal and commercial purposes. We retain the right to use anonymized generated content to improve our AI models and Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  7. Acceptable Use Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
                  <li>Upload content that infringes intellectual property rights</li>
                  <li>Generate illegal, harmful, or offensive content</li>
                  <li>Attempt to reverse engineer or extract our AI models</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Interfere with or disrupt the Service or its infrastructure</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Collect or harvest user data without consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  8. Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not warrant that the Service will be uninterrupted, secure, or error-free, that defects will be corrected, or that the AI-generated results will meet your specific requirements or expectations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, AVAILABLEVIEW LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  OUR TOTAL LIABILITY FOR ALL CLAIMS RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  10. Indemnification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless AvailableView LLC and its officers, directors, employees, contractors, agents, and affiliates from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  11. Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  12. Governing Law and Dispute Resolution
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in Sheridan County, Wyoming, in accordance with the rules of the American Arbitration Association.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  13. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of the Service after such changes constitutes your acceptance of the revised Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  14. Severability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  15. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-secondary/50 rounded-xl border border-border">
                  <p className="text-foreground font-semibold">AvailableView LLC</p>
                  <p className="text-muted-foreground mt-2">30 N Gould St STE R</p>
                  <p className="text-muted-foreground">Sheridan, WY 82801, USA</p>
                  <p className="text-muted-foreground mt-2">
                    Email:{" "}
                    <a
                      href="mailto:legal@interiorofai.com"
                      className="text-primary hover:underline"
                    >
                      legal@interiorofai.com
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    Support:{" "}
                    <a
                      href="mailto:support@interiorofai.com"
                      className="text-primary hover:underline"
                    >
                      support@interiorofai.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Terms;
