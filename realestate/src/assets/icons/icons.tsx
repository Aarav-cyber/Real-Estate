type FavoriteProps = {
  isActive?: boolean;
};

export const Favorite = ({ isActive = false }: FavoriteProps) => {
  return (
    <svg
      width="41"
      height="39"
      viewBox="0 0 41 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.5 35.5L20.5 30L10 35.5L13 24L4 16.5L16 15L20.5 4L25.5 15L37 16.5L28.5 24L30.5 35.5Z"
        fill={isActive ? "#FFAC28 ":'white'}
        stroke={isActive ? "#FFAC28 ":'#AAAAAA'}
        stroke-width="3"
      />
    </svg>
  );
};
