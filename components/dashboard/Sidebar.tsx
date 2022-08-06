// Style imports
import styles from '@/styles/Dashboard.module.scss';

// Image imports
import createIcon from '@/images/icons/create-icon-sm.svg';
import articlesIcon from '@/images/icons/sidebar/articles.svg';
import profileIcon from '@/images/icons/sidebar/profile.svg';
import arrowRight from '@/images/icons/arrow-right.svg';
// import importIcon from '@/images/icons/sidebar/import.svg';
// import inviteIcon from '@/images/icons/sidebar/invite.svg';
import { useRouter } from 'next/router';
import { useSidebar } from '../Context';


const links = [
  {name: "Articles", icon: articlesIcon.src, href: "/dashboard"},
  {name: "Profile", icon: profileIcon.src, href: "/dashboard/profile"},
  // {name: "Import", icon: importIcon.src, href: "/dashboard/import"},
  // {name: "Invite", icon: inviteIcon.src, href: "/dashboard/invite"},
]

function Sidebar () {
  const state = useSidebar();
  const { asPath, push } = useRouter();
  return (
    <>
      {state && (
        <div className={`${styles.sidebar} ${state.collapsed ? '' : styles.expandedSidebar}`}>
          <div
            onClick={() => state.setCollapsed(!state.collapsed)}
            className={`${styles.toggleParent} ${state.collapsed ? '' : styles.toggleExpanded}`}
          >
            <img
              src={arrowRight.src}
              alt=""
              className={styles.sidebarToggle}
              style={{ transform: `rotate(${state.collapsed ? 0 : 180}deg)` }}
            />
          </div>
          <button className={styles.createButton} onClick={() => push('/dashboard/new')}>
            <img src={createIcon.src} alt="" />
            <span>Create New</span>
          </button>
          {links.map((link) => (
            <div
              key={link.name}
              className={`${styles.linkParent} ${asPath === link.href ? styles.active : ''}`}
              onClick={() => push(link.href)}
            >
              <div className={styles.sidebarLink}>
                <img src={link.icon} alt={link.name} />
                <span>{link.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export { Sidebar };