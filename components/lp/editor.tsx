import styles from '@/styles/Home.module.scss';
import vector from '@/images/lp/editor.svg';

function EditorSection() {
  return (
    <div className={[styles.spaceBetweenContainer, styles.marginTopLarge].join(" ")}>
      <div className={styles.editorSectionMaxWidth}>
        <p className="text nm font-2 weight-600 gray-400 size-20">EDITOR</p>
        <p className="text nm font-2 weight-700 gray-900 size-48 mt-1-5">Seamless editing like never before</p>
        <p className="text nm font-2 weight-400 gray-400 size-24 mt-1-5">Wordcel’s editor offers a world-class editing experience that is fast, intuitive and easy to use</p>
      </div>
      <img className={styles.editorVector} src={vector.src} alt="" />
    </div>
  );
}

export { EditorSection };