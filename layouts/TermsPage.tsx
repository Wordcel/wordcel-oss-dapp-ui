import styles from '@/styles/Terms.module.scss';
import { DefaultHead } from "@/components/DefaultHead"
import { StaticNavbar } from "@/components/Navbar"

export const TermsPage = () => {
  return (
    <div>
      <StaticNavbar />
      <DefaultHead />
      <div className={styles.header}>
        <h1 className="nm text gray-800 size-22 weight-600">Terms of Service</h1>
        <p className="nm text gray-400 size-22 weight-500 mt-1">Here are the terms for using Wordcel</p>
      </div>
    </div>
  )
};
