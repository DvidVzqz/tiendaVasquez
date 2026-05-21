import { useEffect, useRef } from "react";
import { useInfiniteQuery, type QueryFunction } from "@tanstack/react-query";
interface Props {
    queryFn: QueryFunction<any, any[], any>,
    queryKey: string,
    debouncedFilters: { [key: string]: any }
}

export const useInfiniteScroll = ({
    queryFn,
    queryKey,
    debouncedFilters
}: Props) => {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        ...rest
    } = useInfiniteQuery({
        queryKey: [queryKey, debouncedFilters],
        initialPageParam: null,
        queryFn,
        getNextPageParam: ({ meta }) =>
            !meta.hasMore ? undefined : meta.nextCursor,
    });
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasNextPage) fetchNextPage();
            },
            { threshold: 1 }
        );
        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasNextPage, fetchNextPage]);

    const datos = data?.pages.flatMap((page) => page.data) || [];
    return { ...rest, data, loadMoreRef, datos }
}