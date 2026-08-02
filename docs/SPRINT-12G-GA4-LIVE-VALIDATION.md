# Sprint 12G GA4 Live Validation

Code support exists through `NEXT_PUBLIC_GA_MEASUREMENT_ID` and the consent-gated CookieConsent component.

Current local validation status:
- GA4/GTM dashboard access was not available.
- Production tag presence should be verified in browser after accepting analytics cookies.
- Required Vercel value, if missing: `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Do not invent or expose the Measurement ID in chat or committed files.

Manual test:
1. Open https://chamanlawfirm.com/ in a clean browser session.
2. Accept analytics in the cookie notice.
3. Confirm gtag script loads from googletagmanager.com.
4. Confirm Realtime traffic appears in GA4 for production hostname only.
5. Repeat on /resources/blog and a practice-area page.
