const fs = require('fs');

let code = fs.readFileSync('backend/controller/adminController.ts', 'utf8');

// Replace in getFinance
const getFinanceOld = `    // Calculate donations
    let donorMatchQuery: any = { status: 'approved' };
    if (query.reunionId) {
      donorMatchQuery.reunionId = query.reunionId;
    }
    
    const donorAgg = await Donor.aggregate([
      { $match: donorMatchQuery },
      { $group: { _id: null, total: { $sum: { $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 } } } } }
    ]);
    const totalDonations = donorAgg[0] ? donorAgg[0].total : 0;

    // Calculate transaction sums
    let manualIncome = 0;
    let manualExpense = 0;
    if (finance.transactions && Array.isArray(finance.transactions)) {
      finance.transactions.forEach((t: any) => {
        if (t.type === 'income' && t.source !== 'Registration' && t.source !== 'Donation') manualIncome += (Number(t.amount) || 0);
        if (t.type === 'expense') manualExpense += (Number(t.amount) || 0);
      });
    }

    finance.totalIncome = manualIncome + totalStudentIncome;
    finance.totalExpense = manualExpense;
    finance.balance = finance.totalIncome - finance.totalExpense;

    // Update the breakdown explicitly
    finance.breakdown = {
      ...((!Array.isArray(finance.breakdown) && finance.breakdown) || {}),
      registrationFees: totalStudentIncome,
      donations: totalDonations
    };

    res.json({ success: true, data: finance });`;

const getFinanceNew = `    // Calculate global donations from donors
    const donorAgg = await Donor.aggregate([
      { $match: { status: 'approved' } }, // Force global donation
      { $group: { _id: null, total: { $sum: { $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 } } } } }
    ]);
    const totalDonations = donorAgg[0] ? donorAgg[0].total : 0;

    // Calculate global manual donations across all events
    const allFinances = await Finance.find({});
    let globalManualDonationIncome = 0;
    let globalDonationExpense = 0;
    
    allFinances.forEach((f: any) => {
      if (f.transactions && Array.isArray(f.transactions)) {
        f.transactions.forEach((t: any) => {
          if (t.type === 'income' && t.fundSource === 'donation') globalManualDonationIncome += (Number(t.amount) || 0);
          if (t.type === 'expense' && t.fundSource === 'donation') globalDonationExpense += (Number(t.amount) || 0);
        });
      }
    });

    const globalDonationFund = totalDonations + globalManualDonationIncome - globalDonationExpense;

    // Calculate transaction sums for CURRENT EVENT
    let manualIncome = 0;
    let manualExpense = 0;
    if (finance.transactions && Array.isArray(finance.transactions)) {
      finance.transactions.forEach((t: any) => {
        if (t.type === 'income' && t.source !== 'Registration' && t.source !== 'Donation') manualIncome += (Number(t.amount) || 0);
        if (t.type === 'expense') manualExpense += (Number(t.amount) || 0);
      });
    }

    finance.totalIncome = manualIncome + totalStudentIncome;
    finance.totalExpense = manualExpense;
    finance.balance = finance.totalIncome - finance.totalExpense;

    // Update the breakdown explicitly
    finance.breakdown = {
      ...((!Array.isArray(finance.breakdown) && finance.breakdown) || {}),
      registrationFees: totalStudentIncome,
      donations: totalDonations
    };

    // Return finance as object and attach globalDonationFund
    res.json({ 
      success: true, 
      data: {
        ...(typeof finance.toObject === 'function' ? finance.toObject() : finance),
        globalDonationFund
      } 
    });`;

// Replace in getGlobalFinance
const getGlobalFinanceOld = `    const finances = await Finance.find({});
    let totalManualIncome = 0;
    let totalManualExpense = 0;
    finances.forEach((f: any) => {
      if (f.transactions && Array.isArray(f.transactions)) {
        f.transactions.forEach((t: any) => {
          if (t.type === 'income' && t.source !== 'Registration' && t.source !== 'Donation') totalManualIncome += (Number(t.amount) || 0);
          if (t.type === 'expense') totalManualExpense += (Number(t.amount) || 0);
        });
      }
    });

    const grandTotalIncome = totalRegistrationIncome + totalDonationIncome + totalManualIncome;
    const grandTotalExpense = totalManualExpense;
    const grandBalance = grandTotalIncome - grandTotalExpense;

    res.json({
      success: true,
      totalStudents,
      totalRegistrationIncome,
      totalDonationIncome,
      totalManualIncome,
      grandTotalIncome,
      grandTotalExpense,
      grandBalance
    });`;

const getGlobalFinanceNew = `    const finances = await Finance.find({});
    let totalManualIncome = 0;
    let totalManualExpense = 0;
    let globalManualDonationIncome = 0;
    let globalDonationExpense = 0;
    
    finances.forEach((f: any) => {
      if (f.transactions && Array.isArray(f.transactions)) {
        f.transactions.forEach((t: any) => {
          if (t.type === 'income') {
            if (t.fundSource === 'donation') globalManualDonationIncome += (Number(t.amount) || 0);
            if (t.source !== 'Registration' && t.source !== 'Donation') totalManualIncome += (Number(t.amount) || 0);
          }
          if (t.type === 'expense') {
            if (t.fundSource === 'donation') globalDonationExpense += (Number(t.amount) || 0);
            totalManualExpense += (Number(t.amount) || 0);
          }
        });
      }
    });

    const globalDonationFund = totalDonationIncome + globalManualDonationIncome - globalDonationExpense;
    
    const grandTotalIncome = totalRegistrationIncome + totalDonationIncome + totalManualIncome;
    const grandTotalExpense = totalManualExpense;
    const grandBalance = grandTotalIncome - grandTotalExpense;

    res.json({
      success: true,
      totalStudents,
      totalRegistrationIncome,
      totalDonationIncome,
      totalManualIncome,
      grandTotalIncome,
      grandTotalExpense,
      grandBalance,
      globalDonationFund
    });`;

// Do replacement using normalized newlines
let normalizedCode = code.replace(/\\r\\n/g, '\\n');
const nGetFinanceOld = getFinanceOld.replace(/\\r\\n/g, '\\n');
const nGetFinanceNew = getFinanceNew.replace(/\\r\\n/g, '\\n');
const nGetGlobalFinanceOld = getGlobalFinanceOld.replace(/\\r\\n/g, '\\n');
const nGetGlobalFinanceNew = getGlobalFinanceNew.replace(/\\r\\n/g, '\\n');

let changes = 0;
if (normalizedCode.includes(nGetFinanceOld)) {
  normalizedCode = normalizedCode.replace(nGetFinanceOld, nGetFinanceNew);
  changes++;
} else {
  console.log('getFinance match failed');
}

if (normalizedCode.includes(nGetGlobalFinanceOld)) {
  normalizedCode = normalizedCode.replace(nGetGlobalFinanceOld, nGetGlobalFinanceNew);
  changes++;
} else {
  console.log('getGlobalFinance match failed');
}

if (changes > 0) {
  fs.writeFileSync('backend/controller/adminController.ts', normalizedCode);
  console.log('Success backend update');
}
