const Papa = require("papaparse");

function categorize(description) {
  const desc = description.toLowerCase();
  if (/food|swiggy|zomato|restaurant/.test(desc)) return "Food";
  if (/uber|ola|bus|flight|train/.test(desc)) return "Travel";
  if (/amazon|shopping|flipkart/.test(desc)) return "Shopping";
  if (/rent|electricity|wifi|bill/.test(desc)) return "Bills";
  return "Other";
}

module.exports = function parseCSV(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        const rows = results.data.map((row) => ({
          ...row,
          Category: categorize(row.Description || "")
        }));
        resolve(rows);
      },
      error: reject
    });
  });
};
