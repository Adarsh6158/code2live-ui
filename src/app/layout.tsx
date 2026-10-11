import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F172A",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = "https://code2live.adarshcodes.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code2Live | Adarsh Kumar",
    template: "%s | Code2Live",
  },
  description:
    "Production-grade AI app generation engine converting natural language requirements into full-stack web applications with real-time multi-file streaming, live sandboxes, and automated deployments.",
  applicationName: "Code2Live",
  authors: [{ name: "Adarsh Kumar", url: "https://adarshcodes.com" }],
  generator: "Next.js",
  keywords: [
    "Adarsh Kumar",
    "Code2Live",
    "AI Code Generation",
    "Full Stack Development",
    "Spring Boot",
    "Spring AI",
    "Apache Kafka",
    "Distributed Systems",
    "Kubernetes Sandboxes",
    "Software Engineer Portfolio",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Adarsh Kumar",
  publisher: "Adarsh Kumar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Code2Live — AI-Driven Code Generation SaaS Platform | Adarsh Kumar",
    description:
      "Production-grade AI app generation engine converting natural language requirements into full-stack web applications with real-time multi-file streaming and isolated sandboxes.",
    siteName: "Code2Live",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Code2Live — AI-Driven Code Generation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code2Live — AI-Driven Code Generation SaaS Platform",
    description:
      "Production-grade AI app generation engine with real-time multi-file streaming and isolated sandboxes.",
    creator: "@adarshmall",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Software Development / Developer Tools / Cloud Platform",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Code2Live",
      description:
        "AI-Driven Code Generation SaaS Platform by Adarsh Kumar",
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Code2Live",
      url: SITE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      description:
        "Production-grade AI app generation engine converting natural language requirements into full-stack web applications with real-time multi-file code streaming, live sandboxes, and automated deployments.",
      author: {
        "@type": "Person",
        name: "Adarsh Kumar",
        url: "https://adarshcodes.com",
        sameAs: [
          "https://github.com/Adarsh6158",
          "https://linkedin.com/in/adarshmall",
          "https://leetcode.com/u/AdarshMall/",
          "https://medium.com/@adarshkumar11",
        ],
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "Person",
      "@id": "https://adarshcodes.com/#person",
      name: "Adarsh Kumar",
      jobTitle: "Software Engineer",
      url: "https://adarshcodes.com",
      sameAs: [
        "https://github.com/Adarsh6158",
        "https://linkedin.com/in/adarshmall",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}

