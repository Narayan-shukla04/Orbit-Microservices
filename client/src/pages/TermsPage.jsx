import { useNavigate } from "react-router-dom"

export default function TermsPage() {
  const navigate = useNavigate()
  const updated  = "17 October 2026"

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-outline-variant">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-base font-bold tracking-tight text-on-surface hover:opacity-80 transition-opacity">Orbit</button>
          <a href="/privacy" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Privacy Policy</a>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Terms of Service</h1>
          <p className="text-sm text-on-surface-variant mb-10">Last updated: {updated}</p>

          <div className="flex flex-col gap-8 text-on-surface-variant leading-relaxed text-sm">

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">1. Acceptance</h2>
              <p>By creating an Orbit account or using the Orbit service, you agree to be bound by these Terms. If you do not agree, do not use the service.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">2. Eligibility</h2>
              <p>You must be at least 13 years old to use Orbit. If you are between 13 and 18, you confirm that you have parental or guardian consent. By using the service you represent that you meet these requirements.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">3. Your account</h2>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>You are responsible for keeping your login credentials secure.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
                <li>You must notify us immediately if you suspect unauthorised access.</li>
                <li>One person may not operate multiple accounts to circumvent bans or restrictions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">4. Acceptable use</h2>
              <p className="mb-2">You agree not to use Orbit to:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Harass, threaten, or harm other users.</li>
                <li>Distribute malware, spam, or unsolicited advertisements.</li>
                <li>Upload content that violates applicable law, including copyright infringement.</li>
                <li>Distribute child sexual abuse material (CSAM) or any illegal content involving minors.</li>
                <li>Attempt to gain unauthorised access to any part of the service or another user's account.</li>
                <li>Scrape, reverse-engineer, or extract data from the service in ways not permitted by these Terms or our API documentation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">5. Content you post</h2>
              <p>You retain ownership of content you upload or transmit via Orbit. By posting content, you grant Orbit a limited, non-exclusive licence to store, transmit, and display that content solely to operate the service. We do not claim ownership of your content and will not sell it to third parties.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">6. Server and channel rules</h2>
              <p>Server owners are responsible for enforcing rules within their servers in a manner consistent with these Terms. Orbit may take action — including suspending servers or accounts — where content violates these Terms, regardless of server-level permissions.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">7. Paid plans</h2>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Subscriptions are billed monthly or annually in advance.</li>
                <li>You may cancel at any time; your plan remains active until the end of the billing period.</li>
                <li>We do not offer prorated refunds for mid-period cancellations, except where required by law.</li>
                <li>We reserve the right to change pricing with 30 days' notice to active subscribers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">8. Termination</h2>
              <p>You may delete your account at any time from Settings. We may suspend or terminate your account if you violate these Terms, with or without prior notice depending on severity. Upon termination, your data is deleted as described in our Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">9. Availability and warranty disclaimer</h2>
              <p>We aim to keep Orbit available and reliable, but we do not guarantee uninterrupted access. The service is provided "as is" without warranties of any kind, express or implied. We do not warrant that the service will be error-free or meet any specific performance standard.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">10. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, Orbit Platform will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service. Our total liability for any claim will not exceed the amount you paid us in the 12 months prior to the claim.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">11. Governing law</h2>
              <p>These Terms are governed by the laws of the jurisdiction in which Orbit Platform is incorporated. Disputes will be resolved in the courts of that jurisdiction, unless local law requires otherwise.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">12. Changes to these terms</h2>
              <p>We may update these Terms. We will notify users of material changes at least 14 days before they take effect, via the platform or email. Continued use of the service after that date constitutes acceptance of the revised Terms.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">13. Contact</h2>
              <p>Questions about these Terms? Contact us at <a href="mailto:legal@orbit.app" className="text-primary hover:underline">legal@orbit.app</a>.</p>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}
