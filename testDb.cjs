const mongoose = require('mongoose');
const { User } = require('./backend/model/userModel');

async function run() {
  await mongoose.connect('mongodb+srv://Trishal:Ele%2FSq9%3FuA.d3Z%236%21yR@cluster0.ssmpl.mongodb.net/trishal_nazrul_academy');
  const admins = await User.find({ role: { $in: ['admin', 'super-admin', 'super_admin'] } });
  
  for (const admin of admins) {
    console.log('Document:', admin.toObject());
    console.log('Virtual id:', admin.id);
    console.log('ObjectId:', admin._id.toString());
  }

  mongoose.disconnect();
}
run().catch(console.error);
