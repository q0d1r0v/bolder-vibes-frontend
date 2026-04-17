import type { Metadata } from "next";
import { LegalLayout } from "@/components/layouts/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy · Bolder Vibes",
  description:
    "How Bolder Vibes collects, uses, and protects the information you share with us.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="April 17, 2026">
      <p>
        <strong>Bolder Vibes</strong> (&ldquo;we&rdquo;,
        &ldquo;our&rdquo;, &ldquo;us&rdquo;) takes your privacy seriously.
        This policy describes what information we collect when you use our
        Service, how we use it, and the choices you have.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Account data</strong> — email, display name, and an
          encrypted password hash (never the password itself).
        </li>
        <li>
          <strong>Project content</strong> — prompts you send to the AI,
          project files, and build artifacts (APKs, AABs, iOS archives).
        </li>
        <li>
          <strong>Third-party credentials</strong> — optional tokens you
          save (e.g. your Expo personal access token). These are
          encrypted at rest with AES-256-GCM using a server-side key
          that is never exposed to the browser.
        </li>
      </ul>

      <h3>Information we collect automatically</h3>
      <ul>
        <li>
          <strong>Usage telemetry</strong> — HTTP request metadata
          (method, path, status, duration) with a short-lived request
          correlation ID. Used for debugging and capacity planning.
        </li>
        <li>
          <strong>Error reports</strong> — when a server error occurs we
          capture the stack trace, user ID, and request path via Sentry
          (when configured). We do <em>not</em> record prompts or
          project content in error reports.
        </li>
        <li>
          <strong>Device and browser</strong> — IP address and user-agent
          string for basic security (rate limiting, abuse detection).
          Retained for 30 days.
        </li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>Operate, maintain, and improve the Service.</li>
        <li>Route your prompts to the AI provider to generate code.</li>
        <li>Secure your account (login, password reset, session rotation).</li>
        <li>Detect fraud, abuse, and policy violations.</li>
        <li>Communicate about product updates and service notices.</li>
      </ul>

      <h2>3. AI Processing</h2>
      <p>
        Your prompts and relevant project context are sent to our AI
        provider (currently <strong>Anthropic</strong>) to generate
        responses. Per Anthropic&apos;s API terms, your data is{" "}
        <strong>not used to train their models</strong> by default. Your
        data is subject to Anthropic&apos;s{" "}
        <a
          href="https://www.anthropic.com/legal/privacy"
          target="_blank"
          rel="noreferrer"
        >
          privacy policy
        </a>{" "}
        during processing.
      </p>

      <h2>4. Who We Share With</h2>
      <p>We share the minimum data necessary with:</p>
      <ul>
        <li>
          <strong>Anthropic</strong> — for AI inference on your prompts.
        </li>
        <li>
          <strong>Expo (EAS Build)</strong> — if you trigger a cloud
          build, we forward your project files and your Expo token to
          Expo&apos;s build service.
        </li>
        <li>
          <strong>Sentry</strong> — if configured, to receive anonymised
          error stack traces for debugging.
        </li>
        <li>
          <strong>Our hosting / database providers</strong> — under
          standard data-processing agreements.
        </li>
      </ul>
      <p>
        We never sell your personal information, and we do not share
        prompts or project content with advertisers.
      </p>

      <h2>5. Data Retention</h2>
      <ul>
        <li>
          <strong>Account and project data</strong> — retained while your
          account is active. Deleted within 30 days of account deletion.
        </li>
        <li>
          <strong>Build artifacts</strong> — APK / AAB / IPA files are
          retained for 24 hours after build completion, then purged.
        </li>
        <li>
          <strong>Preview tokens</strong> — short-lived (5 min), never
          stored beyond their TTL.
        </li>
        <li>
          <strong>Security logs</strong> — 30 days.
        </li>
      </ul>

      <h2>6. Security</h2>
      <p>
        We apply industry-standard controls:
      </p>
      <ul>
        <li>TLS 1.2+ for all traffic.</li>
        <li>Passwords hashed with bcrypt (cost factor ≥ 12).</li>
        <li>Third-party tokens encrypted at rest with AES-256-GCM.</li>
        <li>JWT access tokens expire after 15 minutes; refresh tokens rotate.</li>
        <li>Rate limiting on expensive endpoints (builds, login, API).</li>
        <li>Strict CSP, HTTPS-only cookies, SameSite protections.</li>
      </ul>
      <p>
        No online service is 100% secure. If you discover a vulnerability,
        please email{" "}
        <a href="mailto:security@bolder-vibes.app">
          security@bolder-vibes.app
        </a>
        .
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Depending on where you live, you may have the right to:
      </p>
      <ul>
        <li>Access a copy of your personal data.</li>
        <li>Correct inaccurate data.</li>
        <li>Delete your data (&ldquo;right to be forgotten&rdquo;).</li>
        <li>Export your data in a portable format.</li>
        <li>Object to certain processing, or withdraw consent.</li>
      </ul>
      <p>
        To exercise any of these rights, contact{" "}
        <a href="mailto:privacy@bolder-vibes.app">
          privacy@bolder-vibes.app
        </a>
        . We&apos;ll respond within 30 days.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use a small number of strictly necessary cookies for
        authentication (session tokens) and CSRF protection. We do{" "}
        <strong>not</strong> use third-party advertising or tracking
        cookies.
      </p>

      <h2>9. International Transfers</h2>
      <p>
        Our servers and sub-processors may be located outside your
        country of residence. Where required, we rely on Standard
        Contractual Clauses or equivalent legal mechanisms for lawful
        cross-border transfers.
      </p>

      <h2>10. Children</h2>
      <p>
        The Service is not directed to children under 13 (16 in the
        EU/UK). We do not knowingly collect personal information from
        children. If you believe a child has provided us with personal
        information, contact us and we will promptly delete it.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy to reflect changes in our
        practices or the law. Material changes will be announced via
        email or an in-product notice at least 14 days before they take
        effect.
      </p>

      <h2>12. Contact</h2>
      <p>
        Privacy questions? Reach us at{" "}
        <a href="mailto:privacy@bolder-vibes.app">
          privacy@bolder-vibes.app
        </a>
        .
      </p>
    </LegalLayout>
  );
}
