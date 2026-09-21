export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-ink">
      <h1 className="mb-2 font-display text-3xl font-semibold">
        Privacy Policy
      </h1>

      <p className="mb-8 text-muted">
        Last updated:{' '}
        {new Date().toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      {/* INTRODUCTION */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          1. Introduction
        </h2>

        <p className="mb-4">
          This Privacy Policy explains how <strong>BUANA Pty Ltd</strong>{' '}
          (&quot;BUANA&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) collects, uses, stores, processes, and protects
          personal information when users access or use the BUANA mobile
          application, website, products, services, delivery services,
          equipment services, and related digital platforms.
        </p>

        <p className="mb-4">
          BUANA Pty Ltd is the operator of the BUANA platform. The platform is
          developed, maintained, and technically supported by{' '}
          <strong>PT RHG Teknologi Indonesia</strong> as our technology
          development and support vendor.
        </p>

        <p className="mb-4">
          By accessing or using the BUANA platform, you acknowledge that your
          personal information may be processed in accordance with this Privacy
          Policy and applicable privacy and data protection requirements.
        </p>
      </section>

      {/* INFORMATION COLLECTED */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          2. Information We Collect
        </h2>

        <p className="mb-3">
          Depending on how you use our services, we may collect the following
          categories of information:
        </p>

        <h3 className="mb-2 mt-4 font-semibold">
          2.1 Account and Contact Information
        </h3>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>Full name</li>
          <li>Email address</li>
          <li>Telephone or mobile number</li>
          <li>Account identifier and authentication information</li>
          <li>Information associated with your BUANA user profile</li>
        </ul>

        <h3 className="mb-2 mt-4 font-semibold">
          2.2 Delivery and Address Information
        </h3>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>Delivery address</li>
          <li>Service address</li>
          <li>Saved addresses associated with your account</li>
          <li>
            Additional delivery or service instructions provided by you
          </li>
        </ul>

        <h3 className="mb-2 mt-4 font-semibold">
          2.3 Location Information
        </h3>

        <p className="mb-4">
          With the appropriate device permission, the BUANA application may
          access location information, including GPS-based location data.
          Location information may be used to determine delivery or service
          locations, improve address accuracy, support navigation, and provide
          real-time location functionality for deliveries or technician
          visits.
        </p>

        <p className="mb-4">
          Where applicable, location information may also be processed while a
          courier or technician is actively completing an assigned delivery or
          service request. Location access is used only where necessary for
          platform functionality and operational purposes.
        </p>

        <h3 className="mb-2 mt-4 font-semibold">
          2.4 Camera and Photographic Information
        </h3>

        <p className="mb-4">
          The application may request access to the device camera where
          required for operational features. Photographs may be captured or
          uploaded as evidence of delivery, proof of receipt, equipment
          condition, service documentation, maintenance documentation, or
          completion of a service request.
        </p>

        <h3 className="mb-2 mt-4 font-semibold">
          2.5 Order and Service Information
        </h3>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>Order history</li>
          <li>Products or equipment ordered</li>
          <li>Delivery status and related information</li>
          <li>Service and maintenance requests</li>
          <li>Technician assignment and service status</li>
          <li>Transaction references</li>
          <li>Warranty-related information where applicable</li>
        </ul>

        <h3 className="mb-2 mt-4 font-semibold">
          2.6 Device and Notification Information
        </h3>

        <p className="mb-4">
          We may process technical information required to operate the
          application, including device identifiers, push notification tokens,
          application version information, operating system information, and
          other technical information required to provide application
          functionality, notifications, security, diagnostics, and technical
          support.
        </p>
      </section>

      {/* USE */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          3. How We Use Your Information
        </h2>

        <p className="mb-3">
          Information collected through the BUANA platform may be used for the
          following purposes:
        </p>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>Creating and managing user accounts</li>
          <li>Authenticating users and protecting account access</li>
          <li>Processing product and equipment orders</li>
          <li>Managing delivery and fulfilment operations</li>
          <li>Scheduling service and maintenance appointments</li>
          <li>Assigning couriers, staff, or technicians where required</li>
          <li>
            Providing delivery, service, or technician location information
          </li>
          <li>Providing order and service status updates</li>
          <li>Sending transactional and operational notifications</li>
          <li>Providing customer support</li>
          <li>Managing warranties and equipment service records</li>
          <li>Maintaining the security and reliability of the platform</li>
          <li>Detecting and investigating technical issues</li>
          <li>Preventing misuse, fraud, or unauthorised access</li>
          <li>Improving application performance and functionality</li>
          <li>Complying with applicable legal and regulatory obligations</li>
        </ul>
      </section>

      {/* LOCATION */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          4. Location Data
        </h2>

        <p className="mb-4">
          Certain BUANA services depend on location information. For example,
          customers may use location information to identify a delivery or
          service address, while authorised couriers or technicians may use
          location functionality during an active delivery or service
          assignment.
        </p>

        <p className="mb-4">
          Where device permissions are required, you may control location
          access through your device settings. Disabling location permissions
          may cause certain location-dependent features of the application to
          become unavailable or function with reduced accuracy.
        </p>
      </section>

      {/* CAMERA */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          5. Camera and Photo Access
        </h2>

        <p className="mb-4">
          Camera access may be requested when a feature requires photographic
          documentation. This may include proof of delivery, evidence of
          equipment condition, service documentation, maintenance records, or
          confirmation that an assigned task has been completed.
        </p>

        <p className="mb-4">
          Camera access is subject to device permission controls. Users may
          manage camera permissions through their device settings.
        </p>
      </section>

      {/* NOTIFICATIONS */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          6. Push Notifications
        </h2>

        <p className="mb-4">
          BUANA may send push notifications relating to account activity,
          orders, deliveries, service requests, technician assignments,
          transaction updates, or other operational information.
        </p>

        <p className="mb-4">
          Push notifications may be delivered using third-party notification
          infrastructure. Users can manage notification permissions through
          their device settings.
        </p>
      </section>

      {/* THIRD PARTY */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          7. Third-Party Service Providers
        </h2>

        <p className="mb-4">
          We use third-party technology and infrastructure providers to operate
          certain features of the BUANA platform. These providers may process
          limited information where necessary to provide their respective
          services.
        </p>

        <p className="mb-3">
          Depending on the features being used, these services may include:
        </p>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase</strong> — database infrastructure,
            authentication, storage, and backend services.
          </li>

          <li>
            <strong>OneSignal</strong> — push notification infrastructure and
            notification delivery.
          </li>

          <li>
            <strong>Firebase Cloud Messaging (FCM)</strong> — notification
            delivery to supported mobile devices.
          </li>

          <li>
            Hosting, infrastructure, security, payment, mapping, communication,
            or other technology providers where required for platform
            operation.
          </li>
        </ul>

        <p className="mb-4">
          Information processed by third-party providers may also be subject to
          their respective privacy policies, security practices, and terms of
          service.
        </p>
      </section>

      {/* VENDOR */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          8. Technology Development and Support Vendor
        </h2>

        <p className="mb-4">
          <strong>PT RHG Teknologi Indonesia</strong> provides technology
          development, system integration, maintenance, infrastructure support,
          troubleshooting, application updates, and other technical services
          for the BUANA platform.
        </p>

        <p className="mb-4">
          In providing these services, authorised technical personnel may
          receive limited access to systems or information where reasonably
          necessary to investigate technical issues, maintain platform
          availability, resolve incidents, perform system maintenance, improve
          security, or provide technical support.
        </p>

        <p className="mb-4">
          Such access is intended to be limited to what is reasonably necessary
          for the relevant technical purpose and subject to applicable access
          controls and security requirements.
        </p>
      </section>

      {/* DATA SHARING */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          9. Sharing and Disclosure of Information
        </h2>

        <p className="mb-3">
          We may disclose information where reasonably necessary to operate the
          BUANA platform, including to:
        </p>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>
            Authorised BUANA staff involved in order, delivery, service, or
            customer support operations
          </li>

          <li>
            Couriers or technicians where information is required to complete
            an assigned delivery or service
          </li>

          <li>
            Technology vendors and infrastructure providers supporting the
            platform
          </li>

          <li>
            Payment or transaction service providers where required to process
            transactions
          </li>

          <li>
            Professional advisers, auditors, or service providers where
            reasonably necessary
          </li>

          <li>
            Government authorities, regulators, courts, or law enforcement
            agencies where disclosure is required or authorised by law
          </li>
        </ul>

        <p className="mb-4">
          We do not disclose personal information to third parties for purposes
          unrelated to providing, maintaining, securing, or legally operating
          the BUANA services unless authorised or required by applicable law.
        </p>
      </section>

      {/* SECURITY */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          10. Data Storage and Security
        </h2>

        <p className="mb-4">
          BUANA uses technical and organisational measures intended to protect
          personal information against unauthorised access, loss, misuse,
          alteration, disclosure, or destruction.
        </p>

        <p className="mb-4">
          The platform uses Supabase infrastructure for certain backend,
          authentication, database, and storage functions. Access controls may
          include authentication mechanisms, database permissions, and Row
          Level Security (RLS) policies where implemented.
        </p>

        <p className="mb-4">
          Access to administrative and operational systems is intended to be
          limited to authorised personnel according to their operational or
          technical responsibilities.
        </p>

        <p className="mb-4">
          While reasonable safeguards are used, no electronic transmission or
          storage system can be guaranteed to be completely secure. Users are
          also responsible for maintaining the confidentiality of their account
          credentials and for protecting access to their devices.
        </p>
      </section>

      {/* RETENTION */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          11. Data Retention
        </h2>

        <p className="mb-4">
          Personal information may be retained for as long as reasonably
          necessary to provide the services, maintain account and transaction
          records, resolve disputes, provide customer support, maintain
          security, comply with legal or regulatory requirements, and support
          legitimate business and operational requirements.
        </p>

        <p className="mb-4">
          Some information may need to be retained after an account is deleted
          where retention is required or permitted by applicable law, including
          records relating to transactions, accounting, taxation, fraud
          prevention, disputes, warranties, or legal obligations.
        </p>
      </section>

      {/* DELETION */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          12. Account and Data Deletion
        </h2>

        <p className="mb-4">
          Users may request deletion of their BUANA account and associated
          personal information. Requests may be submitted using the account
          deletion functionality provided by the platform, where available, or
          by contacting BUANA using the contact details below.
        </p>

        <p className="mb-4">
          Once a valid deletion request has been processed, personal
          information associated with the account will be deleted or
          de-identified where reasonably possible, except for information that
          must be retained for legal, regulatory, accounting, security,
          transaction, dispute resolution, warranty, or other legitimate
          purposes.
        </p>
      </section>

      {/* RIGHTS */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          13. Your Privacy Rights and Choices
        </h2>

        <p className="mb-3">
          Subject to applicable law and relevant exceptions, users may contact
          us regarding:
        </p>

        <ul className="mb-4 list-disc space-y-2 pl-5">
          <li>Access to personal information associated with their account</li>
          <li>Correction of inaccurate or outdated personal information</li>
          <li>Updating account and contact information</li>
          <li>Deletion of an account and associated personal information</li>
          <li>Questions about how personal information is processed</li>
          <li>Privacy-related complaints or concerns</li>
        </ul>

        <p className="mb-4">
          Device permissions such as location, camera, and notifications can
          also be managed through the privacy or application settings available
          on your device.
        </p>
      </section>

      {/* CHILDREN */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          14. Children&apos;s Privacy
        </h2>

        <p className="mb-4">
          The BUANA platform is intended for users who are legally capable of
          using the services and entering into the relevant transactions. We do
          not knowingly seek to collect personal information from children
          where such collection would be prohibited by applicable law.
        </p>

        <p className="mb-4">
          If you believe that personal information relating to a child has been
          provided to us inappropriately, please contact us so that the matter
          can be reviewed.
        </p>
      </section>

      {/* INTERNATIONAL PROCESSING */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          15. International Data Processing
        </h2>

        <p className="mb-4">
          Some technology providers supporting the BUANA platform may operate
          infrastructure or process information in locations outside
          Australia. As a result, information may be processed or stored in
          jurisdictions other than the jurisdiction in which the user is
          located.
        </p>

        <p className="mb-4">
          Where applicable, we take reasonable steps to ensure that the use of
          service providers and cross-border processing is managed in
          accordance with applicable privacy and data protection requirements.
        </p>
      </section>

      {/* CHANGES */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          16. Changes to This Privacy Policy
        </h2>

        <p className="mb-4">
          We may update this Privacy Policy from time to time to reflect
          changes to our services, application functionality, technology,
          business operations, legal requirements, or privacy practices.
        </p>

        <p className="mb-4">
          When this Privacy Policy is updated, the revised version will be
          published on this page and the &quot;Last updated&quot; date shown at
          the top of the policy will be updated accordingly.
        </p>
      </section>

      {/* CONTACT */}
      <section>
        <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
          17. Contact Us
        </h2>

        <p className="mb-5">
          If you have questions, concerns, requests, or complaints regarding
          this Privacy Policy or the handling of your personal information,
          please contact us using the details below.
        </p>

        <div className="mb-6 rounded-xl border border-black/10 p-5">
          <h3 className="mb-3 font-display text-base font-semibold">
            Application Operator
          </h3>

          <div className="space-y-2">
            <p>
              <strong>Company:</strong> BUANA Pty Ltd
            </p>

            <p>
              <strong>Address:</strong> 150 Pacific Highway, North Sydney,
              NSW 2060, Australia
            </p>

            <p>
              <strong>City:</strong> North Sydney
            </p>

            <p>
              <strong>State:</strong> New South Wales (NSW)
            </p>

            <p>
              <strong>Postcode:</strong> 2060
            </p>

            <p>
              <strong>Australia Phone:</strong> +61 482 388 431
            </p>

            <p>
              <strong>Email:</strong> info@buanaonline.com
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-5">
          <h3 className="mb-3 font-display text-base font-semibold">
            Technology Development &amp; Support Vendor
          </h3>

          <div className="space-y-2">
            <p>
              <strong>Company:</strong> PT RHG Teknologi Indonesia
            </p>

            <p>
              <strong>Office:</strong> Plaza Indonesia
            </p>

            <p>
              <strong>Address:</strong> Jl. M.H. Thamrin No. 28–30,
              RT.9/RW.5, Gondangdia, Menteng, Central Jakarta, Special Capital
              Region of Jakarta 10350, Indonesia
            </p>

            <p>
              <strong>Email:</strong> info@rhgteknologiindonesia.id
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 border-t border-black/10 pt-6 text-xs text-muted">
        <p>
          This Privacy Policy applies to the BUANA mobile application, website,
          and related digital services operated by BUANA Pty Ltd.
        </p>
      </div>
    </div>
  )
}

