import {
  RouteStop,
  DebtTransfer,
  ExpenseItem,
  ChecklistItem,
  StepItem,
  FAQItem,
  ComparisonItem,
} from "../types/landing.types";

export const MOCK_ROUTE_STOPS: RouteStop[] = [
  {
    id: "stop-1",
    number: 1,
    time: "08:30 AM",
    title: "Cafe 1947",
    location: "Old Manali, River Road",
    category: "Food",
    duration: "1 hour",
  },
  {
    id: "stop-2",
    number: 2,
    time: "10:15 AM",
    title: "Solang Valley Paragliding",
    location: "Solang Valley Ridge",
    category: "Activity",
    duration: "2.5 hours",
    distanceFromPrev: "14.2 km",
    driveTimeFromPrev: "35 mins",
  },
  {
    id: "stop-3",
    number: 3,
    time: "01:30 PM",
    title: "Atal Tunnel Scenic Drive",
    location: "South Portal to North Portal",
    category: "Transport",
    duration: "1 hour",
    distanceFromPrev: "11.8 km",
    driveTimeFromPrev: "25 mins",
  },
  {
    id: "stop-4",
    number: 4,
    time: "03:15 PM",
    title: "Sissu Waterfall Hike",
    location: "Sissu, Lahaul Valley",
    category: "Activity",
    duration: "2 hours",
    distanceFromPrev: "6.4 km",
    driveTimeFromPrev: "15 mins",
  },
];

export const MOCK_DEBT_TRANSFERS: DebtTransfer[] = [
  { from: "Dev", to: "Rohan", amount: 4350 },
  { from: "Sneha", to: "Arjun", amount: 2100 },
];

export const MOCK_EXPENSES: ExpenseItem[] = [
  {
    id: "e-1",
    title: "Solang Adventure Passes",
    amount: 15000,
    paidBy: "Rohan",
    splitType: "Equal",
    date: "Day 2 · 11:30 AM",
  },
  {
    id: "e-2",
    title: "4x4 Mountain Cab & Fuel",
    amount: 18500,
    paidBy: "Arjun",
    splitType: "Equal",
    date: "Day 1 · 07:00 PM",
  },
  {
    id: "e-3",
    title: "Riverside Wooden Cottage",
    amount: 12000,
    paidBy: "Rohan",
    splitType: "Percentage",
    date: "Day 1 · 02:00 PM",
  },
];

export const MOCK_CHECKLIST: ChecklistItem[] = [
  {
    id: "c-1",
    title: "Atal Tunnel & Rohtang Green Permits",
    category: "Documents",
    assignedTo: "Priya",
    priority: "Urgent",
    completed: true,
  },
  {
    id: "c-2",
    title: "Camera & Drone Batteries",
    category: "Gear",
    assignedTo: "Arjun",
    priority: "High",
    completed: true,
  },
  {
    id: "c-3",
    title: "First Aid & Mountain Medicine Kit",
    category: "Medical",
    assignedTo: "Sneha",
    priority: "Urgent",
    completed: true,
  },
  {
    id: "c-4",
    title: "Thermal Jackets & Waterproof Boots",
    category: "Clothing",
    assignedTo: "Dev",
    priority: "High",
    completed: false,
  },
  {
    id: "c-5",
    title: "Action Camera Suction Mounts",
    category: "Gear",
    assignedTo: "Rohan",
    priority: "Medium",
    completed: false,
  },
];

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Create your trip & invite friends",
    description:
      "Start a new trip in seconds. Send your friends a simple invite link or a 6-letter join code. Everyone enters the same private squad room instantly.",
    highlight: "1-click squad join link",
  },
  {
    number: "02",
    title: "Plan days & see routes on Google Maps",
    description:
      "Add activities for each day or ask AI to suggest a full schedule. Kafla automatically connects your stops on Google Maps so you can see driving times and route distances.",
    highlight: "Real driving distance & pacing meter",
  },
  {
    number: "03",
    title: "Track shared costs & settle easily",
    description:
      "Add bills as you go—who paid, and how to split it. At the end of the trip, our debt minimizer calculates the fewest direct payments needed so everyone gets paid back without confusion.",
    highlight: "Simplifies 10 debts into 2 payments",
  },
];

export const COMPARISONS: ComparisonItem[] = [
  {
    feature: "Planning the Itinerary",
    withoutKafla: "Scattered WhatsApp messages, lost notes, and nobody knowing what time to leave.",
    withKafla: "A clear day-by-day timeline with places, start times, and live Google Maps routes.",
  },
  {
    feature: "Splitting Expenses",
    withoutKafla: "Awkward spreadsheets, confusing IOUs, and arguments over who owes whom.",
    withKafla: "Multi-payer splits with a debt minimizer that clears all balances in 2 simple payments.",
  },
  {
    feature: "Packing & Gear",
    withoutKafla: "Three people bring speakers, but nobody remembered the first-aid kit or vehicle pass.",
    withKafla: "A shared checklist with member assignees so everyone knows their exact responsibility.",
  },
  {
    feature: "Group Communication",
    withoutKafla: "Important hotel booking PDFs get buried under hundreds of chat messages.",
    withKafla: "Built-in squad chat and in-app video calls right alongside your trip itinerary.",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is Kafla free to use for our group?",
    answer:
      "Yes. Creating trip rooms, building itineraries, splitting expenses, and using shared checklists is completely free for you and your friends.",
  },
  {
    question: "How does the route map work?",
    answer:
      "When you add activities with locations to your itinerary, Kafla automatically connects them using Google Maps. You can view the driving route, distance in kilometers, driving duration, and an overall pacing meter showing if your day is relaxed, balanced, or packed.",
  },
  {
    question: "How does the Debt Minimizer help us settle money?",
    answer:
      "Instead of every friend paying each other back in 10 different confusing transactions, our debt minimization algorithm calculates the net balance for everyone. It reduces all group debts to the smallest number of direct payments needed.",
  },
  {
    question: "How does the AI itinerary generator work?",
    answer:
      "You simply choose your destination, how many days you are traveling, your group budget, and whether you prefer a relaxed or active pace. The AI generates a realistic day-by-day plan with timings and estimated costs that you can edit anytime.",
  },
  {
    question: "Can we download our itinerary for offline use?",
    answer:
      "Yes. You can export your full day-by-day itinerary and expense breakdown as a clean PDF with one click, perfect for mountain areas or remote trips with poor cellular network.",
  },
  {
    question: "How do group video and audio calls work in Kafla?",
    answer:
      "Kafla has built-in WebRTC video and audio calling. You can hop on a live squad sync directly inside your trip room to review the plan or discuss accommodations together without needing third-party meeting links.",
  },
];
