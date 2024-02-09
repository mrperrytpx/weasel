import { Link } from "react-router-dom";

const PrivacyPage = () => {
    return (
        <div className="mx-auto mb-20 mt-10 flex w-full max-w-screen-md flex-1 flex-col gap-6 p-4">
            <h1 className="text-2xl font-semibold">Privacy Policy</h1>
            <p className="text-xs">Effective Date: 9th of February, 2024</p>
            <p>
                At Weasel Albums, we take your privacy seriously. This policy explains how we
                collect, process, and share your personal information when you use our services or
                visit our Website.
            </p>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">Personal Information Collection</h2>
                <p>
                    When you visit this Website, we automatically collect certain information about
                    your device, including information about your web browser, IP address, time
                    zone, and some of the cookies that are installed on your device.
                </p>
                <p>
                    Additionally, as you browse this Website, we collect information about the
                    individual web pages that you view.
                </p>
                <p>
                    We refer to this automatically collected information as{" "}
                    <strong>&quot;Device Information.&quot;</strong>
                </p>
                <p>
                    When you use the Website to create an account, we collect various types of
                    information from you, which include your email address. If you choose to log in
                    with any of the authentication providers, we may collect your name, email and
                    image. We refer to this information as{" "}
                    <strong>&quot;Entity Information.&quot;</strong>
                </p>
                <p>
                    In this Privacy Policy, the term{" "}
                    <strong>&quot;Personal Information&quot;</strong> encompasses both Device
                    Information and Entity Information.
                </p>
            </article>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">How We Use Your Personal Data</h2>
                <p>
                    Generally, the Personal Information we collect is primarily used to enhance your
                    website experience and ensure smooth functionality throughout.
                </p>
                <p>
                    This information helps us facilitate various actions within the website, such as
                    creating and deleting albums, uploading and deleting images, and managing user
                    interactions.
                </p>
                <p>
                    We may collect Device Information (in particular, your IP address) to help
                    ensure a secure and optimized experience for all users. This information may be
                    utilized for improving the overall performance and functionality of our website.
                </p>
            </article>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">How We Share Your Personal Data</h2>
                <p>
                    We may share your Personal Information with third-party services to facilitate
                    our use of your information, as outlined previously.
                </p>
                <p>
                    For instance, we utilize{" "}
                    <a
                        className="underline"
                        href="https://uploadthing.com/"
                        target="_blank"
                        referrerPolicy="no-referrer"
                    >
                        UploadThing
                    </a>{" "}
                    as our image host provider that handles uploading, storing and deleting of
                    images and we use{" "}
                    <a
                        className="underline"
                        href="https://stripe.com/"
                        target="_blank"
                        referrerPolicy="no-referrer"
                    >
                        Stripe
                    </a>{" "}
                    to help us with secure online payments.
                </p>
                <p>
                    Additionally, we may disclose your Personal Information in response to lawful
                    requests for information, including compliance with applicable laws and
                    regulations or to protect our legal rights.
                </p>
            </article>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">Your rights</h2>
                <p>
                    If you are a European resident, you have the right to access personal
                    information we hold about you and to ask that your personal information be
                    corrected, updated, or deleted. If you would like to exercise this right, please{" "}
                    <Link to="/contact">
                        <strong>
                            <u>contact us!</u>
                        </strong>
                    </Link>
                </p>
                <p>
                    Additionally, if you are a European resident we note that we are processing your
                    information in order to fulfill contracts we might have with you or otherwise to
                    pursue our legitimate business interests listed above.
                </p>
                <p>
                    Please note that your information might be transferred outside of Europe,
                    including the United States.
                </p>
            </article>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">Data retention</h2>
                <p>
                    When you create and delete albums and uploiad images on the Website, we will
                    maintain your Entity Information for our records unless and until you ask us to
                    delete this information or until you delete your account.
                </p>
                <p>
                    Deleting your account will result in deletion of all images you have sent, if
                    any, and your created albums, if any.
                </p>
            </article>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">Changes to This Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will post the updated
                    Privacy Policy on our website and update the Effective Date at the top of the
                    Privacy Policy.
                </p>
                <p>
                    Your continued use of our website after we make changes is deemed to be
                    acceptance of those changes, so please check the Privacy Policy periodically for
                    updates.
                </p>
            </article>
            <article className="flex flex-col items-start gap-2">
                <h2 className="font-semibold underline">Contact Us</h2>
                <p>
                    If you have any questions or comments about this Privacy Policy or our practices
                    regarding personal data, please{" "}
                    <Link to="/contact">
                        <strong>
                            <u>contact us!</u>
                        </strong>
                    </Link>
                </p>
            </article>
        </div>
    );
};

export default PrivacyPage;
