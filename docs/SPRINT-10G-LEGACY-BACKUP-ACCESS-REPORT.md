# Sprint 10G Legacy Backup Access Report

Generated: 2026-06-30T07:25:35.924Z

## External Backup Source

- Backup folder: `C:\Users\Progressive\OneDrive - CHAMAN LAW FIRM\CHAMAN DIGITAL ASSETS\WEBSITES PROJECTS\Legacy website (Old Wordpress backup) - June 28, 2026`
- SQL dump: available (47380600 bytes)
- Site archive: available (9403486069 bytes)
- RankMath export: available (491736 bytes)
- WordPress tree evidence: archive listing confirms `domains/chamanlawfirm.com/public_html/`, `wp-admin`, `wp-content`, `wp-includes`, `wp-content/uploads`, `.htaccess`, `robots.txt`, `BingSiteAuth.xml`, and `wp-config.php`.

## Access Rules

- Treat the backup as external read-only migration evidence.
- Do not commit the backup folder, SQL dump, tar archive, `wp-config.php`, extracted WordPress folders, secrets, salts, or database credentials.
- Recover images selectively from `wp-content/uploads` only after editorial/legal suitability checks.
- Upload selected images to Sanity as managed image assets before public use.
- Restore article bodies through controlled hidden Sanity drafts first.
- Keep `lawFirmApproved=false` until lawyer/SEO/image checks pass.

## Current Finding

The backup is usable for exact article body, SEO metadata, slug, old media path, and redirect recovery. It does not block the live website, but it materially improves the ongoing 1,000-article migration because article-specific images can now be recovered instead of repeating generic imagery.
