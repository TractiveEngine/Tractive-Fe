"use client";
import React from "react";

interface ArrowIconProps {
  className?: string;
  stroke?: string;
}

export const XModalIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <line
        x1="3.98183"
        y1="5.01873"
        x2="12.5076"
        y2="13.5154"
        stroke="#2B2B2B"
        strokeWidth="0.752294"
      />
      <line
        x1="13.0272"
        y1="5.00356"
        x2="4.53045"
        y2="13.5293"
        stroke="#2B2B2B"
        strokeWidth="0.752294"
      />
    </svg>
  );
};

export const ProfileIcon = ({
  className = "",
  stroke = "#2b2b2b",
}: ArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="23"
      viewBox="0 0 19 23"
      fill="none"
      className={className}
    >
      <path
        d="M18.0899 21.5C18.0899 17.63 14.2399 14.5 9.49991 14.5C4.75991 14.5 0.909912 17.63 0.909912 21.5M9.49991 11.5C10.826 11.5 12.0978 10.9732 13.0354 10.0355C13.9731 9.09785 14.4999 7.82608 14.4999 6.5C14.4999 5.17392 13.9731 3.90215 13.0354 2.96447C12.0978 2.02678 10.826 1.5 9.49991 1.5C8.17383 1.5 6.90206 2.02678 5.96438 2.96447C5.0267 3.90215 4.49991 5.17392 4.49991 6.5C4.49991 7.82608 5.0267 9.09785 5.96438 10.0355C6.90206 10.9732 8.17383 11.5 9.49991 11.5Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowLeftIcon = ({
  className = "",
  stroke = "#2b2b2b",
}: ArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 9 18"
      fill="none"
      className={className}
    >
      <path
        d="M8.04883 1.07992L1.52883 7.59992C0.758828 8.36992 0.758828 9.62992 1.52883 10.3999L8.04883 16.9199"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ArrowRightIcon = ({
  className = "",
  stroke = "#2b2b2b",
}: ArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 9 18"
      fill="none"
      className={className}
    >
      <path
        d="M0.951172 16.9201L7.47117 10.4001C8.24117 9.63008 8.24117 8.37008 7.47117 7.60008L0.951172 1.08008"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const GalleryAddIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
    >
      <path
        d="M16.3381 18.2772C17.2819 18.2772 18.1871 17.9023 18.8545 17.2349C19.5219 16.5675 19.8968 15.6623 19.8968 14.7184C19.8968 13.7746 19.5219 12.8694 18.8545 12.202C18.1871 11.5346 17.2819 11.1597 16.3381 11.1597C15.3942 11.1597 14.489 11.5346 13.8216 12.202C13.1542 12.8694 12.7793 13.7746 12.7793 14.7184C12.7793 15.6623 13.1542 16.5675 13.8216 17.2349C14.489 17.9023 15.3942 18.2772 16.3381 18.2772Z"
        stroke="#808080"
        strokeWidth="0.492754"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.4556 4.04224H16.338C7.4411 4.04224 3.88232 7.60101 3.88232 16.498V27.1743C3.88232 36.0712 7.4411 39.63 16.338 39.63H27.0144C35.9113 39.63 39.4701 36.0712 39.4701 27.1743V18.2773"
        stroke="#808080"
        strokeWidth="0.492754"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.3491 9.38038H38.1358M33.2424 14.2737V4.48706"
        stroke="#808080"
        strokeWidth="0.492754"
        strokeLinecap="round"
      />
      <path
        d="M5.07471 34.2027L13.8471 28.313C15.2528 27.3699 17.2813 27.4767 18.5447 28.5621L19.1319 29.0781C20.5198 30.2703 22.7618 30.2703 24.1497 29.0781L31.552 22.7257C32.9399 21.5335 35.182 21.5335 36.5699 22.7257L39.4703 25.2168"
        stroke="#808080"
        strokeWidth="0.492754"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};


export const I24SupportIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 18.8598H17.24C16.44 18.8598 15.68 19.1698 15.12 19.7298L13.41 21.4198C12.63 22.1898 11.36 22.1898 10.58 21.4198L8.87 19.7298C8.31 19.1698 7.54 18.8598 6.75 18.8598H6C4.34 18.8598 3 17.5298 3 15.8898V4.97977C3 3.33977 4.34 2.00977 6 2.00977H18C19.66 2.00977 21 3.33977 21 4.97977V15.8898C21 17.5198 19.66 18.8598 18 18.8598Z"
        stroke="#2B2B2B"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 9.15912C7 8.22912 7.76 7.46912 8.69 7.46912C9.62 7.46912 10.38 8.22912 10.38 9.15912C10.38 11.0391 7.71 11.2391 7.12 13.0291C7 13.3991 7.31 13.7691 7.7 13.7691H10.38M16.04 13.7591V8.04912C16.0405 7.92277 15.9998 7.7997 15.924 7.69862C15.8482 7.59754 15.7414 7.52398 15.62 7.48912C15.4977 7.45459 15.3676 7.46024 15.2488 7.50525C15.1299 7.55026 15.0287 7.63224 14.96 7.73912C14.24 8.89912 13.46 10.2191 12.78 11.3791C12.67 11.5691 12.67 11.8191 12.78 12.0091C12.89 12.1991 13.1 12.3191 13.33 12.3191H17"
        stroke="#2B2B2B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};