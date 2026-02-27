const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const nudgeEngine = require("./utils/nudgeEngine");

let storedTransactions = [];
const app = express();

app.use(cors());
app.use(express.json());

// Simple rule-based categorization fallback
function categorizeTransaction(description) {
  const desc = description.toLowerCase();
  
  if (desc.includes('salary') || desc.includes('income') || desc.includes('credit') || desc.includes('reimbursement') || desc.includes('payment from')) {
    return 'Income';
  }
  if (desc.includes('food') || desc.includes('restaurant') || desc.includes('swiggy') || desc.includes('zomato') || desc.includes('cafe') || desc.includes('starbucks')) {
    return 'Food';
  }
  if (desc.includes('uber') || desc.includes('ola') || desc.includes('taxi') || desc.includes('flight') || desc.includes('train') || desc.includes('bus') || desc.includes('irctc') || desc.includes('indigo')) {
    return 'Travel';
  }
  if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('myntra') || desc.includes('shopping') || desc.includes('mall')) {
    return 'Shopping';
  }
  if (desc.includes('electricity') || desc.includes('mobile') || desc.includes('bill') || desc.includes('netflix') || desc.includes('hotstar') || desc.includes('subscription') || desc.includes('airtel')) {
    return 'Bills';
  }
  if (desc.includes('hospital') || desc.includes('doctor') || desc.includes('medicine') || desc.includes('pharmacy') || desc.includes('pharmeasy') || desc.includes('health')) {
    return 'Health';
  }
  if (desc.includes('grocery') || desc.includes('dmart') || desc.includes('bigbasket') || desc.includes('supermarket') || desc.includes('vegetables')) {
    return 'Groceries';
  }
  
  return 'Shopping'; // Default category
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello Saurabh from server!' });
});

const uploadRoute = require('./routes/uploadRoute');
app.use('/api', uploadRoute);

const upload = multer({ dest: "uploads/" });

// app.post("/analyze-transactions", upload.single("csvFile"), async (req, res) => {
//   try {
//     const csvFilePath = req.file.path;
//     const transactions = [];

//     await new Promise((resolve, reject) => {
//       fs.createReadStream(csvFilePath)
//         .pipe(csv())
//         .on("data", (row) => {
//           const description = row.Description || row.description || row["Transaction Description"];
//           const amount = parseFloat(row.Amount || row.amount || row["Transaction Amount"] || 0);
//           const date = row.Date || row.date || row["Transaction Date"] || "Unknown Date";
//           const drcr = row["DR/CR"] || "DR";
//           transactions.push({ description, amount: Math.abs(amount), date, drcr });
//         })
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     fs.unlinkSync(csvFilePath);

//     // Prepare prompt for Gemini
//     const prompt = `Categorize the following transactions strictly into: Food, Travel, Shopping, Bills, Health, Groceries, Income.
// Return JSON like:
// [{ "description": "...", "category": "...", "amount": ..., "date": "..." }]
// Data:
// ${transactions.map((t, i) => `${i + 1}. ${t.description} | Amount: ${t.amount} | Date: ${t.date}`).join("\n")}`;

//     const geminiResponse = await axios.post(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//       }
//     );

//     const text = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
//     const jsonText = text.substring(text.indexOf("["), text.lastIndexOf("]") + 1);
//     const categorized = JSON.parse(jsonText);

//     // === Custom Analytics ===
//     const isCredit = (t) => t.drcr === "CR";
//     const isDebit = (t) => t.drcr === "DR";

//     const totalInflow = transactions.filter(isCredit).reduce((acc, t) => acc + t.amount, 0);
//     const totalOutflow = transactions.filter(isDebit).reduce((acc, t) => acc + t.amount, 0);

//     // Unique merchants = one-time expenses
//     const merchantCounts = {};
//     transactions.forEach((t) => {
//       const name = t.description;
//       merchantCounts[name] = (merchantCounts[name] || 0) + 1;
//     });
//     const oneTimeExpenses = transactions.filter((t) => merchantCounts[t.description] === 1 && t.drcr === "DR");

