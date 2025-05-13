declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

// 필요한 경우 추가
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
