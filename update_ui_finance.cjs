const fs = require('fs');

let code = fs.readFileSync('src/admin/components/tabs/FinanceTab.tsx', 'utf8');

const targetStr = `            {(() => {
              let regIncome = activeFinance?.breakdown?.registrationFees || 0;
              let autoDonation = activeFinance?.breakdown?.donations || 0;
              
              let manDonInc = 0;
              let manOthInc = 0;
              let donExp = 0;
              let regExp = 0;
              let othExp = 0;
              
              if (activeFinance?.transactions) {
                activeFinance.transactions.forEach((t: any) => {
                  if (t.type === 'income') {
                    if (t.fundSource === 'donation') manDonInc += Number(t.amount);
                    else manOthInc += Number(t.amount);
                  } else if (t.type === 'expense') {
                    if (t.fundSource === 'donation') donExp += Number(t.amount);
                    else if (t.fundSource === 'registration') regExp += Number(t.amount);
                    else othExp += Number(t.amount);
                  }
                });
              }

              const currentDonationFund = autoDonation + manDonInc - donExp;
              const totalIncome = regIncome + autoDonation + manDonInc + manOthInc;
              const totalExpense = regExp + donExp + othExp;
              const currentBalance = totalIncome - totalExpense;

              return (`;

const newStr = `            {(() => {
              let regIncome = activeFinance?.breakdown?.registrationFees || 0;
              
              let manOthInc = 0;
              let regExp = 0;
              let othExp = 0;
              
              if (activeFinance?.transactions) {
                activeFinance.transactions.forEach((t: any) => {
                  if (t.type === 'income') {
                    if (t.fundSource !== 'donation') manOthInc += Number(t.amount);
                  } else if (t.type === 'expense') {
                    if (t.fundSource === 'registration') regExp += Number(t.amount);
                    else if (t.fundSource !== 'donation') othExp += Number(t.amount);
                  }
                });
              }

              const currentDonationFund = activeFinance?.globalDonationFund || 0;
              // Event's total income excludes global donation to keep it accurate for the event
              const totalIncome = regIncome + manOthInc;
              const totalExpense = regExp + othExp;
              const currentBalance = totalIncome - totalExpense;

              return (`;

let normalizedCode = code.replace(/\r\n/g, '\n');
const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
const normalizedNewStr = newStr.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedTarget)) {
    code = normalizedCode.replace(normalizedTarget, normalizedNewStr);
    fs.writeFileSync('src/admin/components/tabs/FinanceTab.tsx', code);
    console.log('Success injected FinanceTab');
} else {
    console.log('Failed to find in FinanceTab');
}
