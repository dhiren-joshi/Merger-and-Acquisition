# Sample Deals Seeding Guide

This script populates your M&A platform with 6 diverse sample deals to test all features.

## Sample Deals Overview

### 1. **TechFlow Solutions** - Strong Tech Acquisition
- **Stage**: Evaluation
- **Fit Score**: 88/100 (Strong Fit)
- **Value**: $15M
- Perfect for testing high-score visualizations

### 2. **Global Markets Inc** - Moderate Market Expansion
- **Stage**: Negotiation
- **Fit Score**: 65/100 (Good Fit)
- **Value**: $25M
- Tests mixed metrics and moderate scores

### 3. **InnovateLabs** - Good Talent Acquisition
- **Stage**: Sourcing
- **Fit Score**: 78/100 (Good Fit)
- **Value**: $8M
- Shows early-stage deal in pipeline

### 4. **Legacy Systems Corp** - Weak Distressed Buy
- **Stage**: Evaluation
- **Fit Score**: 35/100 (Weak Fit)
- **Value**: $3M
- Tests low-score warnings and risk indicators

### 5. **CloudScale Technologies** - Strong Tech Acquisition
- **Stage**: Closing
- **Fit Score**: 93/100 (Strong Fit)
- **Value**: $45M
- Shows deals in final stage

### 6. **Regional Retail Partners** - Moderate Market Expansion
- **Stage**: Negotiation
- **Fit Score**: 70/100 (Good Fit)
- **Value**: $20M
- Additional moderate deal for comparison

## How to Run

### Prerequisites
- Backend server must be running
- You must have a user account (register if you haven't)

### Steps

1. **Open a new terminal** in the backend directory:
   ```powershell
   cd "c:\Users\dhire\M&A\backend"
   ```

2. **Run the seed script**:
   ```powershell
   node seedDeals.js
   ```

3. **Wait for confirmation**:
   ```
   ✅ Connected to MongoDB
   📝 Using user: your-email@example.com
   🗑️  Deleted X existing deals
   ✅ Successfully created 6 sample deals!
   ```

4. **Refresh your browser**:
   - Go to http://localhost:5173
   - Check the Dashboard - you'll see 6 deals across different stages
   - Check Analytics - you'll see charts and KPIs
   - Test comparison - select multiple deals to compare

## What Gets Tested

With these 6 deals, you can test:

✅ **Dashboard Kanban Board**
- Deals in all 4 stages (Sourcing, Evaluation, Negotiation, Closing)
- Drag and drop between stages
- Color-coded fit scores

✅ **Analytics Dashboard**
- Total deals: 6
- Average fit score calculation
- Deals by stage chart (varied distribution)
- Fit score distribution (Poor, Weak, Moderate, Good, Strong)

✅ **Deal Comparison**
- Compare high-score vs low-score deals
- Radar chart with different patterns
- Side-by-side metric comparison

✅ **Deal Details Page**
- Click any deal to see full analysis
- Circular gauge showing different scores
- Export to PDF/Excel/JSON
- Add notes and comments

✅ **Fit Score Categories**
- Poor Fit: Legacy Systems Corp (35)
- Good Fit: Global Markets Inc (65), Regional Retail (70)
- Strong Fit: InnovateLabs (78), TechFlow (88), CloudScale (93)

## Notes

- **Clears existing deals**: The script will delete your existing deals before adding samples
- **Uses your user account**: Deals are created under your logged-in user
- **Realistic data**: All deals have complete, realistic data for testing
- **Run anytime**: You can run this script multiple times to reset your data

## Troubleshooting

**Error: "No user found"**
- Make sure you're registered and have an account
- Try registering at http://localhost:5173/register

**Error: "Cannot connect to MongoDB"**
- Make sure MongoDB is running
- Check that backend server is running

**No deals showing up**
- Hard refresh your browser (Ctrl + Shift + R)
- Check the browser console for errors
- Make sure you're logged in with the same account

---

Enjoy exploring your M&A platform with realistic sample data! 🚀
