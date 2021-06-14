import DashboardIcon from "@material-ui/icons/Dashboard";
import ImageIcon from "@material-ui/icons/Image";

export const resources = [
  {
    name: "dashboard",
    to: "/",
    exact: true,
    Icon: DashboardIcon,
  },
  {
    name: "images",
    to: "/images",
    exact: true,
    Icon: ImageIcon,
  },
];
