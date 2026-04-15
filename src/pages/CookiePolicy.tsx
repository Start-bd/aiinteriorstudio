import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Interior of AI</title>
        <meta name="description" content="Cookie Policy for Interior of AI - Learn about our use of cookies and how to manage your preferences." />
        <link rel="canonical" href="https://interiorofai.com/cookies" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 15, 2026</p>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences and improve your browsing experience. This Cookie Policy explains how AvailableView LLC ("we," "our," or "us") uses cookies and similar technologies on Interior of AI.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium mb-3">2.1 Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are necessary for the website to function properly. They enable core features like security, account access, and payment processing.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-foreground">Cookie Name</th>
                      <th className="text-left py-2 text-foreground">Purpose</th>
                      <th className="text-left py-2 text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">sb-access-token</td>
                      <td className="py-2">Authentication session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">sb-refresh-token</td>
                      <td className="py-2">Session refresh</td>
                      <td className="py-2">7 days</td>
                    </tr>
                    <tr>
                      <td className="py-2">cookie-consent</td>
                      <td className="py-2">Stores your cookie preferences</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3">2.2 Performance Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies collect information about how you use our website, such as which pages you visit most often. This data helps us improve our platform's performance.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-foreground">Cookie Name</th>
                      <th className="text-left py-2 text-foreground">Purpose</th>
                      <th className="text-left py-2 text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">_ga</td>
                      <td className="py-2">Google Analytics - User identification</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2">_gid</td>
                      <td className="py-2">Google Analytics - Session tracking</td>
                      <td className="py-2">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3">2.3 Functional Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies remember your preferences to provide enhanced, personalized features.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-foreground">Cookie Name</th>
                      <th className="text-left py-2 text-foreground">Purpose</th>
                      <th className="text-left py-2 text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">language</td>
                      <td className="py-2">Stores language preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-2">theme</td>
                      <td className="py-2">Stores dark/light mode preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3">2.4 Marketing Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies track your online activity to help advertisers deliver more relevant ads. We only use these with your explicit consent.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-foreground">Cookie Name</th>
                      <th className="text-left py-2 text-foreground">Purpose</th>
                      <th className="text-left py-2 text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">_fbp</td>
                      <td className="py-2">Facebook Pixel</td>
                      <td className="py-2">3 months</td>
                    </tr>
                    <tr>
                      <td className="py-2">_gcl_au</td>
                      <td className="py-2">Google Ads conversion tracking</td>
                      <td className="py-2">3 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use services from third parties that may set their own cookies:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Facebook:</strong> For social media integration and advertising</li>
                <li><strong>Google Ads:</strong> For advertising and conversion tracking</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These third parties have their own privacy policies governing how they use your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-medium mb-3">4.1 Cookie Consent Banner</h3>
              <p className="text-muted-foreground mb-4">
                When you first visit our website, you'll see a cookie consent banner where you can choose which types of cookies to accept. You can change your preferences at any time by clicking the "Cookie Settings" link in our website footer.
              </p>

              <h3 className="text-xl font-medium mb-3">4.2 Browser Settings</h3>
              <p className="text-muted-foreground mb-4">
                Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">4.3 Opt-Out Links</h3>
              <p className="text-muted-foreground mb-4">
                You can opt out of specific third-party cookies:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
                <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you choose to disable cookies, some features of our website may not function properly. Essential cookies cannot be disabled as they are necessary for the website to work. Disabling performance and marketing cookies will not affect core functionality but may limit personalized features and relevant advertising.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Do Not Track Signals</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some browsers have a "Do Not Track" feature that signals to websites that you do not want your online activities tracked. We currently respond to Do Not Track signals by disabling non-essential cookies when detected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on this page with a new "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="text-muted-foreground space-y-1">
                <p><strong>AvailableView LLC</strong></p>
                <p>30 N Gould St STE R</p>
                <p>Sheridan, WY 82801</p>
                <p>Email: privacy@interiorofai.com</p>
                <p>Support: support@interiorofai.com</p>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CookiePolicy;
