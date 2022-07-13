// Styles
import styles from '@/styles/Terms.module.scss';

// Images
import fileIcon from '@/images/icons/file.svg';
import pattern from '@/images/elements/pattern.svg';

// Components
import { DefaultHead } from "@/components/DefaultHead"
import { StaticNavbar } from "@/components/Navbar"

export const TermsPage = () => {
  return (
    <div>
      <StaticNavbar />
      <DefaultHead />
      <div className={styles.header}>
        <img className="mb-2" src={fileIcon.src} alt="" />
        <h1 className="nm text gray-800 size-22 weight-600">Terms of Service</h1>
        <p className="nm text gray-400 size-22 weight-500 mt-1">Here are the terms for using Wordcel</p>
        <img className={styles.headerPattern} src={pattern.src} alt="" />
      </div>
      <div className="width-100 flex justify-content-center mt-4 mb-4">
        <div className="main-padding wide-max-width xl">
          <h1 className="text gray-600 size-24 weight-700 mt-4">Introduction</h1>
          <p className="text gray-500 size-16 weight-400">Your use of Wordcel’s website and services is governed by the terms and conditions herein. You shall be bound by these terms and conditions of use and service, so please read the document carefully before proceeding.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">About Wordcel Club</h1>
          <p className="text gray-500 size-16 weight-400">Wordcel is owned and operated by Coffee To Code Technologies Pte Ltd, having its registered office at 3 Fraser Street, #05-25 Duo Tower, Singapore 189352, Singapore. All correspondence is to be made to the same address, or when applicable, to support@wordcel.club. This domain and all its subdomains are owned and operated by Coffee To Code Technologies Pte Ltd, and all related services therein are also provided by the same.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Parties</h1>

          <p className="text gray-500 size-16 weight-400">
            (a). The terms "we", "us", "website", "platform", and "Wordcel Club" refer to Coffee To Code Technologies Pte Ltd, and its agents and employees;
            (b). The terms "you", "user", "reader", refer to users of the platform (individuals, and otherwise);
            (c). The terms "writer", refers specifically to such users that upload their written content to their page on Wordcel’s platform, (individuals, and otherwise);
            (d). All aforementioned parties may be referred to collectively as "parties".
          </p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Wordcel Club as a platform</h1>

          <p className="text gray-500 size-16 weight-400">Wordcel Club shall only operate as an intermediary platform allowing its users to (a) create a public profile, (b) create a blog, on a personally owned domain or otherwise, and (c) publish their own content on a decentralised storage solution. With regard to such functionality, Wordcel is a mere intermediary platform, has no control over the actions of their users, and shall not be liable for any cause of action arising therefrom.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Content guidelines</h1>

          <p className="text gray-500 size-16 weight-400">
            (a). User agrees to not impersonate any other person, or upload any content that is false, offensive, harmful, obscene, hateful, pornographic, defamatory, libellous, or in breach of any third party intellectual property rights, using the Wordcel platform. Uploading such content may open up the user to third party legal action.
            (b). Content uploaded by users shall be saved on the decentralised storage network provided by Arweave. Arweave’s nodes may take down any content that is found to be in breach of their content policies. Read more here.
            (c). Any complaints or infringement notices from any aggrieved third parties regarding content that has not been found to be in breach by Arweave and continues to be hosted as per (b), if received by Wordcel Club, shall be redirected to the relevant User who has published on Wordcel Club. In such instances, Wordcel Club may share User information submitted at the time of signing up, i.e. Twitter username, .SOL domain, and email address, enabling the aggrieved third party to contact the User directly.
          </p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Limitation of Liability</h1>

          <p className="text gray-500 size-16 weight-400">Wordcel Club has no control over and bears no responsibility for any content uploaded using the Wordcel Club platform except that on https://wordcelclub.com/wordcelclub.sol.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">User Eligibility</h1>

          <p className="text gray-500 size-16 weight-400">By using this website, you represent that you are at least eighteen (18) years of age, and otherwise too competent to enter into a valid contract; or if you’re between thirteen (13) and eighteen (18) years old, your educational institution, parent, or guardian has agreed to these terms on your behalf. Children below the age of thirteen (13) are not permitted to use Wordcel Club. If you are under 13, or between 13 and 18 and do not have your parents’ consent, then you are not permitted to use Wordcel Club.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Intellectual Property</h1>

          <p className="text gray-500 size-16 weight-400">The User declares that they own all intellectual property rights to the content uploaded by them using the Wordcel Club platform, and such uploads breaches no private agreement or the intellectual property rights of any third party. Once uploaded, User shall be fully and independently responsible for such content uploaded.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Payments, fees, and transactions</h1>

          <p className="text gray-500 size-16 weight-400">All payments made or received as upload fees, minting fees, or subscription payments, shall be made via listed crypto assets, on the Solana blockchain. By using Wordcel Club, the user agrees to the same, and acknowledges and takes responsibility for the risks inherently involved in using such a technology.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Indemnification</h1>

          <p className="text gray-500 size-16 weight-400">User agrees to defend, indemnify, and hold Wordcel Club, its agents, affiliates, officers, directors, employees, suppliers, and consultants, harmless from any and all claims including third-party claims, liability, damages, and costs (including, but not limited to, attorneys' fees) arising from or related to, (a) their use of the platform, (b) their conduct in violation of these terms, and (c) any other illegal conduct solely by them on their accord.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Rights reserved</h1>

          <p className="text gray-500 size-16 weight-400">
            Wordcel Club reserves the right to:
            Charge a fees for access to the platform in the future, which is currently free, and to subsequently change such amount;
            Restrict access to the platform in countries which by law prohibit such platforms.
          </p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Changes</h1>

          <p className="text gray-500 size-16 weight-400">We reserve the right to update this Agreement from time to time. With each change, we shall notify the relevant users by way of a banner on our website, or by an email, based on the significance of the changes. Continuing usage of the website will then imply acceptance of the new terms of the Agreement.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Governing law and dispute resolution</h1>

          <p className="text gray-500 size-16 weight-400">These Wordcel Club Terms of Use (“Terms'') shall be governed by the laws of the Republic of Singapore, and Courts of Singapore shall have exclusive jurisdiction over any disputes arising therefrom shall be referred to, and resolved by arbitration in Singapore in accordance with the Arbitration Rules of the Singapore International Arbitration Centre (“SIAC Rules”), which are incorporated herein by reference. There shall be one (1) arbitrator, and the proceedings shall be conducted in English. Courts of Singapore shall have jurisdiction over any dispute between the parties that is not subject to arbitration.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4">Miscellaneous</h1>

          <p className="text gray-500 size-20 weight-600 mt-4">Entire agreement</p>

          <p className="text gray-500 size-16 weight-400">These terms contain all the terms applicable to the use of the website, and supersedes all other previous undocumented communication and representation and agreements between the parties.</p>

          <p className="text gray-500 size-20 weight-600 mt-4">Severability</p>

          <p className="text gray-500 size-16 weight-400">In the event of any clause here being declared unenforceable or invalid by law, then only such clause or part thereof shall be struck, and all the remaining provisions shall remain in full force and effect.</p>

          <h1 className="text gray-600 size-24 weight-700 mt-4 mt-4">Contact Information</h1>

          <p className="text gray-500 size-16 weight-400">For any kind of extra information, contact support@wordcel.club.</p>

        </div>
      </div>
    </div>
  )
};
