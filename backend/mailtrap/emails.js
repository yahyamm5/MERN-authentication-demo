const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require("./emailtemplates")
const { mailtrapClient, sender } = require("./mailtrap.Config")

const verificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const respones = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully")
    }catch(error) {
        console.log(`Error sending verification: ${error}`)
    }
}

const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "e0440e54-0733-47eb-a56a-b3f0c49d3e4c",
			template_variables: {
				company_info_name: "ScammersFC",
				name: name,
			},
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}

}

const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{email}]

    try {
        const respones = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })

        console.log("Email sent successfully")
    }catch(error) {
        console.log(`Error sending Password Reset: ${error}`)
    }
}

const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        const respones = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully", respones);
    } catch(error){
        console.error(`Error sending the reset success email`, error);

        throw new Error(`Error sending password reset success email: ${error}`);
    }
}

module.exports = { verificationEmail ,sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail}