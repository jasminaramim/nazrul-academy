const fs = require('fs');

let code = fs.readFileSync('src/admin/components/tabs/OverviewTab.tsx', 'utf8');

const targetStr = `                {(() => {
                  let grandDonationFund = 0;
                  let grandTotalIncome = 0;
                  let grandOtherIncome = 0;
                  let grandTotalExpense = 0;
                  let grandBalance = 0;
                  let regIncome = 0;

                  if (selectedReunionId && activeFinance) {
                    regIncome = activeFinance.breakdown?.registrationFees || 0;
                    const autoDonation = activeFinance.breakdown?.donations || 0;
                    
                    let manDonInc = 0;
                    let manOthInc = 0;
                    let donExp = 0;
                    let regExp = 0;
                    let othExp = 0;
                    
                    if (activeFinance.transactions) {
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

                    grandDonationFund = autoDonation + manDonInc - donExp;
                    grandOtherIncome = manOthInc;
                    grandTotalIncome = regIncome + autoDonation + manDonInc + manOthInc;
                    grandTotalExpense = regExp + donExp + othExp;
                    grandBalance = grandTotalIncome - grandTotalExpense;
                  } else {
                    regIncome = globalFinance?.totalRegistrationIncome || 0;
                    grandDonationFund = globalFinance?.totalDonationIncome || 0; 
                    grandTotalIncome = globalFinance?.grandTotalIncome || 0;
                    grandOtherIncome = globalFinance?.totalManualIncome || 0;
                    grandTotalExpense = globalFinance?.grandTotalExpense || 0;
                    grandBalance = grandTotalIncome - grandTotalExpense;
                  }

                  return (
                    <>`;

const newStr = `                {(() => {
                  let grandDonationFund = 0;
                  let grandTotalIncome = 0;
                  let grandOtherIncome = 0;
                  let grandTotalExpense = 0;
                  let grandBalance = 0;
                  let regIncome = 0;

                  if (selectedReunionId && activeFinance) {
                    regIncome = activeFinance.breakdown?.registrationFees || 0;
                    grandDonationFund = activeFinance.globalDonationFund || 0;
                    
                    let manOthInc = 0;
                    let regExp = 0;
                    let othExp = 0;
                    
                    if (activeFinance.transactions) {
                      activeFinance.transactions.forEach((t: any) => {
                        if (t.type === 'income') {
                          if (t.fundSource !== 'donation') manOthInc += Number(t.amount);
                        } else if (t.type === 'expense') {
                          if (t.fundSource === 'registration') regExp += Number(t.amount);
                          else if (t.fundSource !== 'donation') othExp += Number(t.amount);
                        }
                      });
                    }

                    grandOtherIncome = manOthInc;
                    // For specific event, we don't add the global donation fund to the event's specific grand total 
                    // because that would distort the event's own income. But since user wants it simple, let's keep event totals separate from global donation?
                    // Wait, user wants donation to be global.
                    // Total income of event = regIncome + event's other income. 
                    grandTotalIncome = regIncome + manOthInc;
                    grandTotalExpense = regExp + othExp;
                    grandBalance = grandTotalIncome - grandTotalExpense;
                  } else {
                    regIncome = globalFinance?.totalRegistrationIncome || 0;
                    grandDonationFund = globalFinance?.globalDonationFund || 0; 
                    grandTotalIncome = globalFinance?.grandTotalIncome || 0;
                    grandOtherIncome = globalFinance?.totalManualIncome || 0;
                    grandTotalExpense = globalFinance?.grandTotalExpense || 0;
                    grandBalance = grandTotalIncome - grandTotalExpense;
                  }

                  return (
                    <>`;

let normalizedCode = code.replace(/\r\n/g, '\n');
const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
const normalizedNewStr = newStr.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedTarget)) {
    code = normalizedCode.replace(normalizedTarget, normalizedNewStr);
    fs.writeFileSync('src/admin/components/tabs/OverviewTab.tsx', code);
    console.log('Success injected OverviewTab');
} else {
    console.log('Failed to find in OverviewTab');
}
