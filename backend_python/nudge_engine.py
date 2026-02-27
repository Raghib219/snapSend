"""
Real-Time Budget Nudge Engine
Generates humorous and personalized financial nudges
"""

import random

class NudgeEngine:
    """Generate personalized spending nudges"""
    
    HUMOROUS_NUDGES = {
        'food_delivery': [
            "🍕 Another food delivery? Your kitchen is starting to feel neglected!",
            "🚨 BREAKING: Your Swiggy app just asked for a restraining order!",
            "💡 Fun fact: Cooking at home could save you enough for a vacation!",
            "🎭 Plot twist: Your delivery person knows your address better than your friends do!"
        ],
        'shopping': [
            "🛍️ Retail therapy again? Your wallet needs therapy now!",
            "💳 Your credit card just filed for emotional support!",
            "🎯 Remember: You can't buy happiness, but you're giving it a solid try!",
            "🚨 Alert: Your bank account is sending SOS signals!"
        ],
        'coffee': [
            "☕ That's your 5th coffee this week! Your home coffee maker is crying!",
            "💰 Daily Starbucks = ₹9,000/month. Home coffee = ₹900/month. Math is fun!",
            "🎪 At this rate, you could buy the coffee shop instead of just visiting it!"
        ],
        'overspending': [
            "🚨 Whoa there, big spender! Your budget is waving a white flag!",
            "⚠️ Danger Zone: You're spending faster than a kid in a candy store!",
            "🎢 Your spending is on a rollercoaster... and it's only going UP!",
            "💸 Money is leaving your account faster than you can say 'budget'!"
        ],
        'good_behavior': [
            "🌟 Look at you being financially responsible! We're proud!",
            "🏆 Achievement Unlocked: Sensible Spender!",
            "💪 You're crushing it! Your future self will thank you!",
            "✨ Financial discipline level: Expert! Keep it up!"
        ]
    }
    
    def __init__(self, analytics_data):
        self.analytics = analytics_data
    
    def generate_nudge(self, transaction_type=None, amount=None):
        """Generate a contextual nudge"""
        if transaction_type:
            nudges = self.HUMOROUS_NUDGES.get(transaction_type, [])
            if nudges:
                return random.choice(nudges)
        
        return "💡 Smart spending tip: Track every rupee to stay on budget!"
    
    def check_spending_threshold(self, category, current_spend, threshold):
        """Check if spending exceeds threshold"""
        percentage = (current_spend / threshold) * 100
        
        if percentage >= 100:
            return {
                'alert': True,
                'level': 'CRITICAL',
                'message': f"🚨 BUDGET EXCEEDED! You've spent ₹{current_spend:.0f} out of ₹{threshold:.0f} ({percentage:.0f}%)",
                'nudge': random.choice(self.HUMOROUS_NUDGES['overspending'])
            }
        elif percentage >= 90:
            return {
                'alert': True,
                'level': 'HIGH',
                'message': f"⚠️ Almost there! You've used {percentage:.0f}% of your {category} budget",
                'nudge': f"💡 Only ₹{threshold - current_spend:.0f} left for {category}. Spend wisely!"
            }
        elif percentage >= 75:
            return {
                'alert': True,
                'level': 'MEDIUM',
                'message': f"📊 Heads