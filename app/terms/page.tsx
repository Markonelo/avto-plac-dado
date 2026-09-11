import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Услови за користење",
  description:
    "Условите и правилата за користење на веб-страницата на Авто Плац Дадо.",
  alternates: { canonical: "/terms" },
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="9 September 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the{" "}
        {SITE.name} website. By accessing or using our site, you agree to these
        Terms. If you do not agree, please do not use the site.
      </p>

      <h2>Use of the website</h2>
      <p>
        You may use this website for lawful, personal purposes such as browsing
        our inventory and getting in touch with us. You agree not to misuse the
        site, attempt to disrupt it, or use it in any way that could harm us or
        other visitors.
      </p>

      <h2>Vehicle listings and pricing</h2>
      <p>
        The cars, specifications and prices shown on this website are for general
        information only. Availability, details and prices can change at any time
        without notice, and a listing does not constitute a binding offer to
        sell. We do our best to keep everything accurate, but we recommend
        confirming the details of any car with us directly before making a
        decision.
      </p>

      <h2>No warranty</h2>
      <p>
        This website is provided &quot;as is&quot; without any warranties of any
        kind. While we work to keep the information current and correct, we do
        not guarantee that the site will always be accurate, complete or
        available without interruption.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content on this website — including text, logos, layout and images —
        belongs to {SITE.name} or its licensors and may not be copied or reused
        without our permission. Brand logos shown belong to their respective
        owners.
      </p>

      <h2>Third-party links</h2>
      <p>
        Our website may link to third-party services (such as Google Maps or
        social media). We are not responsible for the content, policies or
        practices of those external sites.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE.name} shall not be liable
        for any loss or damage arising from your use of, or inability to use,
        this website or from reliance on any information shown on it.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of {SITE.country}. Any disputes will
        be subject to the jurisdiction of the courts of {SITE.country}.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. The latest version will
        always be posted on this page with an updated date.
      </p>

      <h2>Contact us</h2>
      <p>
        If you have any questions about these Terms, contact us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
