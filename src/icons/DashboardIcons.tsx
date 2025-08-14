"use client";
import React from "react";

interface IconProps {
  stroke?: string;
  className?: string;
  fill?: string;
}

export const OverviewIcon = ({stroke="#2b2b2b", fill="#2b2b2b"}: IconProps) => {
  return (
    <div className="flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="5"
        viewBox="0 0 19 5"
        fill="none"
      >
        <rect width="19" height="0.95" rx="0.475" fill={fill} />
        <rect
          y="3.16699"
          width="4.43333"
          height="0.95"
          rx="0.475"
          fill={fill}
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="13"
        viewBox="0 0 16 17"
        fill="none"
      >
        <path
          d="M9.40078 4.06602H13.2008M9.40078 5.96602H11.3008M13.8341 8.18268C13.8341 11.5077 11.1424 14.1993 7.81745 14.1993C4.49245 14.1993 1.80078 11.5077 1.80078 8.18268C1.80078 4.85768 4.49245 2.16602 7.81745 2.16602M14.4674 14.8327L13.2008 13.566"
          stroke={stroke}
          strokeWidth="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="5"
        viewBox="0 0 19 5"
        fill="none"
      >
        <rect
          y="0.199219"
          width="4.43333"
          height="0.95"
          rx="0.475"
          fill={fill}
        />
        <rect
          y="3.68359"
          width="19"
          height="0.95"
          rx="0.475"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export const AddToStoreIcon = ({stroke="#2b2b2b"}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M4.5 9H13.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.5V4.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ProduceListIcon = ({stroke='#2b2b2b'}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M2.25781 8.78906V12.1566C2.25781 15.5241 3.60781 16.8741 6.97531 16.8741H11.0178C14.3853 16.8741 15.7353 15.5241 15.7353 12.1566V8.78906"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00036 9.375C10.3729 9.375 11.3854 8.2575 11.2504 6.885L10.7554 1.875H7.25286L6.75036 6.885C6.61536 8.2575 7.62786 9.375 9.00036 9.375Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7333 9.375C15.2483 9.375 16.3583 8.145 16.2083 6.6375L15.9983 4.575C15.7283 2.625 14.9783 1.875 13.0133 1.875H10.7258L11.2508 7.1325C11.3783 8.37 12.4958 9.375 13.7333 9.375ZM4.23077 9.375C5.46827 9.375 6.58577 8.37 6.70577 7.1325L6.87077 5.475L7.23077 1.875H4.94327C2.97827 1.875 2.22827 2.625 1.95827 4.575L1.75577 6.6375C1.60577 8.145 2.71577 9.375 4.23077 9.375ZM9.00077 13.125C7.74827 13.125 7.12577 13.7475 7.12577 15V16.875H10.8758V15C10.8758 13.7475 10.2533 13.125 9.00077 13.125Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const FarmersIcon = ({ stroke = "#2b2b2b", fill = "#D9D9D9" }: IconProps) => {
  return (
    <div className="flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
        className="relative top-[0.2rem] w-[14px] h-[14px] lg:w-[18px] lg:h-[18px]"
      >
        <mask id="path-1-inside-1_10041_90658" fill="white">
          <path d="M11.9189 7.673C11.9189 9.49381 11.4083 11.2401 10.4995 12.5276C9.59063 13.8151 8.358 14.5384 7.07272 14.5384C5.78744 14.5384 4.5548 13.8151 3.64597 12.5276C2.73714 11.2401 2.22656 9.49382 2.22656 7.673L7.07272 7.673H11.9189Z" />
        </mask>
        <path
          d="M11.9189 7.673C11.9189 9.49381 11.4083 11.2401 10.4995 12.5276C9.59063 13.8151 8.358 14.5384 7.07272 14.5384C5.78744 14.5384 4.5548 13.8151 3.64597 12.5276C2.73714 11.2401 2.22656 9.49382 2.22656 7.673L7.07272 7.673H11.9189Z"
          stroke={stroke}
          strokeWidth="2.42308"
          mask="url(#path-1-inside-1_10041_90658)"
        />
        <mask id="path-2-inside-2_10041_90658" fill="white">
          <path d="M0.612078 8.48047C0.612078 7.08808 1.29285 5.75272 2.50462 4.76816C3.71639 3.78359 5.35991 3.23047 7.07362 3.23047C8.78732 3.23047 10.4308 3.78359 11.6426 4.76816C12.8544 5.75272 13.5352 7.08808 13.5352 8.48047L7.07362 8.48047L0.612078 8.48047Z" />
        </mask>
        <path
          d="M0.612078 8.48047C0.612078 7.08808 1.29285 5.75272 2.50462 4.76816C3.71639 3.78359 5.35991 3.23047 7.07362 3.23047C8.78732 3.23047 10.4308 3.78359 11.6426 4.76816C12.8544 5.75272 13.5352 7.08808 13.5352 8.48047L7.07362 8.48047L0.612078 8.48047Z"
          stroke={stroke}
          strokeWidth="2.42308"
          mask="url(#path-2-inside-2_10041_90658)"
        />
        <path
          d="M0.612078 8.48047C0.612078 7.08808 1.29285 5.75272 2.50462 4.76816C3.71639 3.78359 5.35991 3.23047 7.07362 3.23047C8.78732 3.23047 10.4308 3.78359 11.6426 4.76816C12.8544 5.75272 13.5352 7.08808 13.5352 8.48047L7.07362 8.48047L0.612078 8.48047Z"
          stroke={stroke}
          strokeOpacity="0.2"
          strokeWidth="2.42308"
          mask="url(#path-2-inside-2_10041_90658)"
        />
      </svg>
      <div className="flex flex-col items-center justify-center h-[0rem]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4"
          height="4"
          viewBox="0 0 4 4"
          fill="none"
        >
          <rect
            x="0.662861"
            y="0.932392"
            width="0.403846"
            height="2.01923"
            fill={fill}
            stroke={stroke}
            strokeWidth ="0.403846"
          />
          <rect
            x="3.08864"
            y="0.932392"
            width="0.403846"
            height="2.01923"
            fill={fill}
            stroke={stroke}
            strokeWidth="0.403846"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="6"
          viewBox="0 0 17 6"
          fill="none"
          className="relative -top-[7px] w-[14px] h-[14px] lg:w-[18px] lg:h-[18px]"
        >
          <path
            d="M8.07715 0.951172C10.2578 0.951193 12.2061 1.26154 13.5879 1.74512C14.2816 1.98791 14.7999 2.26356 15.1328 2.53906C15.4696 2.81776 15.5479 3.0351 15.5479 3.17285C15.5478 3.31062 15.4694 3.52809 15.1328 3.80664C14.7999 4.08208 14.2814 4.35687 13.5879 4.59961C12.2061 5.08322 10.2579 5.39353 8.07715 5.39355C5.89631 5.39355 3.94726 5.08325 2.56543 4.59961C1.87191 4.35684 1.35339 4.0821 1.02051 3.80664C0.683952 3.52812 0.605554 3.31061 0.605469 3.17285C0.605469 3.03514 0.683955 2.81765 1.02051 2.53906C1.35342 2.26358 1.87182 1.9879 2.56543 1.74512C3.94726 1.26147 5.89631 0.951172 8.07715 0.951172Z"
            stroke={stroke}
            strokeWidth="1.21154"
          />
        </svg>
      </div>
    </div>
  );
};

export const BidsIcon = ({stroke="#2b2b2b", fill="#2b2b2b"}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <rect
        x="1.03646"
        y="1.28451"
        width="14.9306"
        height="8.24167"
        rx="1.6125"
        stroke={stroke}
        strokeWidth="1.79167"
      />
      <rect
        x="7.66406"
        y="10.4238"
        width="1.67222"
        height="6.68889"
        fill={fill}
      />
    </svg>
  );
};



export const Bag2Icon: React.FC<IconProps> = ({ stroke = "#292d32"  }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M6.4629 6.58955V5.82564C6.4629 4.05368 7.88834 2.31322 9.6603 2.14784C10.1526 2.09947 10.6497 2.15472 11.1194 2.31002C11.5891 2.46533 12.0211 2.71727 12.3875 3.04961C12.754 3.38195 13.0468 3.78733 13.2472 4.23967C13.4475 4.69201 13.5509 5.18129 13.5507 5.67601V6.76281M7.6442 17.8749H12.3694C15.5353 17.8749 16.1023 16.607 16.2677 15.0634L16.8584 10.3382C17.071 8.41663 16.5197 6.84943 13.157 6.84943H6.85667C3.49388 6.84943 2.94261 8.41663 3.15524 10.3382L3.7459 15.0634C3.91128 16.607 4.47831 17.8749 7.6442 17.8749Z"
        stroke={stroke}
        strokeWidth="1.1813"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7569 10H12.7648M7.24414 10H7.25044"
        stroke={stroke}
        strokeWidth="1.57507"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PackedIcon = ({stroke = "#292d32"}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M1.5 6.75V5.25C1.5 3 3 1.5 5.25 1.5H12.75C15 1.5 16.5 3 16.5 5.25V6.75"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 11.25V12.75C1.5 15 3 16.5 5.25 16.5H12.75C15 16.5 16.5 15 16.5 12.75V11.25"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.02539 6.94531L9.00039 9.24782L12.9454 6.96033"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.3277V9.24023"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.06968 4.71742L5.66968 6.05244C5.12968 6.35244 4.67969 7.10994 4.67969 7.73244V10.2749C4.67969 10.8974 5.12218 11.6549 5.66968 11.9549L8.06968 13.2899C8.57968 13.5749 9.41968 13.5749 9.93718 13.2899L12.3372 11.9549C12.8772 11.6549 13.3272 10.8974 13.3272 10.2749V7.73244C13.3272 7.10994 12.8847 6.35244 12.3372 6.05244L9.93718 4.71742C9.41968 4.42492 8.57968 4.42492 8.06968 4.71742Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BoxTickIcon = ({ stroke = "#292d32" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M17.2509 13.4323C17.2659 13.9948 17.1159 14.5273 16.8459 14.9848C16.6959 15.2548 16.4934 15.5023 16.2684 15.7048C15.7509 16.1848 15.0684 16.4773 14.3109 16.4998C13.2159 16.5223 12.2484 15.9598 11.7159 15.0973C11.4309 14.6548 11.2584 14.1223 11.2509 13.5598C11.2284 12.6148 11.6484 11.7598 12.3234 11.1973C12.8334 10.7773 13.4784 10.5148 14.1834 10.4998C15.8409 10.4623 17.2134 11.7748 17.2509 13.4323Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0801 13.5226L13.8376 14.2426L15.4051 12.7275"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.37891 5.58008L9.0014 9.41257L15.5789 5.60255"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00195 16.2078V9.40527"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2079 6.8775V11.1225C16.2079 11.16 16.208 11.19 16.2005 11.2275C15.6755 10.77 15.0005 10.5 14.2505 10.5C13.5455 10.5 12.893 10.7475 12.3755 11.16C11.6855 11.7075 11.2505 12.555 11.2505 13.5C11.2505 14.0625 11.4079 14.595 11.6854 15.045C11.7529 15.165 11.8355 15.2775 11.9255 15.3825L10.553 16.14C9.69796 16.62 8.30295 16.62 7.44795 16.14L3.44296 13.92C2.53545 13.4175 1.79297 12.1575 1.79297 11.1225V6.8775C1.79297 5.8425 2.53545 4.58252 3.44296 4.08002L7.44795 1.86C8.30295 1.38 9.69796 1.38 10.553 1.86L14.558 4.08002C15.4655 4.58252 16.2079 5.8425 16.2079 6.8775Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const MoneyReceiveIcon: React.FC<IconProps> = ({
  stroke = "#292d32",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M7.125 10.3122C7.125 11.0397 7.68751 11.6247 8.37751 11.6247H9.78749C10.3875 11.6247 10.875 11.1147 10.875 10.4772C10.875 9.79468 10.575 9.54719 10.1325 9.38969L7.875 8.60218C7.4325 8.44468 7.13251 8.20469 7.13251 7.51469C7.13251 6.88469 7.61999 6.36719 8.21999 6.36719H9.63C10.32 6.36719 10.8825 6.95219 10.8825 7.67969"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5.625V12.375"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 1.5 13.14 1.5 9C1.5 4.86 4.86 1.5 9 1.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MoneyReceive2Icon: React.FC<IconProps> = ({
  stroke = "#292d32",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M7.125 10.3122C7.125 11.0397 7.68751 11.6247 8.37751 11.6247H9.78749C10.3875 11.6247 10.875 11.1147 10.875 10.4772C10.875 9.79468 10.575 9.54719 10.1325 9.38969L7.875 8.60218C7.4325 8.44468 7.13251 8.20469 7.13251 7.51469C7.13251 6.88469 7.61999 6.36719 8.21999 6.36719H9.63C10.32 6.36719 10.8825 6.95219 10.8825 7.67969"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5.625V12.375"
        stroke={stroke}
      strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 1.5 13.14 1.5 9C1.5 4.86 4.86 1.5 9 1.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 2.25V5.25H15.75"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 1.5L12.75 5.25"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Profile2UserIcon: React.FC<IconProps> = ({
  stroke = "#292d32",
  fill = "#2b2b2b",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M6.87088 8.715H6.81087C6.76619 8.70749 6.72056 8.70749 6.67587 8.715C4.50087 8.6475 2.85838 6.9375 2.85838 4.83C2.85838 2.685 4.60587 0.9375 6.75087 0.9375C8.89587 0.9375 10.6434 2.685 10.6434 4.83C10.6359 6.9375 8.98588 8.6475 6.89337 8.715H6.87088ZM6.75087 2.0625C6.0175 2.06448 5.31472 2.35669 4.79614 2.87527C4.27757 3.39385 3.98535 4.09662 3.98338 4.83C3.98338 6.33 5.15337 7.5375 6.64587 7.59C6.69088 7.5825 6.78837 7.5825 6.88587 7.59C8.35588 7.5225 9.51087 6.315 9.51838 4.83C9.5164 4.09662 9.22418 3.39385 8.70561 2.87527C8.18703 2.35669 7.48425 2.06448 6.75087 2.0625ZM12.4051 8.8125C12.3826 8.8125 12.3601 8.8125 12.3376 8.805C12.0301 8.835 11.7151 8.6175 11.6851 8.31C11.6551 8.0025 11.8426 7.725 12.1501 7.6875C12.2401 7.68 12.3376 7.68 12.4201 7.68C13.5151 7.62 14.3701 6.72 14.3701 5.6175C14.3701 4.4775 13.4476 3.555 12.3076 3.555C12.2341 3.55599 12.1611 3.54237 12.0929 3.51493C12.0247 3.48748 11.9627 3.44676 11.9103 3.39512C11.858 3.34348 11.8164 3.28197 11.7881 3.21414C11.7597 3.14631 11.7451 3.07352 11.7451 3C11.7451 2.6925 12.0001 2.4375 12.3076 2.4375C13.1524 2.43948 13.962 2.77594 14.5593 3.37329C15.1567 3.97063 15.4931 4.78023 15.4951 5.625C15.4951 7.35 14.1451 8.745 12.4276 8.8125H12.4051ZM6.88062 16.9125C5.41062 16.9125 3.93313 16.5375 2.81563 15.7875C1.77313 15.0975 1.20312 14.1525 1.20312 13.125C1.20312 12.0975 1.77313 11.145 2.81563 10.4475C5.06563 8.955 8.71062 8.955 10.9456 10.4475C11.9806 11.1375 12.5581 12.0825 12.5581 13.11C12.5581 14.1375 11.9881 15.09 10.9456 15.7875C9.82063 16.5375 8.35063 16.9125 6.88062 16.9125ZM3.43812 11.3925C2.71812 11.8725 2.32812 12.4875 2.32812 13.1325C2.32812 13.77 2.72562 14.385 3.43812 14.8575C5.30562 16.11 8.45563 16.11 10.3231 14.8575C11.0431 14.3775 11.4331 13.7625 11.4331 13.1175C11.4331 12.48 11.0356 11.865 10.3231 11.3925C8.45563 10.1475 5.30562 10.1475 3.43812 11.3925ZM13.7551 15.5625C13.4926 15.5625 13.2601 15.3825 13.2076 15.1125C13.1786 14.9665 13.2078 14.8149 13.2891 14.6901C13.3704 14.5654 13.4973 14.4774 13.6426 14.445C14.1151 14.3475 14.5501 14.16 14.8876 13.8975C15.3151 13.575 15.5476 13.17 15.5476 12.7425C15.5476 12.315 15.3151 11.91 14.8951 11.595C14.5651 11.34 14.1526 11.16 13.6651 11.0475C13.5192 11.0142 13.3924 10.9245 13.3123 10.7981C13.2322 10.6716 13.2054 10.5187 13.2376 10.3725C13.3051 10.0725 13.6051 9.8775 13.9126 9.945C14.5576 10.0875 15.1201 10.3425 15.5776 10.695C16.2751 11.22 16.6726 11.9625 16.6726 12.7425C16.6726 13.5225 16.2676 14.265 15.5701 14.7975C15.1051 15.1575 14.5201 15.42 13.8751 15.5475C13.8301 15.5625 13.7926 15.5625 13.7551 15.5625Z"
        fill={fill}
        stroke={stroke}
      />
    </svg>
  );
};

export const MessageStarIcon: React.FC<IconProps> = ({ stroke = "#292d32" }) => {
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        className="relative w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
      >
        <path
          d="M12.75 12.8223H9.75L6.4125 15.0423C6.29987 15.1173 6.16896 15.1604 6.03375 15.167C5.89854 15.1735 5.7641 15.1432 5.64476 15.0793C5.52543 15.0154 5.42568 14.9203 5.35616 14.8041C5.28663 14.688 5.24994 14.5551 5.25 14.4198V12.8223C3 12.8223 1.5 11.3223 1.5 9.07227V4.57227C1.5 2.32227 3 0.822266 5.25 0.822266H12.75C15 0.822266 16.5 2.32227 16.5 4.57227V9.07227C16.5 11.3223 15 12.8223 12.75 12.8223Z"
          stroke={stroke}
          strokeWidth="1.125"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="7"
        viewBox="0 0 6 7"
        fill="none"
        className="absolute top-[3.7px] lg:top-[3.7px] left-[4.59px] lg:left-[5.59px] w-[5px] h-[6px] lg:w-[6px] lg:h-[7px]"
      >
        <g clip-path="url(#clip0_10041_90784)">
          <path
            d="M3.43223 1.37766L3.87223 2.25766C3.93223 2.38016 4.09223 2.49766 4.22723 2.52016L5.02473 2.65266C5.53473 2.73766 5.65473 3.10766 5.28723 3.47266L4.66723 4.09266C4.56223 4.19766 4.50473 4.40016 4.53723 4.54516L4.71473 5.31266C4.85473 5.92016 4.53223 6.15516 3.99473 5.83766L3.24723 5.39516C3.11223 5.31516 2.88973 5.31516 2.75223 5.39516L2.00473 5.83766C1.46973 6.15516 1.14473 5.91766 1.28473 5.31266L1.46223 4.54516C1.49473 4.40016 1.43723 4.19766 1.33223 4.09266L0.712233 3.47266C0.347233 3.10766 0.464733 2.73766 0.974733 2.65266L1.77223 2.52016C1.90473 2.49766 2.06473 2.38016 2.12473 2.25766L2.56473 1.37766C2.80473 0.900156 3.19473 0.900156 3.43223 1.37766Z"
            stroke={stroke}
            strokeWidth="1.125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10041_90784">
            <rect
              width="6"
              height="6"
              fill="white"
              transform="translate(0 0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export const MessagesIcon: React.FC<IconProps> = ({
  stroke = "#292d32",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <g clip-path="url(#clip0_10041_90800)">
        <path
          d="M12.75 6.75C12.75 9.6525 10.23 12 7.125 12L6.4275 12.84L6.015 13.335C5.6625 13.755 4.9875 13.665 4.755 13.1625L3.75 10.95C2.385 9.99 1.5 8.4675 1.5 6.75C1.5 3.8475 4.02 1.5 7.125 1.5C9.39 1.5 11.3475 2.7525 12.225 4.5525C12.5625 5.22 12.75 5.9625 12.75 6.75Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.25 6.75023H9M16.5 9.64523C16.5 11.3627 15.615 12.8852 14.25 13.8452L13.245 16.0577C13.0125 16.5602 12.3375 16.6577 11.985 16.2302L10.875 14.8952C9.06 14.8952 7.44 14.0927 6.4275 12.8402L7.125 12.0002C10.23 12.0002 12.75 9.65273 12.75 6.75023C12.75 5.96273 12.5625 5.22023 12.225 4.55273C14.6775 5.11523 16.5 7.18523 16.5 9.64523Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_10041_90800">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const MessageQuestionIcon: React.FC<IconProps> = ({ stroke = "#292d32" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M13.1016 14.2064H10.0182L6.58802 16.488C6.47226 16.5652 6.33772 16.6095 6.19875 16.6162C6.05979 16.6229 5.92161 16.5918 5.79896 16.5261C5.67631 16.4604 5.57379 16.3627 5.50233 16.2433C5.43088 16.1239 5.39317 15.9874 5.39323 15.8483V14.2064C3.08073 14.2064 1.53906 12.6647 1.53906 10.3522V5.72721C1.53906 3.41471 3.08073 1.87305 5.39323 1.87305H13.1016C15.4141 1.87305 16.9557 3.41471 16.9557 5.72721V10.3522C16.9557 12.6647 15.4141 14.2064 13.1016 14.2064Z"
        stroke={stroke}
        strokeWidth="1.15625"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.24833 8.75684V8.59496C9.24833 8.07079 9.57208 7.79329 9.89583 7.56975C10.2119 7.35392 10.5279 7.07642 10.5279 6.56767C10.5279 5.8585 9.9575 5.28809 9.24833 5.28809C8.53917 5.28809 7.96875 5.8585 7.96875 6.56767M9.24448 10.5991H9.25219"
        stroke={stroke}
        strokeWidth="1.15625"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LogoutIcon: React.FC<IconProps> = ({
  stroke = "#292d32",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px] "
    >
      <path
        d="M13.0803 10.965L15.0003 9.045L13.0803 7.125M7.32031 9.045H14.9478M8.82031 15C5.50531 15 2.82031 12.75 2.82031 9C2.82031 5.25 5.50531 3 8.82031 3"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const CalenderIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
      >
        <path
          d="M6 2V4.25M12 2V4.25M2.625 7.3175H15.375M15.75 6.875V13.25C15.75 15.5 14.625 17 12 17H6C3.375 17 2.25 15.5 2.25 13.25V6.875C2.25 4.625 3.375 3.125 6 3.125H12C14.625 3.125 15.75 4.625 15.75 6.875Z"
          stroke="#2B2B2B"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.7715 10.7754H11.7782M11.7715 13.0254H11.7782M8.99645 10.7754H9.00395M8.99645 13.0254H9.00395M6.2207 10.7754H6.2282M6.2207 13.0254H6.2282"
          stroke="#2B2B2B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
}
// export const NameIcon = () => {
//     return (

//     )
// }
