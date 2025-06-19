import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

interface PaginationProps {
  pageIndex: number;   // 1-based
  totalPages: number;
  setPage: (page: number) => void;
}

export default function AdminPagination({
  pageIndex,
  totalPages,
  setPage,
}: PaginationProps) {
  const blockStart = Math.floor((pageIndex - 1) / 10) * 10 + 1;
  const blockEnd = Math.min(blockStart + 9, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            disabled={pageIndex === 1}
            onClick={() => setPage(pageIndex - 1)}
          >
            이전
          </Button>
        </PaginationItem>

        {Array.from({ length: blockEnd - blockStart + 1 }, (_, i) => {
          const page = blockStart + i;
          return (
            <PaginationItem key={page}>
              <Button
                variant={pageIndex === page ? "default" : "ghost"}
                onClick={() => setPage(page)}
              >
                {page}
              </Button>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <Button
            variant="outline"
            disabled={pageIndex === totalPages}
            onClick={() => setPage(pageIndex + 1)}
          >
            다음
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
