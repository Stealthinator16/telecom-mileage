# Telecom Mileage

**Live at [telecommileage.vercel.app](https://telecommileage.vercel.app/)**

Compare prepaid recharge plans across Indian telecom carriers (Jio, Airtel, Vi, BSNL) and find the best value for your money.

## What It Does

Telecom Mileage loads plan data and presents it in a filterable, sortable card interface. Each plan shows price, validity, data allowance, voice/SMS details, and bundled benefits (OTT subscriptions, 5G access, etc.). Cost-per-day and cost-per-GB metrics are calculated and color-coded so the best-value plans stand out at a glance.

## Features

- **Multi-operator comparison** -- Jio, Airtel, Vi, and BSNL plans side by side
- **Advanced filtering** -- by operator, validity range, daily data quota, OTT benefits, 5G access, and more
- **Sorting** -- by price, validity, cost/day, or cost/GB with ascending/descending toggle
- **Best-value badges** -- automatically highlights the cheapest cost-per-day and cost-per-GB plans in any filtered view
- **Search** -- free-text search across plan names, operators, prices, and benefits
- **Dark mode** -- toggle with theme preference persisted in localStorage
- **Responsive design** -- desktop sidebar filters transform into horizontal scrollable chips on mobile

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- JavaScript (ES modules)

## Getting Started

```bash
cd recharge
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
recharge/
  public/
    plans.json          # Plan dataset
  src/
    app/
      layout.js         # Root layout with Inter font
      page.js           # Main page with filtering, sorting, and plan display
      globals.css       # Full styling including dark mode and responsive layout
    components/
      FilterPanel.js    # Sidebar filter controls
      PlanCard.js       # Individual plan card with value color-coding
      ThemeToggle.js    # Light/dark mode switch
```

## License

MIT License. See [LICENSE](LICENSE) for details.
