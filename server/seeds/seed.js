import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import Job from '../models/Job.js';
import Offer from '../models/Offer.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import { seedAdmin, seedCustomers, seedWorkers } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  console.log('[Seed] Starting HomeCrew database seeding...');

  // Clear existing collections
  console.log('[Seed] Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    WorkerProfile.deleteMany({}),
    Job.deleteMany({}),
    Offer.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // 1. Create Admin
  console.log('[Seed] Seeding Admin user...');
  const adminUser = await User.create(seedAdmin);

  // 2. Create Customers
  console.log('[Seed] Seeding 5 Customers...');
  const createdCustomers = await User.insertMany(seedCustomers);

  // 3. Create 15 Workers & WorkerProfiles
  console.log('[Seed] Seeding 15 Workers with profiles & Mumbai geospatial coordinates...');
  const createdWorkerProfiles = [];

  for (const w of seedWorkers) {
    const user = await User.create(w.user);
    const profile = await WorkerProfile.create({
      ...w.profile,
      user: user._id,
    });
    createdWorkerProfiles.push({ user, profile });
  }

  // 4. Create Sample Jobs with varied statuses
  console.log('[Seed] Seeding sample jobs and offers...');
  const c1 = createdCustomers[0]; // Rahul Sharma (Bandra West)
  const c2 = createdCustomers[1]; // Pooja Kulkarni (Powai)
  const c3 = createdCustomers[2]; // Vikram Mehta (Goregaon)

  const w1 = createdWorkerProfiles[0]; // Ramesh Patil (Plumber, Bandra)
  const w2 = createdWorkerProfiles[1]; // Amit Verma (Electrician, Andheri)
  const w3 = createdWorkerProfiles[2]; // Sunita Kamble (Cook/Maid, Dadar)

  // Job 1: Completed Job with Review
  const jobCompleted = await Job.create({
    customer: c1._id,
    worker: w1.profile._id,
    service: 'Plumber',
    title: 'Kitchen Sink Tap Leakage & Water Pressure Fix',
    description: 'The kitchen sink tap has been dripping continuously and water pressure in the main valve is too low. Required urgent fix.',
    address: c1.address,
    location: c1.location,
    status: 'completed',
    initialBudget: 400,
    finalPrice: 380,
    completedAt: new Date(Date.now() - 24 * 3600 * 1000), // 1 day ago
  });

  // Review for Job 1
  await Review.create({
    job: jobCompleted._id,
    worker: w1.profile._id,
    customer: c1._id,
    rating: 5,
    comment: 'Ramesh arrived within 15 minutes! Quickly replaced the ceramic cartridge and fixed the pressure valve. Very polite and fair pricing.',
    tags: ['Punctual', 'Skilled', 'Fair Price'],
  });

  // Job 2: In-Progress Job with live tracking
  const jobInProgress = await Job.create({
    customer: c1._id,
    worker: w2.profile._id,
    service: 'Electrician',
    title: 'Main MCB Tripping & Short Circuit Inspection',
    description: 'The air conditioner circuit tripped twice this morning. Need a certified electrician to check the breaker and wiring load.',
    address: c1.address,
    location: c1.location,
    status: 'on_the_way',
    initialBudget: 500,
    finalPrice: 450,
    isUrgent: true,
  });

  // Offer for Job 2
  await Offer.create({
    job: jobInProgress._id,
    worker: w2.profile._id,
    customer: c1._id,
    amount: 450,
    status: 'accepted',
    history: [
      { by: 'worker', amount: 500, note: 'Standard diagnostic fee with safety gear', timestamp: new Date(Date.now() - 3600 * 1000) },
      { by: 'customer', amount: 450, note: 'Can you do 450 please?', timestamp: new Date(Date.now() - 3000 * 1000) },
      { by: 'worker', amount: 450, note: 'Accepted, on my way now!', timestamp: new Date(Date.now() - 2500 * 1000) },
    ],
  });

  // Job 3: Requested Job open for negotiation
  const jobRequested = await Job.create({
    customer: c2._id,
    service: 'Deep Cleaning',
    title: 'Full 2BHK Deep Cleaning before Festival',
    description: 'Looking for a verified cleaning crew for floor scrubbing, balcony wash, kitchen degreasing, and 2 bathrooms deep cleaning.',
    address: c2.address,
    location: c2.location,
    status: 'requested',
    initialBudget: 1500,
    isUrgent: true,
  });

  // Active pending Offer for Job 3
  const wCleaning = createdWorkerProfiles[6]; // Kavita Jadhav (Deep Cleaning)
  await Offer.create({
    job: jobRequested._id,
    worker: wCleaning.profile._id,
    customer: c2._id,
    amount: 1600,
    counterAmount: 1500,
    status: 'countered',
    history: [
      { by: 'worker', amount: 1600, note: 'Includes eco-friendly industrial chemicals and vacuum cleaning', timestamp: new Date(Date.now() - 1800 * 1000) },
      { by: 'customer', amount: 1500, note: 'Can we settle on ₹1500? Ready to book immediately.', timestamp: new Date(Date.now() - 900 * 1000) },
    ],
  });

  // Job 4: Cooking / Meal Service Request
  await Job.create({
    customer: c3._id,
    service: 'Maid & Cook',
    title: 'Healthy Dinner Cooking for Family of 4',
    description: 'Need evening dinner prepared: Dal Tadka, Phulkas, Bhindi Masala, and Jeera Rice. Around 7:30 PM.',
    address: c3.address,
    location: c3.location,
    status: 'requested',
    initialBudget: 350,
    isUrgent: false,
  });

  console.log('\n======================================================');
  console.log('✅ HomeCrew Database Seeded Successfully!');
  console.log('======================================================');
  console.log('👥 Admin: Phone: 9999999999 | OTP: 123456');
  console.log('👷 Demo Workers:');
  console.log('   Ramesh Patil (Plumber): Phone: 9820099881 | OTP: 123456');
  console.log('   Amit Verma (Electrician): Phone: 9820099882 | OTP: 123456');
  console.log('   Sunita Kamble (Cook): Phone: 9820099883 | OTP: 123456');
  console.log('👤 Demo Customers:');
  console.log('   Rahul Sharma: Phone: 9820011223 | OTP: 123456');
  console.log('   Pooja Kulkarni: Phone: 9820011224 | OTP: 123456');
  console.log('======================================================\n');
};

export const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
    console.error('Seed run error:', err);
  } finally {
    await disconnectDB();
  }
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed().then(() => process.exit(0));
}
