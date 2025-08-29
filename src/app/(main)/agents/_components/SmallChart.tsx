import React from "react";

export const SmallChart = () => {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="63"
        height="20"
        viewBox="0 0 63 20"
        fill="none"
        className="absolute -top-[0.5px] -left-[0.5px]"
      >
        <path
          d="M1 19C1 19 12.294 7.79618 20.5912 7.52112C26.1158 7.33798 28.9583 13.2502 34.3942 11.8645C39.826 10.4798 40.6764 1.33181 46.1934 1.00608C50.8242 0.732684 52.7599 9.77982 57.1022 7.52112C59.5795 6.23253 62 1.00608 62 1.00608"
          stroke="#808080"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="61"
        height="18"
        viewBox="0 0 61 18"
        fill="none"
      >
        <path
          d="M19.5912 6.52112C11.294 6.79618 0 18 0 18H61V0.00608132C61 0.00608132 58.5795 5.23252 56.1022 6.52112C51.7599 8.77982 49.8242 -0.267316 45.1934 0.00608132C39.6764 0.331805 38.826 9.47975 33.3942 10.8645C27.9583 12.2502 25.1158 6.33798 19.5912 6.52112Z"
          fill="url(#paint0_linear_6190_130776)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_6190_130776"
            x1="58.7737"
            y1="5.59038"
            x2="-0.679157"
            y2="12.2161"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#CCE5CC" />
            <stop offset="1" stop-color="#CCE5CC" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
export const RedSmallChart = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="63"
      height="17"
      viewBox="0 0 63 17"
      fill="none"
    >
      <path
        d="M1 16.5498C1 16.5498 9.67651 6.1034 17.3271 5.66508C22.9188 5.34472 25.3438 9.8398 30.9331 10.2004C37.8782 10.6485 38.1827 -0.305758 44.9926 1.12981C51.7186 2.54773 62 16.5498 62 16.5498"
        stroke="#808080"
        stroke-width="0.453532"
      />
      <path
        d="M17.3271 5.66741C9.67651 6.10573 1 16.5522 1 16.5522H62C62 16.5522 51.4919 2.77681 44.7658 1.3589C37.9559 -0.076674 37.8782 10.6508 30.9331 10.2027C25.3438 9.84213 22.9188 5.34706 17.3271 5.66741Z"
        fill="url(#paint0_linear_6190_130793)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6190_130793"
          x1="31.5"
          y1="5.4576"
          x2="31.5"
          y2="16.5521"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#B16060" />
          <stop offset="1" stop-color="#B16060" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
