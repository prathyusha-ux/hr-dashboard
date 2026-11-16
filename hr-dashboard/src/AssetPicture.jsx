/* Simple drawings stand in for a product photo. */
export default function AssetPicture({ category }) {
  const monitor = category === "Monitor";
  return (
    <svg viewBox="0 0 216 150" width="100%" role="img" aria-label={`${category} illustration`}>
      <defs>
        <linearGradient id="adBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9d4f7" />
          <stop offset="1" stopColor="#bdb6ee" />
        </linearGradient>
        <linearGradient id="adScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b2a7a" />
          <stop offset="0.55" stopColor="#8f5fd0" />
          <stop offset="1" stopColor="#e07fb4" />
        </linearGradient>
      </defs>
      <rect width="216" height="150" fill="url(#adBg)" />
      {monitor ? (
        <>
          <rect x="44" y="26" width="128" height="80" rx="6" fill="#2b2f45" />
          <rect x="49" y="31" width="118" height="70" rx="3" fill="url(#adScreen)" />
          <rect x="102" y="106" width="12" height="16" fill="#6b7089" />
          <rect x="82" y="122" width="52" height="6" rx="3" fill="#6b7089" />
        </>
      ) : (
        <>
          <rect x="54" y="26" width="108" height="76" rx="6" fill="#2b2f45" />
          <rect x="59" y="31" width="98" height="66" rx="3" fill="url(#adScreen)" />
          <path d="M34 106h148l-8 14a6 6 0 0 1-5 3H47a6 6 0 0 1-5-3z" fill="#8a8fa8" />
          <rect x="92" y="106" width="32" height="4" rx="2" fill="#6b7089" />
        </>
      )}
    </svg>
  );
}