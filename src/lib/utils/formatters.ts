import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatters = {
  relativeTime: (date: string) => dayjs(date).fromNow(),
};