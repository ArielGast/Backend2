import dotenv from 'dotenv';

dotenv.config();

const obj = {
    port: process.env.PORT,
    uri: process.env.URI,
    admin_email: process.env.ADMIN_EMAIL,
    admin_pass: process.env.ADMIN_PASS,
    github_clientID: process.env.GITHUB_CLIENTID,
    github_client_Secret: process.env.GITHUB_CLIENT_SECRET,
    google_clientID: process.env.GOOGLE_CLIENTID,
    google_client_Secret: process.env.GOOGLE_CLIENT_SECRET,
    node_env: process.env.NODE_ENV,
    user_gmail: process.env.USER_GMAIL,
    user_pass: process.env.USER_PASS,
    private_key: process.env.PRIVATE_KEY_JWT
}

export default obj