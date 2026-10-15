# Commissioned art

`/art` is the collection; `/art/artists` is the artist directory. A work has a permanent `/art/:id` page and can also be opened in the collection's modal viewer. Artist and collection/token filters accept query parameters (`artist`, `collection`, `token`). Collections and token IDs are matched together so a Warrior and a Wizard with the same number remain distinct.

The migration creates artist profiles and links, artworks, original/derived files, Rune assets and a many-to-many artwork/asset join. `commission_artworks.funded` records DAO funding; all current imports explicitly set it to `true`. Its default is `false` for future records. Spreadsheet provenance is optional when a file's artist is certain but its request row is not.

Each separate original is its own artwork, including revised cards. Comic pages share an artwork and have an ordered `page_number`. `original_file_id` links each derivative to its original, within the same artwork. The ignored duplicate request is not imported. Applicant/payment details are not included in the public catalog.

Untouched originals live in private `commission-originals`. Generated WebP thumbnails (up to 640 px), WebP detail previews (up to 1920 px), video posters and compressed H.264 videos live in private `commission-web`. Animated GIF detail previews preserve animation. PDF files get a first-page preview and an original download. Artist avatars have a 256 px WebP display version and a retained original. File metadata includes byte size, SHA-256, dimensions and MIME type.

Only server code uses the existing Supabase service credentials. RLS is enabled and anonymous/authenticated roles have no direct table permissions. The server caches catalog data for five minutes and signs display URLs for one hour; downloads validate artwork/file IDs, require an original file belonging to that artwork, and use a fresh 60-second signed URL. The gallery renders 24 cards initially, lazy-loads subsequent images and loads full previews only when opened.

The local import workspace contains the reviewed source catalog, original files, deterministic import manifest, resumable upload progress and pending-match/avatar reports. Uploads check local SHA-256; recovery verifies remote size and MD5 ETag before reusing an object. Database upserts run as one transaction after uploads. Artworks with a blocked file are withheld until all their files are present, so the gallery never advertises an unavailable original. Raising Supabase's global Storage file-size limit may be necessary for large originals; changing a bucket alone cannot exceed the project limit.

Validation: `pnpm type-check`, targeted ESLint, `pnpm test --runInBand src/lib/art.test.ts src/components/art/ArtGallery.test.tsx`, and `pnpm build`. The filter tests cover collection/token collisions, combined artist filtering, exact token matching and trimmed IDs.

Local preview: `.env.local` sets a valid `NEXTAUTH_URL` because the shared `.env` value is empty. The production build was checked with a localhost URL override. Wallet sign-in needs the existing auth secret and a WalletConnect allowlisted origin; these do not affect public art browsing.

When no search or filters are active, the collection uses a fresh random order for each visit and preserves it while browsing. Display titles resolve from the local Wizard, Warrior and Soul datasets on the server: a single subject uses its full name, multiple subjects use a collection label such as “Various wizards and warriors”, and unidentified subjects retain the stored fallback title. Reviewed source text can supply an exact full-name match when token links are absent. Character datasets are not sent to the gallery client.
