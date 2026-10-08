/**
 * Refer & Earn copy and data, taken from the Olympus Refer & Earn page
 * (/refer_and_earn). The rewards table is transcribed from the image prod
 * shows inside the "How much referral reward" answer.
 */

export const REFERRAL_CATEGORIES = [
  "My Program",
  "Agentic AI",
  "Artificial Intelligence and Machine Learning",
  "Data Science & Analytics",
  "Technology",
  "AI Leadership",
] as const;

export type ReferralCategory = (typeof REFERRAL_CATEGORIES)[number];

export type ReferralStep = { title: string; body: string; icon: "refer" | "accept" | "call" | "reward" };

export const REFERRAL_STEPS: ReferralStep[] = [
  {
    icon: "refer",
    title: "Refer a friend",
    body: "Generate your unique referral link and share it with your friends and colleagues to invite them to join our program",
  },
  {
    icon: "accept",
    title: "Your friend accepts your invitation",
    body: "They click on your referral link and fill in their details to accept your referral invitation",
  },
  {
    icon: "call",
    title: "We get in touch with your friend",
    body: "The admissions team verifies their details and gets in touch to take them through the program and its benefits",
  },
  {
    icon: "reward",
    title: "You both receive referral rewards",
    body: "Whenever your friend successfully enrolls in the program by paying the full program fee, the referral benefits are awarded within 28 days of your friend paying his full program fee",
  },
];

export type Faq = {
  q: string;
  /** Paragraphs; lines starting "1." etc. render as a numbered list item. */
  a: string[];
  /** Show the program rewards table under the answer. */
  rewardsTable?: boolean;
};

export const REFERRAL_SUPPORT_EMAIL = "referral_support@greatlearning.in";

export const REFERRAL_FAQS: Faq[] = [
  {
    q: "What is considered as a valid referral?",
    a: [
      "A referral is considered valid if it satisfies all of the following criteria:",
      "1. You are an enrolled learner or alumni of Great Learning.",
      "2. The referral is made via your unique referral link.",
      "3. The person receiving your referral is not already enrolled in any of the programs offered by Great Learning at the time of referral.",
      "4. The person receiving your referral has not been referred by another learner at the time of referral.",
      "5. The person receiving the referral should not drop out and get their fee refunded from Great Learning.",
    ],
  },
  {
    q: "What if my friend already has an account with Great Learning?",
    a: ["You can refer a friend with an existing account on Great Learning as long as they are not enrolled in any of the programs."],
  },
  {
    q: "My friend is already enrolled in a program. Can we both get fee waivers through this process?",
    a: ["No. The referral scheme is valid only when the friend you are referring is not an enrolled learner at the time of referral."],
  },
  {
    q: "How much referral reward will my friend and I get?",
    a: [
      "The final referral reward for both you and your friend is calculated based on which program they enroll in. Please refer to the table below for the referral rewards for all programs.",
    ],
    rewardsTable: true,
  },
  {
    q: "How can I track the status of my referral?",
    a: [
      "You can track the status of all your referrals through your referral dashboard. We will also notify you once your referral successfully enrolls in a program.",
    ],
  },
  {
    q: "When will my friend be considered enrolled in the program?",
    a: ["Your friend will be considered enrolled when they successfully pay the entire program fees."],
  },
  {
    q: "How will I receive my referral reward?",
    a: [
      "If you have not paid your full fee yet, you can get the referral amount as a waiver in your last fee instalment. However, if you have already paid the full fee, we will be refunding the referral amount for you.",
    ],
  },
  {
    q: "How will my friend receive the fee waiver?",
    a: [
      "Your friend will receive the fee waiver on their last instalment. If they choose to pay the full fee upfront, they can only avail of the one-time fee payment discount and not the referral discount. Your friend who receives the referral from you cannot combine referral benefits with other fee waivers.",
    ],
  },
  {
    q: "How long will it take for me to get the referral reward?",
    a: ["You will receive the referral reward within 28 days from the date on which the entire fee is paid by your friend."],
  },
  {
    q: "My friend has enrolled but I have not received the referral reward. What should I do?",
    a: [
      "The referral reward may not have been processed because of one of the following reasons:",
      `1. Your friend/referral has enrolled in the last 28 days. It usually takes 28 days to process the referral reward. If this is not the case, please reach out to us at ${REFERRAL_SUPPORT_EMAIL}.`,
      `2. Your friend has enrolled with an email id that is different from the email address they used to accept your referral. In such a case, kindly write to us at ${REFERRAL_SUPPORT_EMAIL}.`,
      "3. Your friend has not paid their entire admission fee yet.",
    ],
  },
  {
    q: "What is the maximum number of referrals I can make?",
    a: [
      "There is no limit to the number of referrals you can make. However, they should all be made through your unique referral link and verified by us.",
    ],
  },
  {
    q: "Can my friend club his referral benefit with scholarship or other fee waiver?",
    a: [
      "No, your friend who receives the referral cannot get both the referral benefit and other fee waivers. However, you can combine your referral benefit as a referrer with other scholarships or fee waiver.",
    ],
  },
  {
    q: "My question is not found here, what should I do?",
    a: [`Please write an email to ${REFERRAL_SUPPORT_EMAIL} in case you have any further queries.`],
  },
];

/** USD amounts; null means "No Reward". */
export type RewardRow = { program: string; friend: number | null; newUser: number; existingUser: number };

