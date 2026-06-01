import {
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiCalendar,
  FiHeart,
  FiCreditCard,
  FiHelpCircle,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";

export const NAV_ITEMS = [
  { key: "matches", label: "Matches", path: "/matches", icon: FiUserCheck },
  { key: "users", label: "Users", path: "/users", icon: FiUsers },
  {
    key: "courses",
    label: "Courses & Content",
    path: "/courses-content",
    icon: FiBookOpen,
  },
  { key: "events", label: "Events", path: "/events", icon: FiCalendar },
  {
    key: "mentorship",
    label: "Mentorship",
    path: "/mentorship",
    icon: FiHeart,
  },
  { key: "billing", label: "Billing", path: "/billing", icon: FiCreditCard },
  {
    key: "support",
    label: "Support / Help Queries",
    path: "/support",
    icon: FiHelpCircle,
  },
  {
    key: "messages",
    label: "Messages",
    path: "/messages",
    icon: FiMessageSquare,
  },
  { key: "settings", label: "Settings", path: "/settings", icon: FiSettings },
];
