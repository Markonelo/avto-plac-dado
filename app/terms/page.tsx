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
    <LegalPage
      title={{ mk: "Услови за користење", en: "Terms of Service" }}
      updated={{ mk: "9 септември 2026", en: "9 September 2026" }}
      en={
        <>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the{" "}
            {SITE.name} website. By accessing or using our site, you agree to
            these Terms. If you do not agree, please do not use the site.
          </p>

          <h2>Use of the website</h2>
          <p>
            You may use this website for lawful, personal purposes such as
            browsing our inventory and getting in touch with us. You agree not to
            misuse the site, attempt to disrupt it, or use it in any way that
            could harm us or other visitors.
          </p>

          <h2>Vehicle listings and pricing</h2>
          <p>
            The cars, specifications and prices shown on this website are for
            general information only. Availability, details and prices can change
            at any time without notice, and a listing does not constitute a
            binding offer to sell. We do our best to keep everything accurate,
            but we recommend confirming the details of any car with us directly
            before making a decision.
          </p>

          <h2>No warranty</h2>
          <p>
            This website is provided &quot;as is&quot; without any warranties of
            any kind. While we work to keep the information current and correct,
            we do not guarantee that the site will always be accurate, complete
            or available without interruption.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content on this website — including text, logos, layout and
            images — belongs to {SITE.name} or its licensors and may not be
            copied or reused without our permission. Brand logos shown belong to
            their respective owners.
          </p>

          <h2>Third-party links</h2>
          <p>
            Our website may link to third-party services (such as Google Maps or
            social media). We are not responsible for the content, policies or
            practices of those external sites.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {SITE.name} shall not be
            liable for any loss or damage arising from your use of, or inability
            to use, this website or from reliance on any information shown on it.
          </p>

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of {SITE.country}. Any disputes
            will be subject to the jurisdiction of the courts of {SITE.country}.
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
        </>
      }
      mk={
        <>
          <p>
            Овие Услови за користење („Услови“) го регулираат вашето користење на
            веб-страницата на {SITE.name}. Со пристапување или користење на
            нашата страница, се согласувате со овие Услови. Ако не се
            согласувате, ве молиме не ја користете страницата.
          </p>

          <h2>Користење на веб-страницата</h2>
          <p>
            Оваа веб-страница може да ја користите за законски, лични цели, како
            што се разгледување на нашата понуда и контактирање со нас. Се
            согласувате да не ја злоупотребувате страницата, да не се обидувате
            да ја нарушите нејзиното работење, ниту да ја користите на начин што
            може да нанесе штета нам или на другите посетители.
          </p>

          <h2>Огласи за возила и цени</h2>
          <p>
            Возилата, спецификациите и цените прикажани на оваа веб-страница се
            само за општо информирање. Достапноста, деталите и цените може да се
            променат во секое време без претходна најава, а огласот не
            претставува обврзувачка понуда за продажба. Се трудиме сè да биде
            точно, но препорачуваме деталите за секое возило да ги потврдите
            директно со нас пред да донесете одлука.
          </p>

          <h2>Без гаранција</h2>
          <p>
            Оваа веб-страница се обезбедува „каква што е“, без какви било
            гаранции од било каков вид. Иако работиме информациите да бидат
            ажурни и точни, не гарантираме дека страницата секогаш ќе биде точна,
            целосна или достапна без прекини.
          </p>

          <h2>Интелектуална сопственост</h2>
          <p>
            Содржината на оваа веб-страница — вклучувајќи текст, логоа, распоред и
            слики — му припаѓа на {SITE.name} или на неговите даватели на
            лиценци и не смее да се копира или повторно користи без наша дозвола.
            Прикажаните логоа на брендови им припаѓаат на нивните соодветни
            сопственици.
          </p>

          <h2>Врски кон трети страни</h2>
          <p>
            Нашата веб-страница може да води кон услуги од трети страни (како
            Google Maps или социјалните мрежи). Не сме одговорни за содржината,
            политиките или практиките на тие надворешни страници.
          </p>

          <h2>Ограничување на одговорноста</h2>
          <p>
            Во најголема мера дозволена со закон, {SITE.name} не сноси одговорност
            за каква било загуба или штета што произлегува од вашето користење,
            или неможноста да ја користите оваа веб-страница, или од
            потпирањето на било која информација прикажана на неа.
          </p>

          <h2>Меродавно право</h2>
          <p>
            Овие Услови се регулирани со законите на {SITE.country}. Сите спорови
            ќе бидат под надлежност на судовите во {SITE.country}.
          </p>

          <h2>Промени на овие услови</h2>
          <p>
            Може да ги ажурираме овие Услови одвреме-навреме. Најновата верзија
            секогаш ќе биде објавена на оваа страница со ажуриран датум.
          </p>

          <h2>Контактирајте нè</h2>
          <p>
            Ако имате какви било прашања за овие Услови, контактирајте нè на{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </>
      }
    />
  );
}
