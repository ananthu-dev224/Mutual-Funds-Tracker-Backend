# Mutual Fund Portfolio Backend

A Node.js + Express backend for managing mutual fund portfolios.  
Users can sign up, log in, add mutual funds to their portfolio, track the latest NAVs, view historical performance, and calculate profits/losses.  

---

## 🚀 Features

- **Authentication** with JWT (signup, login, protected routes)  
- **Portfolio Management**  
  - Add funds with purchase details  
  - List current holdings  
  - View total investment, current value, and profit/loss  
  - View historical portfolio performance  
  - Remove funds from portfolio  
- **Funds Module**  
  - Search & paginate mutual funds  
  - Get fund details by scheme code  
  - Get latest NAV (with cache + API fallback)  
- **NAV Caching & Cron Job**  
  - Daily NAV updates saved in MongoDB (`FundLatestNav`, `FundNavHistory`)  
  - Reduces external API calls  
- **Security**  
  - Input validation with `express-validator`  
  - Rate limiting with `express-rate-limit`  
  - Secure headers with `helmet`  
  - Centralized error handling  

---

## ⚙️ Setup Instructions


```bash
git clone https://github.com/yourusername/mutualfund-portfolio-backend.git
cd mutualfund-portfolio-backend

npm install

cp .env.example .env

npm run seed:funds

npm start