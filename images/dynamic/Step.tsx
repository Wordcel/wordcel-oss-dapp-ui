import * as React from "react";

function Step({
  step
}: {
  step: number
}) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="13" fill="#F1F5F9"/>
      <text fill="#94A3B8" xmlSpace="preserve" fontFamily="Inter" fontSize="11" fontWeight="500" letterSpacing="0em"><tspan x="10" y="16.5">{step}</tspan></text>
    </svg>
  );
}

function Done() {
  return (
    <svg
      width={22}
      height={22}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C4.925 0 0 4.925 0 11s4.925 11 11 11 11-4.925 11-11S17.075 0 11 0zm4.768 9.14a1 1 0 10-1.536-1.28l-4.3 5.159-2.225-2.226a1 1 0 00-1.414 1.414l3 3a1.001 1.001 0 001.475-.067l5-6z"
        fill="#1E293B"
      />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.468 6.647a.726.726 0 10-1.117-.93L7.223 9.467 5.605 7.85a.727.727 0 00-1.028 1.029l2.182 2.182a.726.726 0 001.072-.05l3.637-4.363z"
        fill="#64758B"
      />
    </svg>
  )
}

export { Step, Done, SmallCheckIcon };