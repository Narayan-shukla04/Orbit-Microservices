import { useNavigate } from "react-router-dom"

export default function PrivacyPage() {
  const navigate = useNavigate()
  const updated  = "17 October 2026"

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-base font-bold tracking-tight text-on-surface hover:opacity-80 transition-opacity">Orbit</button>
          <a href="/terms" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Terms of Service</a>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-on-surface-variant mb-10">Last updated: {updated}</p>

          <div className="flex flex-col gap-8 text-on-surface-variant leading-relaxed text-sm">

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">1. Who we are</h2>
              <p>Orbit Platform operates the Orbit community platform, accessible at this domain and via desktop and mobile clients. References to "we", "us", or "our" in this policy refer to Orbit Platform.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">2. What we collect</h2>
              <p className="mb-2">We collect only what is necessary to operate the service:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong className="text-on-surface">Account data</strong> — username, email address, and hashed password on registration.</li>
                <li><strong className="text-on-surface">Content you send</strong> — messages, uploaded files, and voice session metadata (participant list, duration). Voice audio is not stored.</li>
                <li><strong className="text-on-surface">Technical data</strong> — IP address at login, browser user-agent string, and approximate region for edge routing. This data is kept for 30 days.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">3. What we do not collect</h2>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>We do not run behavioural advertising or sell data to third parties.</li>
                <li>We do not track your activity across other websites.</li>
                <li>We do not use third-party analytics services that fingerprint or profile individual users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">4. How we use your data</h2>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>To authenticate you and maintain your session.</li>
                <li>To deliver messages and files between users on the platform.</li>
                <li>To route voice and video traffic to the nearest edge node.</li>
                <li>To investigate abuse reports and enforce our Terms of Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">5. Data retention</h2>
              <p>Your account data and message history are retained until you delete your account. You can delete your account from Settings. Upon deletion, your data is removed from active databases within 30 days and from backups within 90 days.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">6. Encryption</h2>
              <p>All data in transit is encrypted via TLS 1.3. End-to-end encrypted channels encrypt message content such that only the participating members can read it. Orbit does not hold decryption keys for E2E-encrypted channels.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">7. Third-party services</h2>
              <p>We use the following sub-processors to operate the service: cloud infrastructure providers for hosting and storage, and SMTP providers for transactional email (such as password reset). We require all sub-processors to meet equivalent data protection standards.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">8. Your rights</h2>
              <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Request a copy of the data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data.</li>
                <li>Object to or restrict processing.</li>
                <li>Data portability.</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, email us at the address below.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">9. Cookies</h2>
              <p>We use a single session cookie to keep you logged in. We do not use advertising cookies or third-party tracking cookies.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">10. Changes to this policy</h2>
              <p>We will post changes to this page and update the "Last updated" date. For material changes, we will notify users via the platform or email.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">11. Contact</h2>
              <p>For privacy questions or data requests, contact us at <a href="mailto:privacy@orbit.app" className="text-primary hover:underline">privacy@orbit.app</a>.</p>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}
