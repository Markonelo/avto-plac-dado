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
    <LegalPage
      title={{ mk: "Политика за приватност", en: "Privacy Policy" }}
      updated={{ mk: "9 септември 2026", en: "9 September 2026" }}
      en={
        <>
          <p>
            This Privacy Policy explains how {SITE.name} (&quot;we&quot;,
            &quot;us&quot; or &quot;our&quot;) collects, uses and protects your
            personal information when you visit our website or get in touch with
            us. We are a car dealership based in {SITE.city}, {SITE.country}.
          </p>

          <h2>Information we collect</h2>
          <p>
            We only collect the information you choose to share with us. When you
            use our contact form or email us, this may include:
          </p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your phone number (if you provide it)</li>
            <li>
              The car you&apos;re interested in and any message you send us
            </li>
          </ul>
          <p>
            Like most websites, we may also automatically collect basic
            technical information such as your browser type and general usage
            data to help keep the site running smoothly.
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
            We do <strong>not</strong> sell, rent or trade your personal
            information to third parties.
          </p>

          <h2>Cookies</h2>
          <p>
            Our site may use essential cookies to function properly. Some pages
            embed third-party content — for example Google Maps — which may set
            its own cookies. You can control or disable cookies through your
            browser settings.
          </p>

          <h2>Data retention</h2>
          <p>
            We keep your enquiry information only for as long as needed to help
            you and to keep proper business records, after which it is deleted.
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
            We take reasonable steps to protect your information, but no method
            of transmission over the internet is completely secure. We cannot
            guarantee absolute security.
          </p>

          <h2>Third-party links</h2>
          <p>
            Our website may contain links to other sites (such as Google Maps or
            our social profiles). We are not responsible for the privacy
            practices of those websites.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be posted on this page with a new &quot;last updated&quot; date.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle
            your information, contact us at{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </>
      }
      mk={
        <>
          <p>
            Оваа Политика за приватност објаснува како {SITE.name} („ние“, „нас“
            или „наш“) ги собира, користи и заштитува вашите лични податоци кога
            ја посетувате нашата веб-страница или стапувате во контакт со нас.
            Ние сме автосалон со седиште во {SITE.city}, {SITE.country}.
          </p>

          <h2>Податоци што ги собираме</h2>
          <p>
            Ги собираме само податоците што вие ќе изберете да ги споделите со
            нас. Кога го користите нашиот контакт-формулар или ни пишувате
            е-пошта, тоа може да вклучува:
          </p>
          <ul>
            <li>Вашето име</li>
            <li>Вашата адреса за е-пошта</li>
            <li>Вашиот телефонски број (ако го наведете)</li>
            <li>
              Возилото за кое сте заинтересирани и секоја порака што ни ја
              испраќате
            </li>
          </ul>
          <p>
            Како и повеќето веб-страници, може автоматски да собираме основни
            технички податоци, како типот на прелистувачот и општи податоци за
            користење, за да ѝ помогнеме на страницата да работи непречено.
          </p>

          <h2>Како ги користиме вашите податоци</h2>
          <p>Податоците што ги давате ги користиме за да:</p>
          <ul>
            <li>Одговориме на вашите прашања и барања</li>
            <li>
              Договориме прегледи, пробни возења или дадеме детали за возилата
            </li>
            <li>
              Помогнеме со прашања за финансирање или замена што ги поставувате
            </li>
            <li>Ја подобриме нашата веб-страница и услугата што ја нудиме</li>
          </ul>
          <p>
            <strong>Не</strong> ги продаваме, изнајмуваме ниту разменуваме вашите
            лични податоци со трети страни.
          </p>

          <h2>Колачиња (cookies)</h2>
          <p>
            Нашата страница може да користи неопходни колачиња за да функционира
            правилно. Некои страници вградуваат содржина од трети страни — на
            пример Google Maps — која може да поставува свои колачиња. Можете да
            ги контролирате или оневозможите колачињата преку поставките на
            вашиот прелистувач.
          </p>

          <h2>Чување на податоците</h2>
          <p>
            Податоците од вашето барање ги чуваме само онолку долго колку што е
            потребно за да ви помогнеме и за да водиме уредна деловна евиденција,
            по што тие се бришат.
          </p>

          <h2>Ваши права</h2>
          <p>Имате право да:</p>
          <ul>
            <li>Побарате копија од личните податоци што ги чуваме за вас</li>
            <li>Побарате да ги исправиме или ажурираме вашите податоци</li>
            <li>Побарате да ги избришеме вашите податоци</li>
          </ul>
          <p>
            За да остварите било кое од овие права, едноставно испратете ни
            е-пошта на <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>

          <h2>Безбедност</h2>
          <p>
            Преземаме разумни мерки за да ги заштитиме вашите податоци, но ниту
            еден метод на пренос преку интернет не е целосно безбеден. Не можеме
            да гарантираме апсолутна безбедност.
          </p>

          <h2>Врски кон трети страни</h2>
          <p>
            Нашата веб-страница може да содржи врски кон други страници (како
            Google Maps или нашите профили на социјалните мрежи). Не сме
            одговорни за практиките за приватност на тие веб-страници.
          </p>

          <h2>Промени на оваа политика</h2>
          <p>
            Може да ја ажурираме оваа Политика за приватност одвреме-навреме.
            Секоја промена ќе биде објавена на оваа страница со нов датум на
            „последно ажурирање“.
          </p>

          <h2>Контактирајте нè</h2>
          <p>
            Ако имате какви било прашања за оваа Политика за приватност или за
            начинот на кој ги обработуваме вашите податоци, контактирајте нè на{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </>
      }
    />
  );
}
