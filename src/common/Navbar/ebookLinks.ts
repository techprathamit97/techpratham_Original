
export interface EbookLink {
  label: string;
  href: string;
}

export interface EbookGroup {
  label: string;
  /** Shorter label for tight spaces such as the mobile accordion. */
  shortLabel: string;
  links: EbookLink[];
}

export const EBOOK_GROUPS: EbookGroup[] = [
  {
    label: "Workday E-Book",
    shortLabel: "Workday",
    links: [
      { label: "Learning e-Book", href: "/e-book/workday" },
      { label: "Interview Questions", href: "/e-book/workday/interview-questions" },
      { label: "Certificate Dumps", href: "/e-book/workday/certificate-dumps" },
      { label: "Sample Resume", href: "/e-book/workday/sample-resume" },
      { label: "Quizzes", href: "/quiz/69d2dae83ecf561526c2b910" },
    ],
  },
  {
    label: "ServiceNow E-Book",
    shortLabel: "ServiceNow",
    links: [
      { label: "Learning e-Book", href: "/e-book/ServiceNow" },
      { label: "Interview Questions", href: "/e-book/ServiceNow/interview-question" },
      { label: "Certificate Dumps", href: "/e-book/ServiceNow/certificate-dumps" },
      { label: "Sample Resume", href: "/e-book/ServiceNow/sample-resume" },
      { label: "Quizzes", href: "/quiz/6a5761d6a97c84d14b9df8a3" },
    ],
  },
  {
    label: "SAP E-Book",
    shortLabel: "SAP",
    links: [{ label: "Learning e-Book", href: "/courses/sap-successfactors" }],
  },
  {
    label: "MS Dynamics E-Book",
    shortLabel: "MS Dynamics",
    links: [
      { label: "Learning e-Book", href: "/courses/microsoft-dynamics-365-sales-functional-consultant-associate-mb-210-training" },
    ],
  },
  {
    label: "Software Testing E-Book",
    shortLabel: "Software Testing",
    links: [
      { label: "Learning e-Book", href: "/courses/software-testing-full-stack-program" },
    ],
  },
  {
    label: "Data Analytics E-Book",
    shortLabel: "Data Analytics",
    links: [
      { label: "Learning e-Book", href: "/courses/data-analytics" },
    ],
  },
];