export const REFERRAL_REWARDS: RewardRow[] = [
  { program: "Microsoft AI Professional Program (AI to OpenAI)", friend: 150, newUser: 150, existingUser: 150 },
  { program: "MS Information Science: Machine Learning", friend: 300, newUser: 300, existingUser: 300 },
  { program: "Master of Data Science (Global) by Deakin University", friend: 150, newUser: 150, existingUser: 100 },
  { program: "JHU - Certificate Program in AI Business Strategy", friend: 150, newUser: 150, existingUser: 150 },
  { program: "PGP - Data Science and Business Analytics", friend: 200, newUser: 200, existingUser: 150 },
  { program: "UT - Data Analytics Essentials", friend: 100, newUser: 100, existingUser: 100 },
  { program: "MIT - AI and Data Science Program", friend: 100, newUser: 100, existingUser: 50 },
  { program: "MIT - No Code Agentic AI", friend: 100, newUser: 100, existingUser: 100 },
  { program: "Postgraduate Program in Cloud Computing Leveraging Gen AI", friend: 150, newUser: 150, existingUser: 150 },
  { program: "JHU - Applied Generative AI and Agentic AI", friend: 150, newUser: 150, existingUser: 150 },
  { program: "JHU - AI in Healthcare Program", friend: 150, newUser: 150, existingUser: 150 },
  { program: "PGP - Artificial Intelligence & Machine Learning", friend: 150, newUser: 150, existingUser: 150 },
  { program: "Artificial Intelligence for Leaders", friend: 100, newUser: 100, existingUser: 100 },
  { program: "UT - Post Graduate Program in Cybersecurity", friend: 150, newUser: 150, existingUser: 150 },
  { program: "Applications of Artificial Intelligence", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in AI Agents and Generative AI for Business Applications", friend: 150, newUser: 150, existingUser: 150 },
  { program: "Master of Data Science (Global) Program at Deakin University, using Data Science and Business Analytics", friend: 150, newUser: 150, existingUser: 150 },
  { program: "Master of Data Science (Global) Program at Deakin University, using Artificial Intelligence and Machine Learning", friend: 150, newUser: 150, existingUser: 150 },
  { program: "Doctor of Business Administration in Artificial Intelligence and Machine Learning by Walsh College", friend: 150, newUser: 150, existingUser: 150 },
  { program: "User Experience Design: UI/UX for Data-Driven Business Applications by UT Austin", friend: 200, newUser: 200, existingUser: 100 },
  { program: "Generative AI for Business with Microsoft Azure OpenAI", friend: 100, newUser: 100, existingUser: 100 },
  { program: "Generative AI for Natural Language Processing", friend: null, newUser: 100, existingUser: 100 },
  { program: "Generative AI for Business with AWS", friend: null, newUser: 100, existingUser: 100 },
  { program: "Data Science on Cloud", friend: null, newUser: 100, existingUser: 100 },
  { program: "PL-300 - Microsoft Power BI Data Analyst Certification Training Program", friend: null, newUser: 100, existingUser: 100 },
  { program: "Certificate Program in Advanced Python: From Analytics to AI", friend: null, newUser: 100, existingUser: 100 },
  { program: "Advanced Tableau Data Analyst Certification Training Program", friend: null, newUser: 100, existingUser: 100 },
  { program: "SQL & Databases Program", friend: null, newUser: 100, existingUser: 100 },
  { program: "Microsoft Azure Administrator Training Program", friend: null, newUser: 100, existingUser: 100 },
  { program: "Full-Stack Software Development Program", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in AI Agents for Business Applications", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in Advanced Agentic AI for Business Applications", friend: 200, newUser: 200, existingUser: 200 },
  { program: "JHU - Applications of AI and Agentic AI in Healthcare", friend: 150, newUser: 150, existingUser: 150 },
  { program: "JHU - No-Code Generative AI and Agentic AI", friend: 150, newUser: 150, existingUser: 150 },
  { program: "Chicago Booth - AI Transformation and Leadership Program", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Professional Certificate in Generative AI and Agents for Software Development", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in Cloud Computing Leveraging GenAI", friend: 150, newUser: 150, existingUser: 150 },
  { program: "MIT - Applied AI and Data Science Program", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in Data Science with Generative AI: Applications to Business", friend: 200, newUser: 200, existingUser: 200 },
  { program: "JHU - Professional Certificate in Cybersecurity: IT and Data Security in the Age of AI", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in AI and Machine Learning: Business Applications", friend: 150, newUser: 150, existingUser: 150 },
  { program: "UT - Post Graduate Program in AI for Leaders", friend: 100, newUser: 100, existingUser: 100 },
  { program: "JHU - Certificate Program in Agentic AI", friend: 150, newUser: 150, existingUser: 150 },
  { program: "JHU - Certificate Program in Artificial Intelligence: Applied ML, GenAI, and Agents", friend: 150, newUser: 150, existingUser: 150 },
  { program: "JHU - Certificate Program in Generative AI and Agents Fundamentals", friend: 100, newUser: 100, existingUser: 100 },
];

export type ReferralStatus = "invite_sent" | "accepted" | "enrolled" | "rewarded";

export type ReferralHistoryItem = {
  name: string;
  email: string;
  /** ISO date (YYYY-MM-DD). */
  referredOn: string;
  reward: number;
  status: ReferralStatus;
};

export const REFERRAL_HISTORY: ReferralHistoryItem[] = [
  { name: "Test Referral", email: "test_referral_intl_learner@gl.in", referredOn: "2022-12-19", reward: 150, status: "invite_sent" },
];
