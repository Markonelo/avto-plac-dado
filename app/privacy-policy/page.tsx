import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Политика за приватност",
  description:
    "Како Авто Плац Дадо ги собира, користи и заштитува вашите лични податоци.",
  alternates: { canonical: "/privacy-policy" },
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="9 September 2026">
      <p>
        This Privacy Policy explains how {SITE.name} (&quot;we&quot;,
        &quot;us&quot; or &quot;our&quot;) collects, uses and protects your
        personal information when you visit our website or get in touch with us.
        We are a car dealership based in {SITE.city}, {SITE.country}.
      </p>

      <h2>Information we collect</h2>
      <p>
        We only collect the information you choose to share with us. When you use
        our contact form or email us, this may include:
      </p>
      <ul>
        <li>Your name</li>
        <li>Your email address</li>
        <li>Your phone number (if you provide it)</li>
        <li>The car you&apos;re interested in and any message you send us</li>
      </ul>
      <p>
        Like most websites, we may also automatically collect basic technical
        information such as your browser type and general usage data to help keep
        the site running smoothly.
      </p>

      <h2>How we use your information</h2>
      <p>We use the information you provide to:</p>
      <ul>
        <li>Reply to your enquiries and requests</li>
        <li>Arrange viewings, test drives or provide car details</li>
        <li>Help with financing or trade-in questions you ask about</li>
        <li>Improve our website and the service we offer</li>
      </ul>
      <p>
        We do <strong>not</strong> sell, rent or trade your personal information
        to third parties.
      </p>

      <h2>Cookies</h2>
      <p>
        Our site may use essential cookies to function properly. Some pages embed
        third-party content — for example Google Maps — which may set its own
        cookies. You can control or disable cookies through your browser
        settings.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your enquiry information only for as long as needed to help you
        and to keep proper business records, after which it is deleted.
      </p>

      <h2>Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request a copy of the personal data we hold about you</li>
        <li>Ask us to correct or update your information</li>
        <li>Ask us to delete your information</li>
      </ul>
      <p>
        To exercise any of these rights, just email us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable steps to protect your information, but no method of
        transmission over the internet is completely secure. We cannot guarantee
        absolute security.
      </p>

      <h2>Third-party links</h2>
      <p>
        Our website may contain links to other sites (such as Google Maps or our
        social profiles). We are not responsible for the privacy practices of
        those websites.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with a new &quot;last updated&quot; date.
      </p>

      <h2>Contact us</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle your
        information, contact us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
