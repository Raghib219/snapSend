// Real-time Budget Nudge Engine with Humor
class NudgeEngine {
  constructor() {
    this.humorousMessages = {
      food: [
        "🍕 Another food order? Your wallet is on a diet even if you're not!",
        "🚨 BREAKING: Your bank account just filed a restraining order against Swiggy!",
        "💸 Fun fact: You could've bought a month's groceries with this week's delivery spend!",
        "🎭 Plot twist: Cooking at home exists and it's 70% cheaper!",
      ],
      shopping: [
        "🛍️ Retail therapy detected! Your bank account needs therapy too!",
        "💳 Your credit card is sending SOS signals!",
        "🎪 Amazon called. They want to name a warehouse after you!",
        "⚠️ Warning: Your shopping cart is heavier than your savings!",
      ],
      travel: [
        "🚗 Uber again? Your legs called - they miss walking!",
        "🚕 At this rate, you could've bought a bicycle!",
        "🎯 Pro tip: Metro exists and costs 80% less!",
      ],
      general: [
        "💰 Money doesn't grow on trees, but it sure disappears fast!",
        "🎮 Achievement Unlocked: Professional Money Spender!",
        "📊 Your spending speed: Fast & Furious!",
        "🔥 Your wallet is literally on fire right now!",
      ]
    };
  }

  // Generate real-time nudges based on spending patterns
  generateNudges(transactions, budgetLimits = {}) {
    const nudges = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // Analyze spending by category
    const categorySpending = this.analyzeCategorySpending(transactions);
    
    // Check budget limits
    Object.entries(categorySpending).forEach(([category, amount]) => {
      const limit = budgetLimits[category];
      if (limit) {
        const percentage = (amount / limit) * 100;
        
        if (percentage >= 90) {
          nudges.push({
            type: 'critical',
            category,
            message: `🚨 ALERT: You've spent ₹${amount.toFixed(0)} of ₹${limit} (${percentage.toFixed(0)}%) on ${category}!`,
            humor: this.getRandomHumor(category),
            action: 'Stop spending immediately!',
            severity: 'high'
          });
        } else if (percentage >= 75) {
          nudges.push({
            type: 'warning',
            category,
            message: `⚠️ Warning: ${percentage.toFixed(0)}% of your ${category} budget used!`,
            humor: `You're in the danger zone! 🎯`,
            action: `Only ₹${(limit - amount).toFixed(0)} left for ${category}`,
            severity: 'medium'
          });
        } else if (percentage >= 50) {
          nudges.push({
            type: 'info',
            category,
            message: `📊 Halfway there: ${percentage.toFixed(0)}% of ${category} budget spent`,
            humor: `Pace yourself, champ! 🏃`,
            action: `₹${(limit - amount).toFixed(0)} remaining`,
            severity: 'low'
          });
        }
      }
    });

    // Detect spending velocity (spending too fast)
    const velocityNudge = this.checkSpendingVelocity(transactions, currentDay);
    if (velocityNudge) nudges.push(velocityNudge);

    // Detect unusual spending patterns
    const patternNudge = this.detectUnusualPatterns(transactions);
    if (patternNudge) nudges.push(patternNudge);

    // Compare with previous period
    const comparisonNudge = this.compareWithPrevious(transactions);
    if (comparisonNudge) nudges.push(comparisonNudge);

    return nudges;
  }

  analyzeCategorySpending(transactions) {
    const spending = {};
    transactions.forEach(t => {
      if (t.category !== 'Income') {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      }
    });
    return spending;
  }

