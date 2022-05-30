import toast from "react-hot-toast";

const emojis = ['🤠', '😃', '😇', '🙃'];
const text = 'We automatically save your work every 15 seconds';
const positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];

const getRandom = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const saveToast = () => {
  toast(text,
    {
      icon: getRandom(emojis),
      style: {
        borderRadius: '1rem',
        background: '#333',
        color: '#fff',
      },
      position: getRandom(positions)
    }
  );
};
