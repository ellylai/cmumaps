import { useCallback, useEffect, useRef } from "react";

import EventDisplay from "@/components/carnival/events/displays/Event";
import {
  throttledHandleScroll,
  throttleFetchPrevious,
} from "@/components/carnival/events/displays/handleScroll";
import { useGetEventsInfiniteQuery } from "@/store/features/api/eventApiSlice";

interface Props {
  timestamp: number;
  filters: string[];
  reqs: string[];
}

const InfiniteScrollWrapper = ({ timestamp, filters, reqs }: Props) => {
  const scrollTop = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    hasPreviousPage,
    hasNextPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetEventsInfiniteQuery(
    { filters, reqs },
    { initialPageParam: { timestamp } },
  );

  const fetchNext = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const fetchPrevious = useCallback(() => {
    if (hasPreviousPage) {
      fetchPreviousPage();
    }
  }, [hasPreviousPage, fetchPreviousPage]);

  // Continue to fetch previous page if the user is on the top with a throttle
  useEffect(() => {
    if (data?.pages && data.pages.length !== 1 && scrollTop.current === 0) {
      throttleFetchPrevious(fetchPrevious);
    }
  }, [fetchPrevious, data?.pages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    throttledHandleScroll(e, fetchNext, fetchPrevious, scrollTop);
  };

  if (!data) {
    return <></>;
  }

  const events = data.pages.map((page) => page.events).flat();
  return (
    <div
      className="flex flex-col overflow-auto"
      onScroll={handleScroll}
      ref={scrollContainerRef}
    >
      {/* Display your items directly without the InfiniteScroll components */}
      {events.map((event) => (
        <div
          key={event.id}
          className="my-2 rounded border border-blue-500 bg-gray-100 p-2"
        >
          <EventDisplay event={event} />
        </div>
      ))}
    </div>
  );
};

export default InfiniteScrollWrapper;
