import type { Metadata } from "next";
import { LegalLayout } from "@/components/layouts/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service · Bolder Vibes",
  description:
    "The terms that govern your use of Bolder Vibes — an AI-powered mobile app development platform.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updatedAt="April 17, 2026">
      <p>
        Welcome to <strong>Bolder Vibes</strong>. These Terms of Service
        (&ldquo;Terms&rdquo;) govern your access to and use of our AI-powered
        mobile app development platform (the &ldquo;Service&rdquo;). By
        creating an account or using the Service, you agree to be bound by
        these Terms.
      </p>

      <h2>1. Your Account</h2>
      <p>
        To use most features of the Service you must create an account.
        You agree to provide accurate information, keep your credentials
        confidential, and promptly notify us of any unauthorized use. You
        are responsible for everything that happens under your account.
      </p>
      <ul>
        <li>You must be at least 13 years old (16 in the EU/UK).</li>
        <li>One person or legal entity may maintain no more than one free account.</li>
        <li>You may not use the Service for unlawful, harmful, or abusive activity.</li>
      </ul>

      <h2>2. Content You Create</h2>
      <p>
        Projects, prompts, code, and assets you create through the Service
        (&ldquo;Your Content&rdquo;) remain yours. By storing Your Content
        with us, you grant Bolder Vibes a worldwide, royalty-free license
        to host, display, process, and transmit it solely to operate and
        improve the Service.
      </p>
      <p>
        You represent that you have the rights to Your Content and that it
        does not violate any law or third-party right (including
        intellectual-property, privacy, or publicity rights).
      </p>

      <h2>3. AI-Generated Output</h2>
      <p>
        The Service uses third-party AI models (for example, Anthropic
        Claude) to generate code and related artifacts (&ldquo;AI
        Output&rdquo;). You are free to use AI Output in your own products,
        but:
      </p>
      <ul>
        <li>AI Output is provided <strong>as-is</strong> with no warranty of correctness, safety, or fitness for purpose.</li>
        <li>You are solely responsible for reviewing, testing, and deploying AI Output.</li>
        <li>Identical or similar AI Output may be produced for other users — we do not claim exclusivity on generic code.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree <strong>not</strong> to:</p>
      <ul>
        <li>Reverse-engineer, decompile, or extract the underlying models or infrastructure.</li>
        <li>Use the Service to generate malware, phishing content, CSAM, or material inciting violence.</li>
        <li>Attempt to defeat rate limits, quotas, or security controls.</li>
        <li>Resell the Service or wrap it as a competing product without our written consent.</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>
        The Service integrates with third parties (Expo EAS, Docker-based
        preview runtimes, Anthropic, and others). Your use of those
        services is subject to their own terms — we are not responsible
        for their availability, pricing, or policies.
      </p>

      <h2>6. Fees and Plans</h2>
      <p>
        Some features may require a paid plan. Fees, included quotas, and
        payment terms are described on our pricing page at the time of
        purchase. All fees are non-refundable except where required by
        law. We may change prices with at least 30 days&apos; notice.
      </p>

      <h2>7. Termination</h2>
      <p>
        You may delete your account at any time from Settings. We may
        suspend or terminate accounts that violate these Terms, pose a
        security risk, or remain inactive for a prolonged period. On
        termination we will delete Your Content within 30 days unless
        retention is required by law.
      </p>

      <h2>8. Warranty Disclaimer</h2>
      <p>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
        OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, AND NON-INFRINGEMENT. We do not warrant that the Service
        will be uninterrupted, error-free, or that AI Output will meet
        your expectations.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOLDER VIBES AND ITS
        AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
        PROFITS OR REVENUES. Our aggregate liability for any claim
        relating to the Service will not exceed the greater of $50 USD
        or the amount you paid us in the 12 months preceding the claim.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will
        be announced via email or an in-product notice at least 14 days
        before they take effect. Continued use of the Service after the
        effective date constitutes acceptance of the updated Terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which
        Bolder Vibes is incorporated, without regard to its conflict-of-
        laws principles. Disputes will be resolved in the competent
        courts of that jurisdiction.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms? Reach us at{" "}
        <a href="mailto:support@bolder-vibes.app">
          support@bolder-vibes.app
        </a>
        .
      </p>
    </LegalLayout>
  );
}