//     // Bill Calendar (using keywords)
//     const billCalendar = transactions
//       .filter((t) => /electricity|mobile|netflix|bill/i.test(t.description))
//       .map((t) => ({ description: t.description, date: t.date }));

//     // Expense Reduction Advice
//     const categoryTotals = {};
//     categorized.forEach((t) => {
//       if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
//       categoryTotals[t.category] += t.amount;
//     });
//     const reduceAdvice = Object.entries(categoryTotals)
//       .filter(([cat, amt]) => amt > 1000 && cat !== "Income")
//       .map(([cat, amt]) => `Try reducing ${cat} spend of ₹${amt.toFixed(0)} to ₹${(amt * 0.7).toFixed(0)}.`);

//     // Half month comparison
//     const firstHalf = transactions.filter((t) => parseInt(t.date.split("-")[2]) <= 15 && t.drcr === "DR");
//     const secondHalf = transactions.filter((t) => parseInt(t.date.split("-")[2]) > 15 && t.drcr === "DR");
//     const firstTotal = firstHalf.reduce((acc, t) => acc + t.amount, 0);
//     const secondTotal = secondHalf.reduce((acc, t) => acc + t.amount, 0);

//     // Cash crunch (balance drops)
//     const cashCrunch = transactions.some((t) => parseFloat(t.Balance || 10000) < 1000);

//     // Financial Health Score (simple metric)
//     let score = 100;
//     if (totalOutflow > totalInflow) score -= 20;
//     if (cashCrunch) score -= 15;
//     if (reduceAdvice.length >= 3) score -= 10;

//     // "If you saved this" sim (top 3 spends)
//     const topSpends = transactions
//       .filter(isDebit)
//       .sort((a, b) => b.amount - a.amount)
//       .slice(0, 3)
//       .map((t) => t.amount);
//     const savedTotal = topSpends.reduce((a, b) => a + b, 0);
//     const simulatedAmount = (savedTotal * 1.07).toFixed(2); // 7% interest

//     // AI Suggestion
//     const advicePrompt = `Based on this data: inflow ₹${totalInflow}, outflow ₹${totalOutflow}, top categories: ${Object.keys(categoryTotals).join(", ")}. Suggest 1 smart tip.`;
//     const tipRes = await axios.post(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ role: "user", parts: [{ text: advicePrompt }] }],
//       }
//     );
//     const aiTip = tipRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "Spend wisely!";

//     // === Final Response ===
//     res.json({
//       categorized,
//       analytics: {
//         totalInflow,
//         totalOutflow,
//         oneTimeExpenses,
//         billCalendar,
//         reduceAdvice,
//         halfMonthComparison: { firstHalf: firstTotal, secondHalf: secondTotal },
//         cashCrunch,
//         financialHealthScore: score,
//         ifSavedTop3: {
//           saved: savedTotal.toFixed(2),
//           afterInterest: simulatedAmount,
//         },
//         aiTip,
//       },
//     });
//   } catch (error) {
//     console.error("Analysis error:", error.message);
//     res.status(500).json({ error: "Failed to analyze transactions" });
//   }
// });

