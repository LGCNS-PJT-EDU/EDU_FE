import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';

interface PaginationProps {
  pageIndex: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function AdminPagination({ pageIndex, totalPages, setPage }: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            disabled={pageIndex === 1}
            onClick={() => {
              setPage(pageIndex - 1);
            }}
          >
            이전
          </Button>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <Button
              variant={pageIndex === index + 1 ? 'default' : 'ghost'}
              onClick={() => {
                setPage(index + 1);
              }}
            >
              {index + 1}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="outline"
            disabled={!totalPages || pageIndex === totalPages}
            onClick={() => {
              setPage(pageIndex + 1);
            }}
          >
            다음
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
