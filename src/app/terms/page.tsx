import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { siteName, supportEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms that govern use of Synesis and its study-group community.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    url: "/terms",
  },
};

const sections = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    content: (
      <p>By creating an account or using {siteName}, you agree to these Terms of Service and our <Link className="font-medium text-purple-700 underline underline-offset-4" href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the service.</p>
    ),
  },
  {
    id: "service",
    title: "The service",
    content: (
      <p>{siteName} helps students discover, create, and coordinate study groups. We provide the platform, but study sessions, group decisions, and interactions are organized by users. We do not guarantee a group’s availability, quality, safety, academic outcome, or compatibility.</p>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and eligibility",
    content: (
      <>
        <p>You are responsible for keeping your account credentials confidential and for activity under your account. Provide accurate information and notify us promptly if you suspect unauthorized access.</p>
        <p>You may use {siteName} only if you can legally enter into these terms. If you are under the age required to do so in your location, use the service only with any consent required from a parent or legal guardian.</p>
      </>
    ),
  },
  {
    id: "conduct",
    title: "Community standards",
    content: (
      <ul className="list-disc space-y-2 pl-5 marker:text-purple-700">
        <li>Be respectful and honest when creating profiles, groups, and messages.</li>
        <li>Do not harass, threaten, discriminate against, impersonate, or exploit others.</li>
        <li>Do not post unlawful, infringing, misleading, or harmful content.</li>
        <li>Do not attempt to bypass security, interfere with the service, or access another person’s account or data without permission.</li>
      </ul>
    ),
  },
  {
    id: "content",
    title: "Your content and group information",
    content: (
      <p>You retain ownership of the content you submit. You give us a limited, non-exclusive license to store, display, and process that content only as needed to operate, improve, and secure {siteName}. Make sure you have the right to share anything you post and avoid sharing sensitive information that is not necessary for study-group coordination.</p>
    ),
  },
  {
    id: "third-party",
    title: "Third-party services",
    content: (
      <p>Groups may choose to meet or communicate through third-party platforms such as Discord, Zoom, Google Meet, WhatsApp, Instagram, Facebook, or Messenger. Those platforms are governed by their own terms and privacy policies. {siteName} is not responsible for third-party services or user interactions that occur outside our app.</p>
    ),
  },
  {
    id: "suspension",
    title: "Suspension or termination",
    content: (
      <p>We may suspend or end access to {siteName} if we reasonably believe you have violated these terms, created risk for other users or the service, or are required to do so by law. You may stop using the service at any time and may request account deletion by contacting us.</p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers and liability",
    content: (
      <p>The service is provided on an “as is” and “as available” basis. To the extent permitted by applicable law, {siteName} disclaims warranties of merchantability, fitness for a particular purpose, and non-infringement. We are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    content: (
      <p>We may change these terms from time to time. Continued use after the updated terms take effect means you accept them. For questions, email <a className="font-medium text-purple-700 underline underline-offset-4" href={`mailto:${supportEmail}`}>{supportEmail}</a> or visit our <Link className="font-medium text-purple-700 underline underline-offset-4" href="/contact">Contact Us page</Link>.</p>
    ),
  },
];

export default function TermsPage() {
  return <PolicyPage eyebrow="Community agreement · Policy 02" title="Terms of Service" introduction="The shared expectations that help Synesis remain a useful, respectful place to meet study partners." sections={sections} />;
}
