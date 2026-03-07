import ArrowLeft from "./Icons/ArrowLeft";
import ArrowRight from "./Icons/ArrowRight";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Paginator = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button className="hover:cursor-pointer" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ArrowLeft className="text-black w-4 h-4" />
      </button>
      <span> Page {page} of {totalPages} </span>
      <button className="hover:cursor-pointer" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}><ArrowRight className="text-black w-4 h-4" /></button>
    </div>

  )
}

export default Paginator;
