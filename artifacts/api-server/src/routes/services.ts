import { Router, type IRouter } from "express";
import { ListServicesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const SERVICES = [
  {
    id: 1,
    name: "RC Track Session",
    description: "Race on our professional RC track. Choose from 30 minutes, 1 hour, or full day sessions. Bring your own car or rent one of ours.",
    priceFrom: 150,
    priceUnit: "session",
    category: "racing",
    featured: true,
  },
  {
    id: 2,
    name: "RC Car Rental",
    description: "Don't have an RC car? No problem! Rent one of our fleet — Basic Drift, 4x4 Off-Road, Crawler, or Competition Drift cars.",
    priceFrom: 150,
    priceUnit: "15 min",
    category: "rental",
    featured: true,
  },
  {
    id: 3,
    name: "Private Events",
    description: "Host your birthday, corporate outing, or celebration at LA RC Cafe. Exclusive track access, custom packages, and catering available.",
    priceFrom: 5000,
    priceUnit: "event",
    category: "events",
    featured: true,
  },
  {
    id: 4,
    name: "Coaching Clinic",
    description: "Learn RC racing from our experienced coaches. Improve your lap times, master drifting techniques, and take your skills to the next level.",
    priceFrom: 500,
    priceUnit: "session",
    category: "coaching",
    featured: false,
  },
  {
    id: 5,
    name: "Drift Track Session",
    description: "Dedicated drift track session — perfect your sideways skills on our purpose-built drift circuit. Rentals available.",
    priceFrom: 250,
    priceUnit: "session",
    category: "racing",
    featured: false,
  },
  {
    id: 6,
    name: "Championship Events",
    description: "Compete in our monthly RC racing championships. Open to all skill levels. Prizes, trophies, and bragging rights await.",
    priceFrom: 300,
    priceUnit: "entry",
    category: "events",
    featured: false,
  },
];

router.get("/services", async (_req, res): Promise<void> => {
  res.json(ListServicesResponse.parse(SERVICES));
});

export default router;
