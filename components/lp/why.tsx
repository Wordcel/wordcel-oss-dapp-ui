import styles from '@/styles/Home.module.scss';

// Image imports
import quill from '@/images/icons/quill.svg';
import ownIcon from '@/images/lp/icons/own.svg';
import ossIcon from '@/images/lp/icons/oss.svg';
import writeIcon from '@/images/lp/icons/write.svg';

function Reason({
  heading,
  text,
  icon
}: {
  heading: string;
  text: string;
  icon: string;
}) {
  return (
    <div className={styles.whyReason}>
      <div className={styles.whyImage}>
        <img src={icon} alt="" />
      </div>
      <p className="text nm font-2 weight-600 gray-800 size-28">{heading}</p>
      <p className="text nm font-2 weight-400 gray-400 size-20 mt-1-5">{text}</p>
    </div>
  );
}

const reasons = [{
  icon: ownIcon.src,
  heading: "Truly own your content",
  text: "Wordcel allows you to blog and distribute your content with complete ownership."
}, {
  icon: ossIcon.src,
  heading: "Open-sourced",
  text: "Wordcel is powered by Gum - An open source protocol for building sticky consumer apps"
}, {
  icon: writeIcon.src,
  heading: "Seamless UX",
  text: "Wordcel offers a carefully iterated world-class reading and blogging experience."
}];

function WhySection() {
  return (
    <div className={styles.whySection}>
      <div className={styles.whySectionContent}>
        <img src={quill.src} alt="" />
        <p className="text center nm font-2 weight-700 gray-900 size-48 mt-1-5">So why should you blog on Wordcel?</p>
      </div>
      <div className={styles.whyVectors}>
        {reasons.map((r, index) => (
          <Reason
            key={index}
            heading={r.heading}
            text={r.text}
            icon={r.icon}
          />
        ))}
      </div>
    </div>
  );
}

export { WhySection };
