"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  useMarkAllNotificationsRead,
  useNotifications,
} from "@/hooks/queries/useNotificationQueries";
import type { AppNotification } from "@/services/notificationService";

const toneForTitle = (title?: string) => {
  if (!title) return "text-[#2b2b2b]";
  const lower = title.toLowerCase();
  if (lower.includes("congrat") || lower.includes("success")) {
    return "text-[#538e53]";
  }
  if (lower.includes("fail") || lower.includes("error") || lower.includes("reject")) {
    return "text-[#C23939]";
  }
  if (lower.includes("counter")) {
    return "text-[#004085]";
  }
  return "text-[#2b2b2b]";
};

const formatTime = (iso: string) => {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
};

export const Notifications = () => {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const { mutate: markAllRead, isPending: isMarking } =
    useMarkAllNotificationsRead();

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="w-full flex flex-col gap-4 max-h-[500px] overflow-y-auto">
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

      <div className="flex items-center justify-between px-5 pt-1">
        <p className="font-montserrat font-medium text-[14px] text-[#2b2b2b]">
          Notifications
        </p>
        <button
          type="button"
          onClick={() => markAllRead()}
          disabled={!hasUnread || isMarking}
          className="flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <input
            type="checkbox"
            className="custom-AllRadio pointer-events-none"
            checked={!hasUnread}
            readOnly
          />
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            Mark all as read
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-[#538e53] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="px-5 py-6 text-center text-[#808080] font-montserrat text-[13px]">
          Couldn&apos;t load notifications. Try again later.
        </div>
      ) : notifications.length === 0 ? (
        <div className="px-5 py-6 text-center text-[#808080] font-montserrat text-[13px]">
          You&apos;re all caught up.
        </div>
      ) : (
        notifications.map((n: AppNotification, index) => {
          const title = n.title || n.type || "Notification";
          const time = formatTime(n.createdAt);
          const category = n.type || "";
          const body = (
            <div className="flex flex-col px-5 pt-5">
              <div className="flex flex-col sm:flex-row gap-[19px]">
                <div className="flex flex-col gap-6 min-w-0 flex-1">
                  <div className="flex flex-col gap-2">
                    <p
                      className={`font-montserrat font-medium text-[13.6px] ${toneForTitle(title)}`}
                    >
                      {title}
                    </p>
                    <p className="font-montserrat font-normal text-[12px] sm:text-[13.6px] text-[#2b2b2b]">
                      {n.message}
                    </p>
                  </div>
                  <span className="font-montserrat font-normal text-[12.5px] sm:text-[13px] text-[#808080]">
                    {time}
                    {category ? ` · ${category}` : ""}
                  </span>
                </div>
                {n.image && (
                  <Image
                    src={n.image}
                    alt={title}
                    width={135}
                    height={144}
                    className="w-full h-auto max-w-[135px] max-h-[144px] object-cover"
                  />
                )}
              </div>
            </div>
          );

          return (
            <React.Fragment key={n._id}>
              <div
                className={`w-full min-w-0 ${
                  n.isRead ? "bg-[#f1f1f1]" : "bg-[#fefefe]"
                }`}
              >
                {n.link ? (
                  <Link href={n.link} className="block hover:bg-[#f6f6f6]">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </div>
              {index < notifications.length - 1 && (
                <div className="w-full h-[1px] border-t-[1px] border-[#e2e2e2]"></div>
              )}
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};