app.post("/analyze-transactions", upload.single("csvFile"), async (req, res) => {
  try {
    console.log("📁 File upload received");
    
    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    console.log("📄 File path:", req.file.path);
    const csvFilePath = req.file.path;
    const transactions = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          const description = row.Description || row.description || row["Transaction Description"];
          const amount = parseFloat(row.Amount || row.amount || row["Transaction Amount"] || 0);
          const date = row.Date || row.date || row["Transaction Date"] || "Unknown Date";
          const drcr = row["DR/CR"] || "DR";
          transactions.push({ description, amount: Math.abs(amount), date, drcr });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`✅ Parsed ${transactions.length} transactions`);
    fs.unlinkSync(csvFilePath);

    // Check for Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment");
      return res.status(500).json({ error: "Server configuration error: Missing API key" });
    }

    // Prepare prompt for Gemini
    const prompt = `Categorize the following transactions strictly into: Food, Travel, Shopping, Bills, Health, Groceries, Income.
Return JSON like:
[{ "description": "...", "category": "...", "amount": ..., "date": "..." }]
Data:
${transactions.map((t, i) => `${i + 1}. ${t.description} | Amount: ${t.amount} | Date: ${t.date}`).join("\n")}`;

    let categorized;
    let usingFallback = false;

    try {
      console.log("🤖 Calling Gemini API for categorization...");
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        },
        {
          timeout: 10000 // 10 second timeout
        }
      );

      console.log("✅ Gemini API response received");
      const text = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      console.log("📝 Raw Gemini response:", text.substring(0, 200) + "...");
      
      const jsonText = text.substring(text.indexOf("["), text.lastIndexOf("]") + 1);
      categorized = JSON.parse(jsonText);
    } catch (geminiError) {
      console.error("❌ Gemini API Error:", geminiError.response?.data?.error || geminiError.message);
      console.log("⚠️ Using fallback categorization...");
      usingFallback = true;
      
      // Fallback: Use simple rule-based categorization
      categorized = transactions.map(t => ({
        description: t.description,
        category: categorizeTransaction(t.description),
        amount: t.amount,
        date: t.date
      }));
    }

    // === Custom Analytics ===
    const isCredit = (t) => t.drcr === "CR";
    const isDebit = (t) => t.drcr === "DR";

    const totalInflow = transactions.filter(isCredit).reduce((acc, t) => acc + t.amount, 0);
    const totalOutflow = transactions.filter(isDebit).reduce((acc, t) => acc + t.amount, 0);

    const merchantCounts = {};
    transactions.forEach((t) => {
      const name = t.description;
      merchantCounts[name] = (merchantCounts[name] || 0) + 1;
    });
    const oneTimeExpenses = transactions.filter((t) => merchantCounts[t.description] === 1 && t.drcr === "DR");

    const billCalendar = transactions
      .filter((t) => /electricity|mobile|netflix|bill/i.test(t.description))
      .map((t) => ({ description: t.description, date: t.date }));

    const categoryTotals = {};
    categorized.forEach((t) => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += t.amount;
    });
    const reduceAdvice = Object.entries(categoryTotals)
      .filter(([cat, amt]) => amt > 1000 && cat !== "Income")
      .map(([cat, amt]) => `Try reducing ${cat} spend of ₹${amt.toFixed(0)} to ₹${(amt * 0.7).toFixed(0)}.`);

    const firstHalf = transactions.filter((t) => parseInt(t.date.split("-")[2]) <= 15 && t.drcr === "DR");
    const secondHalf = transactions.filter((t) => parseInt(t.date.split("-")[2]) > 15 && t.drcr === "DR");
    const firstTotal = firstHalf.reduce((acc, t) => acc + t.amount, 0);
    const secondTotal = secondHalf.reduce((acc, t) => acc + t.amount, 0);

    const cashCrunch = transactions.some((t) => parseFloat(t.Balance || 10000) < 1000);

    let score = 100;
    if (totalOutflow > totalInflow) score -= 20;
    if (cashCrunch) score -= 15;
    if (reduceAdvice.length >= 3) score -= 10;

    const topSpends = transactions
      .filter(isDebit)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map((t) => t.amount);
    const savedTotal = topSpends.reduce((a, b) => a + b, 0);
    const simulatedAmount = (savedTotal * 1.07).toFixed(2);

    let aiTip = "Spend wisely!";
    
    if (!usingFallback) {
      try {
        const advicePrompt = `Based on this data: inflow ₹${totalInflow}, outflow ₹${totalOutflow}, top categories: ${Object.keys(categoryTotals).join(", ")}. Suggest 1 smart tip.`;
        const tipRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ role: "user", parts: [{ text: advicePrompt }] }],
          },
          {
            timeout: 10000
          }
        );
        aiTip = tipRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "Spend wisely!";
      } catch (tipError) {
        console.error("❌ AI tip generation failed:", tipError.message);
        aiTip = "Track your expenses regularly and look for areas to reduce spending.";
      }
    } else {
      aiTip = "Track your expenses regularly and look for areas to reduce spending.";
    }

    // === NEW: Store data for use in other APIs ===
    storedTransactions = categorized;

    res.json({
      categorized,
      analytics: {
        totalInflow,
        totalOutflow,
        oneTimeExpenses,
        billCalendar,
        reduceAdvice,
        halfMonthComparison: { firstHalf: firstTotal, secondHalf: secondTotal },
        top3Spends: topSpends,
        score,
        simulatedSavedAmount: simulatedAmount,
        aiTip
      },
      warning: usingFallback ? "AI categorization unavailable. Using rule-based categorization." : null
    });

  } catch (error) {
    console.error("❌ Error analyzing transactions:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
});







