import styles from '@/styles/Dashboard.module.scss';

export const DashboardBox = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${styles.dashboardBox} ${className ? className : ''}`}>
      {children}
    </div>
  )
}