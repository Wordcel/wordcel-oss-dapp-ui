import createIcon from '@/images/icons/create-icon.svg';

export const CreateButton = (props: any) => {
  return (
    <button className="create-btn" {...props}>
      <img src={createIcon.src} alt="" />
      <span>Create New</span>
    </button>
  );
}