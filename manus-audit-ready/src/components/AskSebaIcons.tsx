// src/components/AskSebaIcons.tsx — أيقونات Header مخصصة
export function NotificationBellIcon({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} >
      <defs>
        <linearGradient id="bellGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#db9b02" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#db9b02" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#bellGlow)" />
      <path d="M12 4.5C10.067 4.5 8.5 6.067 8.5 8V9.382C8.5 10.007 8.248 10.607 7.811 11.043L6.646 12.207C5.99 12.863 6.457 14 7.393 14H16.607C17.543 14 18.01 12.863 17.354 12.207L16.189 11.043C15.752 10.607 15.5 10.007 15.5 9.382V8C15.5 6.067 13.933 4.5 12 4.5Z" stroke="#db9b02" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 17C10.5 18.105 11.395 19 12.5 19C13.605 19 14.5 18.105 14.5 17" stroke="#db9b02" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="3.5" r="0.75" fill="#db9b02" opacity="0.3" />
    </svg>
  );
}

export function UserAvatarIcon({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} >
      <defs>
        <linearGradient id="userGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#db9b02" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#db9b02" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#userGlow)" />
      <circle cx="12" cy="9" r="3.2" stroke="#db9b02" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M6 19.5C6 16.742 8.686 14.5 12 14.5C15.314 14.5 18 16.742 18 19.5" stroke="#db9b02" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="13.8" cy="7.8" r="0.75" fill="#db9b02" opacity="0.25" />
    </svg>
  );
}
