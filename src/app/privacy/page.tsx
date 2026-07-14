import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { siteName, supportEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Synesis collects, uses, stores, and protects personal information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "/privacy",
  },
};

const sections = [
  {
    id: "scope",
    title: "What this policy covers",
    content: (
      <p>
        This Privacy Policy explains how {siteName} handles personal information when you use our study-group discovery and coordination service. It applies to information collected through our website, app, and support communications.
      </p>
    ),
  },
  {
    id: "information",
    title: "Information we collect",
    content: (
      <>
        <p>We collect the information needed to create and operate your account, including your email address, name, username, course, and year level.</p>
        <p>You may also choose to add profile details such as a biography, avatar, and social contact details. When you create, join, or manage a study group, we process the group name, subject, description, schedule, platform, membership, and related activity.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    content: (
      <ul className="list-disc space-y-2 pl-5 marker:text-purple-700">
        <li>Provide, personalize, and maintain your account and study groups.</li>
        <li>Authenticate users, prevent misuse, and protect the security of the service.</li>
        <li>Respond to support requests and communicate important service updates.</li>
        <li>Understand and improve the reliability and performance of the app.</li>
      </ul>
    ),
  },
  {
    id: "storage",
    title: "Sessions, local storage, and analytics",
    content: (
      <>
        <p>{siteName} uses authentication sessions and browser local storage to keep you signed in and remember limited app preferences, such as whether the install prompt was dismissed.</p>
        <p>We use Vercel Speed Insights to receive anonymous web-performance metrics. We do not use Google Maps APIs, advertising cookies, or web beacons in the current app.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How information is shared",
    content: (
      <>
        <p>Profile, group, and contact details you choose to make available may be visible to other users as part of the service. We use service providers, including Supabase for authentication and database infrastructure and Vercel for hosting and performance monitoring, to operate the app.</p>
        <p>We may also disclose information when required by law, to protect people and the service, or as part of a business transfer. We do not sell personal information.</p>
      </>
    ),
  },
  {
    id: "retention-security",
    title: "Retention and security",
    content: (
      <>
        <p>We retain account and service information for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account by contacting us.</p>
        <p>We use reasonable technical and organizational safeguards to protect information. No method of electronic transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your choices and privacy rights",
    content: (
      <>
        <p>You can update your profile information in the app. Depending on where you live, you may also have rights to request access, correction, deletion, restriction, objection, or a copy of your personal information.</p>
        <p>To make a request or ask a privacy question, email <a className="font-medium text-purple-700 underline underline-offset-4" href={`mailto:${supportEmail}`}>{supportEmail}</a>. We may need to verify your identity before responding.</p>
      </>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    content: (
      <p>
        We may update this policy to reflect changes to the app or applicable requirements. We will post the updated version here and revise the date above. Questions can be sent to <a className="font-medium text-purple-700 underline underline-offset-4" href={`mailto:${supportEmail}`}>{supportEmail}</a> or through our <Link className="font-medium text-purple-700 underline underline-offset-4" href="/contact">Contact Us page</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Trust center · Policy 01" title="Privacy Policy" introduction="A plain-language explanation of the information Synesis needs to connect students and support study groups." sections={sections} />;
}
