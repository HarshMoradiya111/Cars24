import React from "react";
import Head from "next/head";

const PrivacyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - CARS24</title>
        <meta name="description" content="Learn how CARS24 collects, uses, and protects your personal information." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-orange-500">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-600">Last updated: February 17, 2026</p>

        <div className="mt-8 space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Introduction</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              At CARS24, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              platform, services, and mobile applications.
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  <li>Name, email address, phone number, and contact details</li>
                  <li>Government-issued ID and driver's license information</li>
                  <li>Payment and financial information</li>
                  <li>Vehicle information including registration details</li>
                  <li>Location data when you use our services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and error reports</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and send related information</li>
              <li>To verify your identity and prevent fraud</li>
              <li>To communicate with you about services, updates, and promotional offers</li>
              <li>To personalize your experience and provide relevant content</li>
              <li>To conduct research and analytics to improve our platform</li>
              <li>To comply with legal obligations and enforce our terms</li>
              <li>To provide customer support and respond to your inquiries</li>
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information Sharing and Disclosure</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>We may share your information with:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business</li>
                <li><strong>Business Partners:</strong> Financial institutions, insurance companies, and inspection services</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>With Your Consent:</strong> When you authorize us to share your information</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Security</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure servers and data centers</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Privacy Rights</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Restrict or object to certain processing of your data</li>
              <li>Data portability to transfer your information</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              To exercise these rights, please contact us at <a href="mailto:privacy@cars24.com" className="text-blue-600 hover:underline">privacy@cars24.com</a>
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies and Tracking Technologies</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              We use cookies and similar technologies to enhance your experience. You can control cookies through your 
              browser settings, but disabling them may affect functionality.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-700"><strong>Essential Cookies:</strong> Required for basic site functionality</p>
              <p className="text-sm text-gray-700"><strong>Analytics Cookies:</strong> Help us understand how you use our site</p>
              <p className="text-sm text-gray-700"><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</p>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Children's Privacy</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">International Data Transfers</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your information in accordance with applicable 
              data protection laws.
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Retention</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required or permitted by law. We will securely delete 
              or anonymize your information when it is no longer needed.
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Privacy Policy</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this 
              Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <div className="text-sm text-gray-700 text-left">
                <strong>Email:</strong> <a href="mailto:privacy@cars24.com" className="text-blue-600 hover:underline">privacy@cars24.com</a>
              </div>
              <div className="text-sm text-gray-700 text-left">
                <strong>Phone:</strong> <a href="tel:1800-123-4567" className="text-blue-600 hover:underline">1800-123-4567</a>
              </div>
              <div className="text-sm text-gray-700 text-left">
                <strong>Address:</strong> CARS24 Services Pvt. Ltd., Gurugram, Haryana, India
              </div>
            </div>
          </section>

          <section className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-blue-900 mb-3">📌 Key Points Summary</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-blue-900">
              <li>We collect information to provide and improve our services</li>
              <li>Your data is protected with industry-standard security measures</li>
              <li>We do not sell your personal information for marketing purposes</li>
              <li>You have rights to access, correct, and delete your information</li>
              <li>You can opt-out of marketing communications at any time</li>
              <li>We use cookies to enhance your experience</li>
              <li>Contact us anytime with privacy concerns</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default PrivacyPage;
