const fs = require('fs');
let code = fs.readFileSync('src/admin/components/tabs/FinanceTab.tsx', 'utf8');

const oldStr = `                  let regIncome = finance?.breakdown?.registrationFees || 0;
                  let autoDonationIncome = finance?.breakdown?.donations || 0;
                  let manualDonationIncome = 0;
                  let manualOtherIncome = 0;
                  let donationExpense = 0;
                  let regExpense = 0;
                  let otherExpense = 0;
                  
                  if (finance?.transactions) {
                    finance.transactions.forEach((t: any) => {
                      if (t.type === 'income') {
                        if (t.fundSource === 'donation') manualDonationIncome += Number(t.amount);
                        else manualOtherIncome += Number(t.amount);
                      } else if (t.type === 'expense') {
                        if (t.fundSource === 'donation') donationExpense += Number(t.amount);
                        else if (t.fundSource === 'registration') regExpense += Number(t.amount);
                        else otherExpense += Number(t.amount);
                      }
                    });
                  }
                  
                  const currentDonationFund = autoDonationIncome + manualDonationIncome - donationExpense;
                  
                  const grandTotalIncome = regIncome + autoDonationIncome + manualDonationIncome + manualOtherIncome;
                  const grandTotalExpense = regExpense + donationExpense + otherExpense;
                  const grandBalance = grandTotalIncome - grandTotalExpense;

                  return (`;

const newStr = `                  let regIncome = finance?.breakdown?.registrationFees || 0;
                  let manualOtherIncome = 0;
                  let regExpense = 0;
                  let otherExpense = 0;
                  
                  if (finance?.transactions) {
                    finance.transactions.forEach((t: any) => {
                      if (t.type === 'income') {
                        if (t.fundSource !== 'donation') manualOtherIncome += Number(t.amount);
                      } else if (t.type === 'expense') {
                        if (t.fundSource === 'registration') regExpense += Number(t.amount);
                        else if (t.fundSource !== 'donation') otherExpense += Number(t.amount);
                      }
                    });
                  }
                  
                  // Use the global donation fund supplied by backend
                  const currentDonationFund = finance?.globalDonationFund || 0;
                  
                  const grandTotalIncome = regIncome + manualOtherIncome;
                  const grandTotalExpense = regExpense + otherExpense;
                  const grandBalance = grandTotalIncome - grandTotalExpense;

                  return (`;

code = code.replace(oldStr.replace(/\r\n/g, '\n'), newStr.replace(/\r\n/g, '\n'));
code = code.replace(oldStr, newStr);

fs.writeFileSync('src/admin/components/tabs/FinanceTab.tsx', code);
console.log('Fixed FinanceTab');
