**Project Overview**
- **Name:**: Real-Estate (Full-stack real estate listing app)
- **Purpose:**: A learning/demo real-estate application that lets users sign in (Google OAuth), post property listings with images and geolocation, browse listings, favorite properties, and comment in threaded conversations (with owner-only edit/delete).
- **Architecture:**: Two separate apps in the repository:
  - **Backend:**: `back-realestate/` — Node.js + Express server, PostgreSQL (using `pg`), handles property CRUD, image uploads (via `multer`), favorites, and comments.
  - **Frontend:**: `realestate/` — React (Vite) application that provides UI for login, posting properties (`Sell`), browsing (`Home`), viewing details (`Details`), favorites, and comments.

**Tech Stack**
- **Frontend:**: React (Vite), `react-router-dom`, `@react-google-maps/api`, `@react-oauth/google`, `jwt-decode`, Tailwind / plain CSS
- **Backend:**: Node.js, Express, `pg` (Postgres client), `multer` (file uploads), `cors`, `dotenv`
- **Database:**: PostgreSQL with primary tables `users`, `properties`, `favorites`, `comments`

**Repository Layout**
- `back-realestate/` — backend server
  - `index.js` — Express routes and DB access
  - `package.json` — server deps and scripts
  - `uploads/` — static folder where uploaded images are saved
- `realestate/` — frontend
  - `src/` — React app source files
  - `src/components/PropertyCard.jsx`, `details.jsx`, `CommentThread.jsx`, `sell.jsx`, etc.
  - `index.html`, `vite.config.js`, `package.json`

**Database Schema (recommended / current)**
- **users**
  - `user_id` (serial primary key)
  - `name`, `email`, `avatar_url`, `google_id` (optional)
  - `created_at` (timestamp)
- **properties**
  - `property_id` (serial primary key)
  - `user_id` (owner)
  - `title`, `description`
  - `price` (number)
  - `image_urls` (text[] or JSON array) — saved relative URLs like `/uploads/<file>`
  - `size_sqft`, `bedrooms`, `bathrooms`, `kitchen` (or similar fields)
  - `latitude`, `longitude` (float)
  - `location` (string address / formatted)
  - `created_at` (timestamp)
- **favorites**
  - `favorite_id` (serial primary key)
  - `user_id`, `property_id`
  - `created_at`
- **comments**
  - `comment_id` (serial primary key)
  - `property_id`, `user_id`
  - `parent_id` (nullable: supports threaded replies)
  - `content` (text)
  - `created_at`, `updated_at`

**Backend - Important Environment Variables**
- `PORT` — backend port (default used in repository: `3001`)
- `DATABASE_URL` or `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` — postgres connection
- `FRONTEND_URL` — e.g., `http://localhost:5173` for CORS origin
- `UPLOADS_DIR` — (optional) path to store uploaded images (default: `back-realestate/uploads/`)

**Backend - Key API Endpoints**
(Assumes backend runs at `http://localhost:3001`)
- `POST /api/login` — create or return user after Google login. Body: `{ name, email, avatar_url, google_id }`. Returns `{ user_id }`.
- `POST /api/sell` — create a property (multipart/form-data). Fields:
  - `title`, `description`, `price`, `size_sqft`, `bedrooms`, `bathrooms`, `kitchen`, `location`, `latitude`, `longitude`, `user_id`
  - `images` — multiple files
  - Response: created property record
- `GET /api/properties` — list all properties (optionally support filters)
- `GET /api/properties/:id/:user_id` — get property details + whether current user has favorited it
- `POST /api/favorites` — toggle favorite. Body: `{ user_id, property_id }` -> responds with favorite status
- `GET /api/favorites/:user_id` — list favorites for a user
- `POST /api/comments` — add a comment. Body: `{ property_id, user_id, parent_id (optional), content }`
- `GET /api/comments/:property_id` — list comments for a property (should return nested structure or a flat list that client nests)
- `PUT /api/comments/:comment_id` — edit comment (server should verify `user_id` matches owner)
- `DELETE /api/comments/:comment_id` — delete comment (server should verify `user_id` matches owner)

Note: The backend uses prepared statements (`pool.query`) to prevent SQL injection. Ensure endpoints return the proper HTTP status codes: `200` for success, `403` for forbidden (edit/delete by non-owner), and `400/500` for errors.

