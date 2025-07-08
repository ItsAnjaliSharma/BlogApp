import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const Google_Client_ID = process.env.GOOGLE_CLIENT_ID;
const Google_Client_Secret = process.env.GOOGLE_CLIENT_SECRET;
export const auth2client = new google.auth.OAuth2(Google_Client_ID, Google_Client_Secret, "postmessage");
