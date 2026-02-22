import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verificationURL = `http://localhost:8000/api/v1/admin/verify-email/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
            <h2>Email Verification</h2>
            <p>Click below to verify your account:</p>
            <a href="${verificationURL}">Verify Email</a>
        `
    });
};