**Frontend - Setup & Run (Windows PowerShell)**
- Frontend (Vite React app):
```powershell
cd realestate
npm install
npm run dev
# default output: http://localhost:5173
```
- Backend (Express):
```powershell
cd back-realestate
npm install
# to run directly
node index.js
# or with nodemon (dev)
# npm i -g nodemon; nodemon index.js
```

**Frontend - Important Notes**
- The app uses `localStorage` to store a client-side `user_id` after login. This is a temporary auth system; consider replacing with session-based or token-based auth.
- Google sign-in is integrated using `@react-oauth/google` and the `GoogleLogin` UI component; `jwt-decode` decodes the token to extract user info.
- Maps & Places: `@react-google-maps/api` is used in `sell.jsx` (for picking location via `Autocomplete`) and `details.jsx` (for showing marker). You will need a Google Maps API key and enable the Places API.

**How data flows (high-level)**
- User logs in (Google). Frontend decodes the credential, posts to `/api/login`, backend returns a `user_id` which frontend saves in `localStorage`.
- User posts property via `Sell` form: frontend constructs `FormData` (including `latitude`, `longitude`, and images), posts to `/api/sell`. Backend saves images (in `uploads/`), stores image URLs and other property fields in `properties` table.
- `Home` page fetches `/api/properties` and maps results to `PropertyCard` components.
- `Details` page fetches `/api/properties/:id/:user_id` to get property details and whether current user favorites it; comments are fetched from `/api/comments/:property_id`.
- Favorites: toggled via `POST /api/favorites` and `GET /api/favorites/:user_id` retrieves favorites.
- Comments: `POST /api/comments` creates comments (supports `parent_id` for replies); `PUT`/`DELETE` allow owner-only edit/delete.

**Developer Tips & Known Issues**
- Ensure CORS is configured with the exact frontend origin (e.g., `http://localhost:5173`) without trailing slash.
- Some browser clients may not send a body for `DELETE` requests (depending on fetch usage). If problems occur when passing `user_id` in `DELETE` body, switch to sending `user_id` as a query parameter or in a header.
- Replace `window.location.reload()` calls in components (e.g., comment refresh logic) with parent-provided `refreshComments()` callbacks to avoid full-page reload UX.
- Verify `latitude` and `longitude` are appended once to `FormData` in `sell.jsx` (avoid duplicate appends).
- Typos to watch for in backend SQL code: `pool.quert` (should be `pool.query`) and SQL token spelling like `RETURNING`.

**Testing**
- Test backend endpoints with `curl` or Postman.
- Example: create property (multipart) using `curl` (PowerShell syntax may vary):
```powershell
curl -X POST "http://localhost:3001/api/sell" -H "Content-Type: multipart/form-data" -F "title=Test home" -F "price=100000" -F "user_id=1" -F "images=@C:\path\to\image1.jpg"
```
- Test comments and favorites with JSON POSTs:
```powershell
curl -X POST "http://localhost:3001/api/comments" -H "Content-Type: application/json" -d '{"property_id":1,"user_id":1,"content":"Nice place!"}'
```

**Security & Next Steps**
- Replace client-side `user_id` storage with a proper auth solution (JWT tokens or server sessions)
- Add server-side validation and better error messages
- Serve uploaded images behind secure static routes and validate file types/sizes
- Add pagination/filtering for `GET /api/properties` to scale the listing
- Improve test coverage (unit tests for backend routes, integration tests)

**Where to look in the repo**
- Backend: `back-realestate/index.js` (main server), `back-realestate/uploads/` (images)
- Frontend entry: `realestate/src/main.jsx` and page components in `realestate/src/` (notable files: `sell.jsx`, `home.jsx`, `details.jsx`, `CommentThread.jsx`, `property-card.jsx`)

**Contact / Contribution**
- If you want me to: I can:
  - Replace `window.location.reload()` calls with proper refresh callbacks
  - Add a `.env.example` for environment variables
  - Create SQL migration files or `schema.sql` for the DB layout
  - Add basic unit/integration tests for the backend

---
This `README.md` summarizes the current project structure, usage, and next steps. If you want, I can now:
- add example `.env.example` and SQL schema file, or
- update the backend to return consistent status codes and refine comment edit/delete handling.
Which would you like me to do next?