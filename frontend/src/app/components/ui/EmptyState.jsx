import { Link } from "react-router-dom";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-slate-600">{description}</p>

      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}