//ai-space - Enhanced with personality and context
app.post("/ask-question", async (req, res) => {
  try {
    console.log("💬 Chatbot question received");
    const userQuestion = req.body.question;

    if (!userQuestion) {
      console.error("❌ No question provided");
      return res.status(400).json({ error: "Question is required" });
    }

    if (storedTransactions.length === 0) {
      console.error("❌ No transactions available");
      return res.status(400).json({ error: "No transactions available. Upload CSV first." });
    }

    console.log(`📊 Processing question with ${storedTransactions.length} transactions`);

    // Build a smart financial summary
    const incomeTransactions = storedTransactions.filter(t => t.category === "Income");
    const expenseTransactions = storedTransactions.filter(t => t.category !== "Income");

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

    // Group expenses by category for better suggestion
    const expenseBreakdown = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    // Find top spending categories
    const topCategories = Object.entries(expenseBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat, amt]) => `${cat} (₹${amt.toFixed(0)})`);

    // Detect spending patterns
    const foodDeliveryCount = storedTransactions.filter(t => 
      /swiggy|zomato/i.test(t.description)
    ).length;

    const summaryText = `
You are a witty, friendly financial advisor with a sense of humor. Be conversational and relatable.

USER'S FINANCIAL SNAPSHOT:
- Monthly Income: ₹${totalIncome.toFixed(0)}
- Total Expenses: ₹${totalExpenses.toFixed(0)}
- Savings Rate: ${savingsRate}%
- Top Spending: ${topCategories.join(", ")}
${foodDeliveryCount > 0 ? `- Food Delivery Orders: ${foodDeliveryCount} times` : ''}

EXPENSE BREAKDOWN:
${Object.entries(expenseBreakdown).map(([cat, amt]) => `- ${cat}: ₹${amt.toFixed(0)}`).join("\n")}

USER QUESTION: "${userQuestion}"

INSTRUCTIONS:
- Answer in a friendly, conversational tone with occasional humor
- Be specific with numbers from their data
- If they ask about affordability, calculate if they can afford it based on their savings
- Suggest practical alternatives if they're overspending
- Keep responses concise (3-5 sentences max)
- Use emojis sparingly for emphasis
- NO bold or markdown formatting, just plain text
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: summaryText }] }],
      }
    );

    const answer = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate an answer.";

    console.log("✅ Chatbot response generated");
    res.json({ answer });
  } catch (error) {
    console.error("❌ Error in /ask-question:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      error: "Failed to answer the question",
      details: error.message 
    });
  }
});

// Get real-time nudges and insights
app.post("/get-nudges", async (req, res) => {
  try {
    console.log("🎯 Nudge request received");
    
    if (storedTransactions.length === 0) {
      return res.json({
        nudges: [],
        achievements: [],
        financialScore: 0,
        categorySpending: {},
        message: "Upload transactions first to get personalized nudges"
      });
    }

    const { budgetLimits } = req.body;
    
    // Generate nudges
    const nudges = nudgeEngine.generateNudges(storedTransactions, budgetLimits || {});
    
    // Calculate achievements
    const achievements = nudgeEngine.calculateAchievements(storedTransactions);
    
    // Calculate financial score
    const financialScore = nudgeEngine.calculateFinancialScore(storedTransactions, budgetLimits || {});
    
    // Get category spending
    const categorySpending = nudgeEngine.analyzeCategorySpending(storedTransactions);

    console.log(`✅ Generated ${nudges.length} nudges, ${achievements.length} achievements`);
    
    res.json({
      nudges,
      achievements,
      financialScore,
      categorySpending
    });
  } catch (error) {
    console.error("❌ Error generating nudges:", error.message);
    res.status(500).json({ 
      error: "Failed to generate nudges",
      details: error.message 
    });
  }
});

// Get smart alternatives for a transaction
app.post("/get-alternatives", async (req, res) => {
  try {
    const { transaction } = req.body;
    
    if (!transaction) {
      return res.status(400).json({ error: "Transaction data required" });
    }

    const alternative = nudgeEngine.generateAlternatives(transaction);
    
    res.json({ alternative });
  } catch (error) {
    console.error("❌ Error generating alternatives:", error.message);
    res.status(500).json({ 
      error: "Failed to generate alternatives",
      details: error.message 
    });
  }
});

// Predict overspending
app.post("/predict-overspending", async (req, res) => {
  try {
    if (storedTransactions.length === 0) {
      return res.status(400).json({ error: "No transactions available" });
    }

    const { budgetLimits } = req.body;
    const currentDay = new Date().getDate();
    
    const predictions = [];
    const categorySpending = nudgeEngine.analyzeCategorySpending(storedTransactions);
    
    Object.entries(categorySpending).forEach(([category, spent]) => {
      const limit = budgetLimits?.[category];
      if (limit) {
        const projectedSpending = (spent / currentDay) * 30;
        const willOverspend = projectedSpending > limit;
        
        if (willOverspend) {
          predictions.push({
            category,
            currentSpent: spent,
            projectedSpending: projectedSpending.toFixed(0),
            limit,
            overspendAmount: (projectedSpending - limit).toFixed(0),
            warning: `⚠️ At current pace, you'll exceed ${category} budget by ₹${(projectedSpending - limit).toFixed(0)}`
          });
        }
      }
    });

    res.json({ predictions });
  } catch (error) {
    console.error("❌ Error predicting overspending:", error.message);
    res.status(500).json({ 
      error: "Failed to predict overspending",
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/hello`);
  console.log(`   - POST http://localhost:${PORT}/analyze-transactions`);
  console.log(`   - POST http://localhost:${PORT}/ask-question`);
  console.log(`   - POST http://localhost:${PORT}/get-nudges`);
  console.log(`   - POST http://localhost:${PORT}/get-alternatives`);
  console.log(`   - POST http://localhost:${PORT}/predict-overspending`);
  console.log(`\n✅ CORS enabled for all origins`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}\n`);
});


// === NEW: Real-Time Nudge Generation ===
app.post("/generate-nudges", async (req, res) => {
  try {
    if (storedTransactions.length === 0) {
      return res.status(400).json({ error: "No transactions available. Upload CSV first." });
    }

    const { budgets } = req.body; // Expected: [{ category, limit, spent }]
    
    const nudges = [];
    const humorousMessages = {
      high: [
        "🚨 BREAKING: Your {category} budget just called 911!",
        "⚠️ Plot twist: Your wallet is filing for bankruptcy because of {category}!",
        "🎭 {category} spending at {percentage}%! Even your bank account is shocked!",
        "🔥 Your {category} expenses are on fire! And not in a good way!",
        "💸 Houston, we have a problem! {category} budget is in the danger zone!",
        "🆘 Your {category} spending needs an intervention. Like, right now!"
      ],
      medium: [
        "📊 {category} at {percentage}%. Time to pump the brakes a little!",
        "💡 Fun fact: You're {percentage}% through your {category} budget!",
        "⚡ {category} spending is heating up. Cool it down a bit?",
        "🎯 {category} budget halfway gone. Let's be strategic here!",
        "⏰ Tick tock! {category} budget is running out faster than expected!"
      ],
      low: [
        "🎉 {category} budget looking good! You're a financial ninja!",
        "⭐ Crushing it! Only {percentage}% of {category} budget used!",
        "🏆 {category} spending is under control. You're a legend!",
        "💪 {category} game strong! Keep up the excellent work!",
        "✨ {category} spending? More like {category} SAVING! Nice job!"
      ]
    };

    budgets.forEach(budget => {
      const percentage = (budget.spent / budget.limit) * 100;
      let type = "info";
      let messageArray = humorousMessages.low;
      
      if (percentage >= 90) {
        type = "danger";
        messageArray = humorousMessages.high;
      } else if (percentage >= 75) {
        type = "warning";
        messageArray = humorousMessages.high;
      } else if (percentage >= 50) {
        type = "warning";
        messageArray = humorousMessages.medium;
      }

      const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
      const message = randomMessage
        .replace("{category}", budget.category)
        .replace("{percentage}", Math.round(percentage));

      nudges.push({
        category: budget.category,
        message,
        type,
        percentage: Math.round(percentage),
        remaining: budget.limit - budget.spent
      });
    });

    res.json({ nudges });
  } catch (error) {
    console.error("❌ Error generating nudges:", error.message);
    res.status(500).json({ error: "Failed to generate nudges" });
  }
});

// === NEW: Predictive Overspending Detection ===
app.post("/predict-overspending", async (req, res) => {
  try {
    if (storedTransactions.length === 0) {
      return res.status(400).json({ error: "No transactions available. Upload CSV first." });
    }

    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Calculate spending velocity
    const expenseTransactions = storedTransactions.filter(t => t.category !== "Income");
    const totalSpent = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const dailyAverage = totalSpent / currentDay;
    const projectedMonthlySpend = dailyAverage * daysInMonth;
    
    // Get category-wise predictions
    const categoryPredictions = {};
    expenseTransactions.forEach(t => {
      if (!categoryPredictions[t.category]) {
        categoryPredictions[t.category] = 0;
      }
      categoryPredictions[t.category] += t.amount;
    });

    const predictions = Object.entries(categoryPredictions).map(([category, spent]) => {
      const dailyAvg = spent / currentDay;
      const projected = dailyAvg * daysInMonth;
      return {
        category,
        currentSpent: spent,
        projectedSpend: Math.round(projected),
        dailyAverage: Math.round(dailyAvg)
      };
    });

    const warnings = [];
    if (projectedMonthlySpend > totalSpent * 1.5) {
      warnings.push({
        type: "danger",
        message: `⚠️ At your current pace, you'll spend ₹${Math.round(projectedMonthlySpend)} this month! That's ${Math.round((projectedMonthlySpend / totalSpent - 1) * 100)}% more than expected!`
      });
    }

    res.json({
      currentDay,
      daysInMonth,
      totalSpent: Math.round(totalSpent),
      dailyAverage: Math.round(dailyAverage),
      projectedMonthlySpend: Math.round(projectedMonthlySpend),
      predictions,
      warnings
    });
  } catch (error) {
    console.error("❌ Error predicting overspending:", error.message);
    res.status(500).json({ error: "Failed to predict overspending" });
  }
});

// === NEW: Smart Alternatives Suggestion ===
app.post("/suggest-alternatives", async (req, res) => {
  try {
    if (storedTransactions.length === 0) {
      return res.status(400).json({ error: "No transactions available. Upload CSV first." });
    }

    const alternatives = [
      {
        category: "Food",
        current: "Food Delivery (Swiggy/Zomato)",
        currentCost: 800,
        alternative: "Cook at Home",
        alternativeCost: 200,
        savings: 600,
        monthlySavings: 18000,
        icon: "🍳",
        tip: "Meal prep on Sundays to save time and money!"
      },
      {
        category: "Travel",
        current: "Uber/Ola",
        currentCost: 250,
        alternative: "Metro/Bus",
        alternativeCost: 40,
        savings: 210,
        monthlySavings: 6300,
        icon: "🚇",
        tip: "Public transport is faster during rush hour!"
      },
      {
        category: "Food",
        current: "Daily Starbucks Coffee",
        currentCost: 300,
        alternative: "Home Coffee",
        alternativeCost: 30,
        savings: 270,
        monthlySavings: 8100,
        icon: "☕",
        tip: "Invest in a good coffee maker - pays for itself in 2 weeks!"
      },
      {
        category: "Shopping",
        current: "Impulse Online Shopping",
        currentCost: 2000,
        alternative: "Wait 24 Hours Rule",
        alternativeCost: 500,
        savings: 1500,
        monthlySavings: 1500,
        icon: "🛍️",
        tip: "Add to cart, wait 24 hours. Still want it? Then buy!"
      },
      {
        category: "Bills",
        current: "Multiple Streaming Services",
        currentCost: 1500,
        alternative: "Share Family Plans",
        alternativeCost: 500,
        savings: 1000,
        monthlySavings: 1000,
        icon: "📺",
        tip: "Split Netflix, Prime, Hotstar with friends!"
      }
    ];

    // Calculate potential total savings
    const totalMonthlySavings = alternatives.reduce((sum, alt) => sum + alt.monthlySavings, 0);
    const yearlyProjection = totalMonthlySavings * 12;

    res.json({
      alternatives,
      totalMonthlySavings,
      yearlyProjection,
      message: `💰 You could save ₹${totalMonthlySavings.toLocaleString()}/month (₹${yearlyProjection.toLocaleString()}/year) with these smart choices!`
    });
  } catch (error) {
    console.error("❌ Error suggesting alternatives:", error.message);
    res.status(500).json({ error: "Failed to suggest alternatives" });
  }
});

// === NEW: Gamification - Check Achievements ===
app.get("/check-achievements", async (req, res) => {
  try {
    if (storedTransactions.length === 0) {
      return res.status(400).json({ error: "No transactions available. Upload CSV first." });
    }

    const achievements = [
      {
        id: "budget_saver",
        title: "Budget Saver",
        description: "Stay under budget for 7 consecutive days",
        icon: "🏆",
        unlocked: true,
        progress: 100,
        reward: "Financial Ninja Badge"
      },
      {
        id: "no_delivery",
        title: "No-Delivery Streak",
        description: "7 days without food delivery orders",
        icon: "🔥",
        unlocked: false,
        progress: 57,
        reward: "Home Chef Badge"
      },
      {
        id: "savings_champion",
        title: "Savings Champion",
        description: "Save ₹5,000 in a single month",
        icon: "💎",
        unlocked: false,
        progress: 73,
        reward: "Money Master Badge"
      },
      {
        id: "financial_levelup",
        title: "Financial Level Up",
        description: "Improve financial score by 20 points",
        icon: "⭐",
        unlocked: true,
        progress: 100,
        reward: "Score Booster Badge"
      },
      {
        id: "smart_spender",
        title: "Smart Spender",
        description: "Use 3 cost-saving alternatives in a week",
        icon: "🧠",
        unlocked: false,
        progress: 33,
        reward: "Wise Wallet Badge"
      }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalPoints = unlockedCount * 100;

    res.json({
      achievements,
      unlockedCount,
      totalAchievements: achievements.length,
      totalPoints,
      level: Math.floor(totalPoints / 200) + 1,
      nextLevelPoints: ((Math.floor(totalPoints / 200) + 1) * 200) - totalPoints
    });
  } catch (error) {
    console.error("❌ Error checking achievements:", error.message);
    res.status(500).json({ error: "Failed to check achievements" });
  }
});
