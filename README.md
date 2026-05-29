# SafeSpace - Industrial Safety & Hazard Tracking Portal

SafeSpace is a premium, real-time safety reporting web application designed for site engineers and company safety officers. It facilitates rapid hazard reporting, workplace injury tracking, tool inspections, and analytics to maintain OSHA compliance.

## Key Features

1. **Fullscreen Login Gate**: Role-based access controls for **Site Engineers** and **Company Admins**.
2. **Dashboard Overview**: Get immediate safety KPIs, including active hazards, open injuries (MTD), safety score rates, locked out tools, and resolution totals.
3. **Monthly Incidents & Trends Line Chart**: View the rate of reported hazards, near misses, and injuries side by side.
4. **Low-Friction Reporting Forms**:
   - **Hazard & Near Miss Form**: Log safety hazards and near misses with custom category pickers and risk severity indicator cards.
   - **Injury Report Form**: Document personnel injuries, Job, Witnesses, treatment actions, and estimated workdays lost.
   - **Visual Grid Pickers**: Streamlined inputs for fast mobile/tablet logging.
5. **Tool Safety & LOTO Registry**: Dynamic directory of gas safety devices and pipework tools with integrated LOTO lockout locks and admin overrides.
6. **Media Gallery**: Centralized gallery supporting real photo/video attachments using standard browser APIs.
7. **Interactive Safety Logs (Admin Panel)**: High-density interactive datatable with full-text search and filters (type, severity, status).
8. **Company Data Hub**: Centrally tally statistics, download consolidated CSV logs, export complete JSON database backups, and run cloud backup sync simulations.
9. **Theme Toggle**: Sleek transition between a premium Dark/Slate mode and Clean/Light mode.

## Getting Started

To run the application locally, you can use any local web server.

### Option 1: Python HTTP Server (Recommended)
Run the following command in this directory:
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your web browser.

### Option 2: Node.js (npx)
If you have Node.js installed, run:
```bash
npx http-server -p 8000
```
Then open [http://localhost:8000](http://localhost:8000).

### Option 3: Double-click
Alternatively, since it is a pure HTML/CSS/JS application, you can simply open the `index.html` file directly by double-clicking it in your file explorer.
*(Note: Some features like FontAwesome icons require active internet connection, and Chrome sometimes restricts local file cookies, so a local server is recommended).*