  checkSpendingVelocity(transactions, currentDay) {
    const totalSpent = transactions
      .filter(t => t.category !== 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const daysInMonth = 30;
    const projectedSpending = (totalSpent / currentDay) * daysInMonth;
    
    if (currentDay <= 10 && totalSpent > 0) {
      const percentageSpent = (currentDay / daysInMonth) * 100;
      if (totalSpent > projectedSpending * 0.4) {
        return {
          type: 'velocity',
          message: `🚀 Spending Alert: You've spent ₹${totalSpent.toFixed(0)} in just ${currentDay} days!`,
          humor: `At this pace, you'll need a second job! 😅`,
          action: `Projected monthly spend: ₹${projectedSpending.toFixed(0)}`,
          severity: 'high'
        };
      }
    }
    return null;
  }

  detectUnusualPatterns(transactions) {
    // Check for multiple transactions in same category on same day
    const dailyCategory = {};
    transactions.forEach(t => {
      const key = `${t.date}-${t.category}`;
      dailyCategory[key] = (dailyCategory[key] || 0) + 1;
    });

    const unusual = Object.entries(dailyCategory).find(([key, count]) => count >= 3);
    if (unusual) {
      const [dateCategory, count] = unusual;
      const category = dateCategory.split('-').pop();
      return {
        type: 'pattern',
        message: `🎯 Pattern Alert: ${count} ${category} transactions in one day!`,
        humor: `Someone's having a shopping spree! 🛍️`,
        action: 'Consider consolidating purchases',
        severity: 'medium'
      };
    }
    return null;
  }

  compareWithPrevious(transactions) {
    // Simple comparison: first half vs second half
    const firstHalf = transactions.filter(t => {
      const day = parseInt(t.date.split('-')[2]);
      return day <= 15 && t.category !== 'Income';
    });
    const secondHalf = transactions.filter(t => {
      const day = parseInt(t.date.split('-')[2]);
      return day > 15 && t.category !== 'Income';
    });

    const firstTotal = firstHalf.reduce((sum, t) => sum + t.amount, 0);
    const secondTotal = secondHalf.reduce((sum, t) => sum + t.amount, 0);

    if (secondTotal > firstTotal * 1.5) {
      return {
        type: 'comparison',
        message: `📈 Spending Spike: Second half spending is 50% higher!`,
        humor: `Did you win the lottery or lose your mind? 🎰`,
        action: `First half: ₹${firstTotal.toFixed(0)}, Second half: ₹${secondTotal.toFixed(0)}`,
        severity: 'medium'
      };
    }
    return null;
  }

  getRandomHumor(category) {
    const messages = this.humorousMessages[category] || this.humorousMessages.general;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Generate smart alternatives
  generateAlternatives(transaction) {
    const alternatives = {
      'Swiggy': { alternative: 'Cook at home', savings: transaction.amount * 0.7 },
      'Zomato': { alternative: 'Meal prep', savings: transaction.amount * 0.7 },
      'Uber': { alternative: 'Metro/Bus', savings: transaction.amount * 0.8 },
      'Ola': { alternative: 'Public transport', savings: transaction.amount * 0.8 },
      'Starbucks': { alternative: 'Home coffee', savings: transaction.amount * 0.9 },
      'Amazon': { alternative: 'Wait for sale', savings: transaction.amount * 0.3 },
    };

    for (const [key, value] of Object.entries(alternatives)) {
      if (transaction.description.toLowerCase().includes(key.toLowerCase())) {
        return {
          current: transaction.description,
          alternative: value.alternative,
          savings: value.savings.toFixed(0),
          message: `💡 Smart Tip: ${value.alternative} could save you ₹${value.savings.toFixed(0)}!`
        };
      }
    }
    return null;
  }

  // Calculate achievements
  calculateAchievements(transactions, previousTransactions = []) {
    const achievements = [];
    
    // No delivery streak
    const recentDeliveries = transactions.filter(t => 
      /swiggy|zomato|food delivery/i.test(t.description)
    ).length;
    
    if (recentDeliveries === 0 && transactions.length > 5) {
      achievements.push({
        title: '🏆 No-Delivery Champion',
        description: 'Zero food delivery orders detected!',
        points: 100
      });
    }

    // Savings achievement
    const currentSpending = transactions
      .filter(t => t.category !== 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousSpending = previousTransactions
      .filter(t => t.category !== 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    if (previousSpending > 0 && currentSpending < previousSpending * 0.9) {
      const saved = previousSpending - currentSpending;
      achievements.push({
        title: '💰 Super Saver',
        description: `Saved ₹${saved.toFixed(0)} compared to last period!`,
        points: 200
      });
    }

    // Budget discipline
    const daysTracked = new Set(transactions.map(t => t.date)).size;
    if (daysTracked >= 7) {
      achievements.push({
        title: '📊 Tracking Master',
        description: `${daysTracked} days of consistent tracking!`,
        points: 50
      });
    }

    return achievements;
  }

  // Financial health score calculation
  calculateFinancialScore(transactions, budgetLimits = {}) {
    let score = 100;
    
    const income = transactions
      .filter(t => t.category === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.category !== 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Spending vs Income
    if (expenses > income) score -= 30;
    else if (expenses > income * 0.9) score -= 20;
    else if (expenses > income * 0.8) score -= 10;

    // Budget adherence
    const categorySpending = this.analyzeCategorySpending(transactions);
    Object.entries(budgetLimits).forEach(([category, limit]) => {
      const spent = categorySpending[category] || 0;
      if (spent > limit) score -= 15;
      else if (spent > limit * 0.9) score -= 5;
    });

    // Savings rate
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    if (savingsRate >= 30) score += 10;
    else if (savingsRate >= 20) score += 5;
    else if (savingsRate < 10) score -= 10;

    return Math.max(0, Math.min(100, score));
  }
}

module.exports = new NudgeEngine();
