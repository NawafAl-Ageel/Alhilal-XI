# Avatar Storage

This directory contains user profile pictures stored locally.

## How it works:

1. **Upload Process**: When users upload avatars, they are:
   - Converted to base64 and stored in Firestore
   - Given a filename based on user ID (e.g., `userId123.jpg`)
   - Displayed immediately using base64 data

2. **Extraction**: To get actual files in this directory:
   ```bash
   node scripts/extract-avatars.js
   ```

3. **Serving**: The avatars are served as static files from this directory

4. **Deployment**: When deploying to S3 or any static hosting:
   - Run the extraction script first
   - Upload this entire `avatars/` folder to your hosting platform
   - The paths will work automatically

## File Structure:
```
public/avatars/
├── README.md
├── userId1.jpg
├── userId2.png
└── ...
```

## Benefits:
- ✅ No Firebase Storage setup required
- ✅ Works with any static hosting (S3, Netlify, Vercel, etc.)
- ✅ No storage costs
- ✅ Simple file management
- ✅ Fast loading (served as static files)

## Security:
- Files are named by user ID (not user-controlled)
- File type validation (images only)
- Size limits (5MB max)
- No direct file upload to this directory (handled by app)
