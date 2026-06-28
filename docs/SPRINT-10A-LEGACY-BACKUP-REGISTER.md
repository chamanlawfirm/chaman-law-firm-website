# Sprint 10A Legacy Backup Register

Date registered: 2026-06-28

## Backup Location

`C:\Users\Progressive\OneDrive - CHAMAN LAW FIRM\CHAMAN DIGITAL ASSETS\WEBSITES PROJECTS\Legacy website (Old Wordpress backup) - June 2026`

## Purpose

This legacy WordPress backup is registered as an external, read-only migration source for future Chaman Law Firm content recovery, media recovery, URL mapping, redirect evidence, and SEO preservation work.

It is not part of the Next.js/Vercel application and must not be uploaded to GitHub, Vercel, Sanity, or any public deployment environment as a full backup.

## Available Content Types

The backup appears to contain:

- WordPress application folders such as `wp-admin`, `wp-content`, and `wp-includes`.
- Legacy public website files under `public_html`.
- Legacy media and uploads under `wp-content/uploads`.
- Plugins and themes.
- `.htaccess`, robots, and verification files such as Bing authentication files.
- WordPress configuration files including `wp-config.php`.
- Legacy blog, media, URL, and SEO recovery evidence.

## Protection Rules

- Do not commit the full backup to GitHub.
- Do not upload the full backup to Vercel.
- Do not stage extracted WordPress folders such as `public_html`, `wp-admin`, `wp-content`, or `wp-includes`.
- Do not commit `wp-config.php`.
- Do not expose database credentials, salts, passwords, tokens, webhook URLs, or private configuration.
- Treat all configuration and credential-bearing files as private.
- Use the backup only as a controlled, read-only source for migration recovery.

## Future Migration Use

The backup may be used in later sprints to recover:

- Original blog images and upload paths.
- Old image URLs and media filenames.
- Article body HTML and formatting.
- Old slugs and URL evidence.
- Internal links and legacy link structures.
- Old sitemap references.
- RankMath or SEO metadata if available in exports, database backups, or plugin files.
- Redirect evidence and `.htaccess` rules.
- Media alt text where available.

## Media Recovery Rules

- Images and media may be selectively recovered later only when relevant to Chaman Law Firm content.
- Chaman Properties or luxury property sales imagery must not be used for the law firm blog.
- Selected media should be optimized before use.
- Selected media should be uploaded to Sanity or placed into approved public assets only after editorial review.
- Alt text and captions should be reviewed or rewritten for legal-service relevance before publication.

## Blog Migration Rules

- Legacy posts must be migrated through the controlled Sanity workflow only.
- New or repaired Sanity post documents should remain hidden with `lawFirmApproved=false` until review is complete.
- Public author attribution for migrated legacy articles must follow the approved author-governance rule.
- Redirects must not be activated until the target article is approved, visible, indexable, included in the sitemap, and cleared for launch.
