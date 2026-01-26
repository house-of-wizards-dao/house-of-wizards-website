type PageTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  subtitleClassName?: string;
};

export const PageTitle = ({
  title,
  subtitle,
  className = "",
  subtitleClassName = "",
}: PageTitleProps) => {
  return (
    <>
      <h1
        className={`sm:text-7xl text-6xl font-atirose text-brand-500 w-full text-center ${className}`}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`font-quad text-sm text-gray-400 text-center uppercase max-w-5xl ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}

      <div className="w-full my-4">
        <svg
          className="w-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 330 8"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_453_22)">
            <path
              d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
              fill="transparent"
            />
            <path
              d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
              stroke="#A986D9"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <defs>
            <clipPath id="clip0_453_22">
              <rect fill="white" height="8" width="330" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </>
  );
};
