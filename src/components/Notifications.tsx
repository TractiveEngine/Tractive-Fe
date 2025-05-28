import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface OnboardingData {
  state: string;
  CAC: string;
  address: string;
  mobile: string;
  alternativeMobile: string;
  businessName: string;
  interests: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: string;
  read: boolean;
  image: string;
  action?: React.ReactNode;
}

export const Notifications = () => {
  const onboardingData: OnboardingData | null = (() => {
    try {
      const data = localStorage.getItem("onboarding-data");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing onboarding-Data:", error);
      return null;
    }
  })();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: `Dear ${onboardingData?.businessName || "User"}`,
      message:
        "Your order (123456) has arrived and it is ready for pick up at 12 benz road by john tel enterprises. contact: 09034145971.",
      time: "2hours ago",
      category: "Orders",
      read: false,
      image: "/images/orderedItem.png",
      action: (
        <Image
          src="/images/mapImage.png"
          alt="Map Image"
          width={503}
          height={147}
          onError={() => console.error("Failed to load mapImage.png")}
        />
      ),
    },
    {
      id: "2",
      title: "Congratulations",
      message:
        "You are the highest bidder of the just concluded 3 bags of tomatoes biding with the sum of $40 dollars.",
      time: "2hours ago",
      category: "Biddings",
      read: false,
      image: "/images/biddingImageWon.png",
      action: (
        <Link
          href="/buyers/my-biddings"
          className="flex items-center justify-center w-[27%] h-[35px] bg-[#2a942a] rounded-[2px] mt-4"
        >
          <span className="font-montserrat font-normal text-[13px] text-[#fefefe]">
            Checkout Item
          </span>
        </Link>
      ),
    },
    {
      id: "3",
      title: "Payment failed",
      message:
        "Your payment of $400 for (123456) was not successful, please try again or contact the admin for more info.",
      time: "2hours ago",
      category: "Biddings",
      read: false,
      image: "/images/GreenImage.png",
      action: (
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-[27%] h-[35px] bg-[#2a942a] rounded-[2px] mt-4">
            <span className="font-montserrat font-normal text-[14px] text-[#fefefe]">
              Try again
            </span>
          </button>
          <button className="flex items-center justify-center w-[27%] h-[35px] bg-[#CCE5CC] border-[1px] border-[#808080] rounded-[2px] mt-4">
            <span className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
              Contact admin
            </span>
          </button>
        </div>
      ),
    },
    {
      id: "4",
      title: "Bidding Successful",
      message:
        "Your payment of $400 for (123456) was not successful, please try again or contact the admin for more info.",
      time: "2hours ago",
      category: "Biddings",
      read: false,
      image: "/images/GreenImage.png",
      action: (
        <Link
          href="/buyers/wish-list"
          className="flex items-center justify-center w-[27%] h-[35px] bg-[#2a942a] rounded-[2px] mt-4"
        >
          <span className="font-montserrat font-normal text-[14px] text-[#fefefe]">
            View Bidding
          </span>
        </Link>
      ),
    },
  ]);

  const handleMarkAllRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("Mark all as read clicked");
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  if (!onboardingData) {
    console.warn("No onboarding data found, rendering error message");
    return <div className="text-red-500">No onboarding data found.</div>;
  }

  console.log("Rendering notifications:", notifications);

  return (
    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
      <style jsx>{`
        .custom-AllRadio {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid #538e53;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }
        .custom-AllRadio:checked::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: #538e53;
          border-radius: 50%;
        }
        .custom-AllRadio:checked {
          border-color: #538e53;
        }
      `}</style>
      <div className="flex items-center justify-between px-5">
        <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
          Notifications
        </p>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="custom-AllRadio"
            onChange={handleMarkAllRead}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="font-montserrat font-normal text-[13.6px] text-[#2b2b2b]">
            Mark all as read
          </span>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-5 py-2 text-gray-500">
          No notifications available
        </div>
      ) : (
        notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <div
              className={`w-[100%] ${
                notification.read ||
                notification.title ===
                  `Dear ${onboardingData?.businessName || "User"}`
                  ? "bg-[#f1f1f1]"
                  : "bg-[#fefefe]"
              }`}
            >
              <div className="flex flex-col px-5 pt-5">
                <div className="flex gap-[19px]">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <p
                        className={`font-montserrat font-medium text-[13.6px] ${
                          notification.title === "Congratulations" ||
                          notification.title === "Bidding Successful"
                            ? "text-[#538e53]"
                            : notification.title === "Payment failed"
                            ? "text-[#C23939]"
                            : "text-[#2b2b2b]"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="font-montserrat font-normal text-[13.6px] text-[#2b2b2b]">
                        {notification.message}
                      </p>
                    </div>
                    <span className="font-montserrat font-normal text-[13.6px] text-[#808080]">
                      {notification.time}. {notification.category}
                    </span>
                  </div>
                  <Image
                    src={notification.image}
                    alt="Notification Image"
                    width={135}
                    height={144}
                    onError={() =>
                      console.error(
                        `Failed to load image: ${notification.image}`
                      )
                    }
                  />
                </div>
                {notification.action}
              </div>
            </div>
            {index < notifications.length - 1 && (
              <div className="w-[100%] h-[1px] border-t-[1px] border-[#808080]"></div>
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};
