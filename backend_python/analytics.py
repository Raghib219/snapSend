"""
Advanced Analytics Module using Pandas
Demonstrates pandas capabilities for hackathon judges
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class TransactionAnalytics:
    """Pandas-powered transaction analytics"""
    
    def __init__(self, df):
        self.df = df.copy()
        self._prepare_data()
    
    def _prepare_data(self):
        """Prepare dataframe for analysis"""
        # Convert date to datetime
        self.df['date_parsed'] = pd.to_datetime(self.df['date'], errors='coerce')
        
        # Extract time features
        self.df['day'] = self.df['date_parsed'].dt.day
        self.df['weekday'] = self.df['date_parsed'].dt.day_name()
        self.df['week'] = self.df['date_parsed'].dt.isocalendar().week
        
        # Separate income and expenses
        self.income_df = self.df[self.df['drcr'] == 'CR']
        self.expense_df = self.df[self.df['drcr'] == 'DR']
    
    def get_spending_velocity(self):
        """Calculate daily spending rate"""
        daily_spending = self.expense_df.groupby('day')['amount'].sum()
        avg_daily_spend = daily_spending.mean()
        
        return {
            'average_daily_spend': float(avg_daily_spend),
            'highest_spending_day': int(daily_spending.idxmax()) if len(daily_spending) > 0 else None,
            'highest_amount': float(daily_spending.max()) if len(daily_spending) > 0 else 0,
            'daily_breakdown': daily_spending.to_dict()
        }
    
    def get_category_insights(self):
        """Deep category analysis"""
        category_stats = self.expense_df.groupby('category').agg({
            'amount': ['sum', 'mean', 'count', 'max']
        }).round(2)
        
        category_stats.columns = ['total', 'average', 'count', 'max_transaction']
        
        return category_stats.to_dict('index')
    
    def detect_overspending_risk(self):
        """Predict if user will overspend this month"""
        days_passed = self.df['day'].max()
        total_spent = self.expense_df['amount'].sum()
        
        if days_passed > 0:
            daily_rate = total_spent / days_passed
            projected_monthly = daily_rate * 30
            
            total_income = self.income_df['amount'].sum()
            
            risk_level = "LOW"
            if projected_monthly > total_income * 0.9:
                risk_level = "HIGH"
            elif projected_monthly > total_income * 0.75:
                risk_level = "MEDIUM"
            
            return {
                'days_passed': int(days_passed),
                'spent_so_far': float(total_spent),
                'daily_burn_rate': float(daily_rate),
                'projected_monthly_spend': float(projected_monthly),
                'total_income': float(total_income),
                'risk_level': risk_level,
                'will_overspend': projected_monthly > total_income
            }
        
        return None
    
    def get_spending_patterns(self):
        """Identify spending patterns"""
        # Weekday vs Weekend
        weekend_days = ['Saturday', 'Sunday']
        weekend_spend = self.expense_df[
            self.expense_df['weekday'].isin(weekend_days)
        ]['amount'].sum()
        
        weekday_spend = self.expense_df[
            ~self.expense_df['weekday'].isin(weekend_days)
        ]['amount'].sum()
        
        # First half vs second half
        first_half = self.expense_df[self.expense_df['day'] <= 15]['amount'].sum()
        second_half = self.expense_df[self.expense_df['day'] > 15]['amount'].sum()
        
        return {
            'weekend_spending': float(weekend_spend),
            'weekday_spending': float(weekday_spend),
            'first_half_spending': float(first_half),
            'second_half_spending': float(second_half),
            'spends_more_on_weekends': weekend_spend > weekday_spend,
            'front_loaded_spending': first_half > second_half
        }
    
    def get_merchant_frequency(self):
        """Find most frequent merchants"""
        merchant_freq = self.expense_df['description'].value_counts().head(10)
        
        return {
            'top_merchants': merchant_freq.to_dict(),
            'unique_merchants': int(self.expense_df['description'].nunique()),
            'repeat_purchases': int((merchant_freq > 1).sum())
        }
    
    def calculate_savings_potential(self):
        """Calculate how much user could save"""
        category_totals = self.expense_df.groupby('category')['amount'].sum()
        
        # Assume 20% reduction in discretionary spending
        discretionary = ['Food', 'Shopping', 'Entertainment']
        potential_savings = sum([
            category_totals.get(cat, 0) * 0.2 
            for cat in discretionary
        ])
        
        return {
            'monthly_savings_potential': float(potential_savings),
            'annual_savings_potential': float(potential_savings * 12),
            'with_7_percent_interest': float(potential_savings * 12 * 1.07)
        }
    
    def get_complete_analytics(self):
        """Get all analytics in one call"""
        return {
            'spending_velocity': self.get_spending_velocity(),
            'category_insights': self.get_category_insights(),
            'overspending_risk': self.detect_overspending_risk(),
            'spending_patterns': self.get_spending_patterns(),
            'merchant_frequency': self.get_merchant_frequency(),
            'savings_potential': self.calculate_savings_potential()
        }
