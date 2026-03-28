export default function PageLoader({ message = "Carregando..." }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#f66504]" />
          <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>
      </div>
    </main>
  );
}