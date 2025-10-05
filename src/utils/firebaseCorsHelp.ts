
/**
 * Firebase Storage CORS Configuration Guide
 * 
 * To solve CORS issues with Firebase Storage, you need to:
 * 
 * 1. Add your domain to Firebase Authentication Authorized Domains:
 *    - Go to Firebase Console > Authentication > Sign-in method > Authorized domains
 *    - Add your domain (e.g., preview--professor-portfolio-hub.lovable.app)
 * 
 * 2. Configure Firebase Storage CORS:
 *    - Create a cors.json file with this content:
 *      [
 *        {
 *          "origin": ["https://preview--professor-portfolio-hub.lovable.app", "http://localhost:3000"],
 *          "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
 *          "maxAgeSeconds": 3600,
 *          "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-*"]
 *        }
 *      ]
 * 
 *    - Install Firebase CLI: npm install -g firebase-tools
 *    - Login to Firebase: firebase login
 *    - Set CORS configuration: firebase storage:cors update --project YOUR_PROJECT_ID ./cors.json
 * 
 * For more details, see: https://firebase.google.com/docs/storage/web/download-files#cors_configuration
 */

export const firebaseCorsExamples = {
  corsJsonExample: `[
  {
    "origin": ["https://preview--professor-portfolio-hub.lovable.app", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-*"]
  }
]`,
  
  firebaseCommandExample: "firebase storage:cors update --project proffessor-portfolio ./cors.json"
};
