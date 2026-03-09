import ArrowLeft from "./Icons/ArrowLeft";
import ArrowRight from "./Icons/ArrowRight";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  disabled?: boolean;
}

const Paginator = ({ page, totalPages, onPageChange, disabled }: Props) => {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button className="border-1 border-gray-100 p-1 rounded-sm hover:shadow-md hover:cursor-pointer" onClick={() => onPageChange(page - 1)} disabled={page === 1 || disabled}>
        <ArrowLeft className="text-black w-4 h-4" />
      </button>
      <span> Page {page} of {totalPages} </span>
      <button className="border-1 border-gray-100 p-1 rounded-sm hover:shadow-md hover:cursor-pointer" onClick={() => onPageChange(page + 1)} disabled={page === totalPages || disabled}>
        <ArrowRight className="text-black w-4 h-4" />
      </button>
    </div>
  )
}

export default Paginator;
