const mongoose = require('mongoose');
const { User } = require('./backend/model/userModel');

async function run() {
  await mongoose.connect('mongodb+srv://Trishal:Ele%2FSq9%3FuA.d3Z%236%21yR@cluster0.ssmpl.mongodb.net/trishal_nazrul_academy');
  const admins = await User.find({ role: { $in: ['admin', 'super-admin', 'super_admin'] } });
  console.log('Admins:', admins.map(a => ({ id: a.id, name: a.name, role: a.role })));
  
  // Also update Jasmin's name
  const jasmin = admins.find(a => a.id === 'usr-admin-jasmin' || a.name.includes('Jasmin'));
  if (jasmin) {
    jasmin.name = '(প্রধান প্রশাসক)';
    
    // Fix role to 'super-admin' if it is 'super_admin'
    if (jasmin.role === 'super_admin') {
      jasmin.role = 'super-admin';
    }

    await jasmin.save();
    console.log('Updated Jasmin name/role.');
  }

  // Update Rofikul role to 'admin' if it isn't
  const rofiqul = admins.find(a => a.name.includes('Rofikul'));
  if (rofiqul) {
    if (rofiqul.role !== 'admin') {
      rofiqul.role = 'admin';
      await rofiqul.save();
      console.log('Updated Rofikul role to admin.');
    }
  }

  mongoose.disconnect();
}
run().catch(console.error);
