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

export const sendPassowrdEmail = async (email, password) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Account Password",
        html: `
        <h2> You Have Been Registered As An Employee</h2>
        <p>Congratulations! You have been registered as an employee in our system. Below are your login credentials:</p>
            <h2>Your Account Password</h2>
            <p>Your account has been created. Here is your password:</p>
            <h3>${password}</h3>
            <p>Please change this password after logging in for the first time.</p>
        `
    });
};

export const passwordUpdatedEmail = async (email) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Has Been Updated",
        html: `
            <h2>Password Updated</h2>
            <p>Your password has been successfully updated. If you did not make this change, please contact support immediately.</p>
            <h3> Attendo :- An Employee Management System </h3>
        `
    });
};
