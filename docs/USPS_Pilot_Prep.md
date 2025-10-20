\# USPS Pilot Prep – 25-Site Deployment

\_Last updated: October 20, 2025\_



\## 1. Overview

This document defines the readiness plan for the USPS 25-location pilot.

The `usps\_dashboard` React/Vite project serves as the live monitoring interface for all active sites connected to the True911+ platform.



---



\## 2. Deployment Monitoring

\*\*Purpose:\*\* Enable visibility into device status and health metrics for every USPS pilot location.



\### Metrics to Track

\- Online / Offline / Attention Needed  

\- Last heartbeat timestamp  

\- Cellular signal strength (Inseego API)  

\- SIP registration (Telnyx API)  

\- Power and battery status (CSA)  

\- Event log feed and error reporting



\### UI Implementation

\- Add `/sync\_status` table with:

&nbsp; - Site filter  

&nbsp; - CSV/PDF export buttons  

&nbsp; - 60-second auto-refresh  

\- Color-coded status:

&nbsp; - 🟢 Connected

&nbsp; - 🟡 Attention Needed

&nbsp; - 🔴 Offline

&nbsp; - ⚪ Unknown



---



\## 3. 3PL (Converge IoT) Deployment Workflow

\*\*Goal:\*\* Ensure every unit is provisioned, tested, and verified before shipment.



| Step | Action | Owner |

|------|--------|-------|

| 1 | Capture SIM, IMEI, and E911 Address | Converge IoT |

| 2 | Push firmware/config via Inseego Connect | T-Mobile |

| 3 | Confirm Telnyx SIP registration | Manley Solutions |

| 4 | Lock credentials, push XML provisioning | Manley Solutions |

| 5 | Verify site visibility in True911+ map | CSA |

| 6 | Mark site as "Ready for Field" | Converge IoT |



\*\*Deliverable:\*\*  

Create `pilot\_staging.csv` (columns: `Site ID, SIM ICCID, IMEI, Static IP, E911 Address, Status, Notes`)  

\_Target: Wednesday EOD\_



---



\## 4. Reporting \& Alerts

\- Daily status PDF (online/offline summary)  

\- Auto-email to:

&nbsp; - Converge IoT Support  

&nbsp; - T-Mobile Engineering  

&nbsp; - Manley Solutions Ops  

\- Archive JSON logs to `/logs/YYYY-MM-DD-summary.json`



---



\## 5. Next Steps

1\. Verify `/sync\_status` export + filter  

2\. Integrate Inseego API for signal telemetry  

3\. Connect True911+ backend for live data sync  

4\. Prepare USPS pilot dashboard demo  

5\. Validate 3PL workflow using staging sheet



