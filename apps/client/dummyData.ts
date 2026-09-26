const terms = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: UserCheck,
    content: (
      <>
        <p>
          By accessing or using this website, you agree to be bound by these
          Terms and Conditions. If you do not agree with any part of these
          terms, please do not use our website or services.
        </p>

        <p>
          These Terms apply to all visitors, customers, and other users who
          access or use our website.
        </p>
      </>
    ),
  },
  {
    id: "products",
    title: "2. Products and Availability",
    icon: ShoppingBag,
    content: (
      <>
        <p>
          We make every effort to ensure that product descriptions, images,
          prices, sizes, colors, and availability are accurate.
        </p>

        <p>
          However, colors may appear differently depending on your device
          display, and product availability may change without notice.
        </p>

        <p>
          We reserve the right to limit quantities or discontinue products at
          any time.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "3. Orders and Payments",
    icon: Package,
    content: (
      <>
        <p>
          When you place an order, you are making an offer to purchase the
          selected products.
        </p>

        <p>
          We reserve the right to accept or decline an order for reasons
          including product availability, pricing errors, payment issues, or
          suspected fraudulent activity.
        </p>

        <p>
          Orders are only considered confirmed after successful payment
          authorization or confirmation of the selected payment method.
        </p>
      </>
    ),
  },
  {
    id: "shipping",
    title: "4. Shipping and Delivery",
    icon: Package,
    content: (
      <>
        <p>
          We will make reasonable efforts to deliver orders within the estimated
          delivery timeframe displayed during checkout.
        </p>

        <p>
          Delivery times may vary depending on your location, shipping provider,
          weather, holidays, or circumstances outside our control.
        </p>

        <p>
          Customers are responsible for providing accurate delivery information.
          We are not responsible for delays caused by incorrect or incomplete
          addresses.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    title: "5. Returns and Refunds",
    icon: RefreshCcw,
    content: (
      <>
        <p>
          Returns and refunds are subject to our return policy and the
          applicable consumer protection laws.
        </p>

        <p>
          Products must generally be returned in their original condition,
          including packaging and any included accessories, where applicable.
        </p>

        <p>
          Please review our return instructions before sending a product back.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "6. Customer Accounts",
    icon: UserCheck,
    content: (
      <>
        <p>
          If you create an account, you are responsible for maintaining the
          confidentiality of your account information and password.
        </p>

        <p>
          You agree to provide accurate and up-to-date information when creating
          or updating your account.
        </p>

        <p>
          Please notify us immediately if you believe your account has been
          accessed without authorization.
        </p>
      </>
    ),
  },
  {
    id: "intellectual",
    title: "7. Intellectual Property",
    icon: FileText,
    content: (
      <>
        <p>
          All content on this website, including logos, graphics, images,
          product descriptions, text, designs, and software, is owned by or
          licensed to us unless otherwise stated.
        </p>

        <p>
          You may not reproduce, distribute, modify, or use our content for
          commercial purposes without our prior written permission.
        </p>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "8. Prohibited Use",
    icon: AlertCircle,
    content: (
      <>
        <p>You agree not to use our website to:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Violate any applicable law or regulation.</li>
          <li>Attempt to gain unauthorized access to our systems.</li>
          <li>Interfere with the operation or security of the website.</li>
          <li>Submit fraudulent orders or payment information.</li>
          <li>Use automated systems to abuse or overload the website.</li>
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    icon: AlertCircle,
    content: (
      <>
        <p>
          To the maximum extent permitted by applicable law, we will not be
          liable for indirect, incidental, special, or consequential damages
          arising from your use of our website or products.
        </p>

        <p>
          Nothing in these Terms is intended to exclude or limit any liability
          that cannot legally be excluded or limited.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to These Terms",
    icon: FileText,
    content: (
      <>
        <p>
          We may update these Terms and Conditions from time to time. Updated
          terms will be posted on this page with a revised effective date.
        </p>

        <p>
          Your continued use of the website after changes are posted means that
          you acknowledge the updated terms.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: FileText,
    content: (
      <>
        <p>
          If you have questions about these Terms and Conditions, please contact
          us.
        </p>

        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <p className="font-medium">Your Store Name</p>
          <p className="mt-1 text-muted-foreground">
            Email: support@yourstore.com
          </p>
          <p className="text-muted-foreground">Phone: +20 100 000 0000</p>
        </div>
      </>
    ),
  },
];

const sections = [
  {
    id: "information",
    title: "1. Information We Collect",
    icon: Database,
    content: (
      <>
        <p>
          When you use our website, create an account, place an order, or
          contact us, we may collect information that you provide directly.
        </p>

        <h3 className="font-semibold text-foreground">
          Information you may provide includes:
        </h3>

        <ul className="list-disc space-y-2 pl-6">
          <li>Name and contact information.</li>
          <li>Email address and phone number.</li>
          <li>Shipping and billing information.</li>
          <li>Account credentials.</li>
          <li>Order and purchase information.</li>
          <li>Messages you send to our support team.</li>
        </ul>
      </>
    ),
  },
  {
    id: "automatic",
    title: "2. Information Collected Automatically",
    icon: Eye,
    content: (
      <>
        <p>
          When you browse our website, certain technical information may be
          collected automatically.
        </p>

        <p>This may include:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>IP address.</li>
          <li>Browser type and device information.</li>
          <li>Pages visited and interactions with our website.</li>
          <li>Referring website or source.</li>
          <li>Date and time of visits.</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "3. How We Use Your Information",
    icon: UserRound,
    content: (
      <>
        <p>We may use collected information to:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Process and fulfill your orders.</li>
          <li>Provide customer support.</li>
          <li>Send order confirmations and updates.</li>
          <li>Manage your customer account.</li>
          <li>Improve our products and website.</li>
          <li>Prevent fraud and protect our services.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "4. Payments",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          Payments may be processed through third-party payment providers. We
          may not directly store complete payment card details on our servers.
        </p>

        <p>
          Payment providers may process your information according to their own
          privacy policies and security practices.
        </p>

        <p>
          Please replace this section with the exact payment providers used by
          your store.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies and Similar Technologies",
    icon: Cookie,
    content: (
      <>
        <p>
          We may use cookies and similar technologies to remember preferences,
          maintain sessions, improve website functionality, and understand how
          visitors use our website.
        </p>

        <p>
          Some cookies may be provided by third-party services that we use to
          operate or improve our website.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "6. Sharing Your Information",
    icon: Database,
    content: (
      <>
        <p>
          We may share information with trusted service providers when necessary
          to operate our business.
        </p>

        <p>For example, information may be shared with:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Payment processors.</li>
          <li>Shipping and delivery providers.</li>
          <li>Hosting and infrastructure providers.</li>
          <li>Customer support services.</li>
          <li>Analytics or security providers.</li>
        </ul>

        <p>
          We do not sell your personal information merely for the purpose of
          selling it to third parties.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "7. Data Security",
    icon: Lock,
    content: (
      <>
        <p>
          We take reasonable technical and organizational measures to protect
          your personal information from unauthorized access, loss, misuse, or
          disclosure.
        </p>

        <p>
          However, no method of transmission or storage over the internet can be
          guaranteed to be completely secure.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "8. Data Retention",
    icon: FileText,
    content: (
      <>
        <p>
          We retain personal information for as long as reasonably necessary to
          provide our services, complete transactions, resolve disputes,
          maintain business records, and comply with applicable legal
          requirements.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "9. Your Privacy Rights",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          Depending on your location and applicable law, you may have rights
          regarding your personal information, including the right to request
          access, correction, deletion, or restriction of certain processing.
        </p>

        <p>
          To make a privacy-related request, please contact us using the
          information below.
        </p>
      </>
    ),
  },
  {
    id: "communications",
    title: "10. Marketing Communications",
    icon: Bell,
    content: (
      <>
        <p>
          If you choose to receive promotional communications from us, we may
          send you information about new products, offers, and updates.
        </p>

        <p>
          You can unsubscribe from marketing emails at any time by following the
          unsubscribe instructions included in the message.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    icon: UserRound,
    content: (
      <>
        <p>
          Our website is not intended to knowingly collect personal information
          from children where such collection is prohibited by applicable law.
        </p>

        <p>
          If you believe a child has provided personal information to us, please
          contact us so that we can review and take appropriate action.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to This Privacy Policy",
    icon: FileText,
    content: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect changes to
          our practices, services, or legal requirements.
        </p>

        <p>
          Any updates will be posted on this page along with the revised
          effective date.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "13. Contact Us",
    icon: Mail,
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or how we handle your
          information, please contact us.
        </p>

        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <p className="font-medium">Your Store Name</p>

          <p className="mt-1 text-muted-foreground">
            Email: privacy@yourstore.com
          </p>

          <p className="text-muted-foreground">Phone: +20 100 000 0000</p>
        </div>
      </>
    ),
  },
];