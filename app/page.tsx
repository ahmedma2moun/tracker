import Calendar from "@/components/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tracker</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Select a date · press Done · repeat
          </p>
        </div>
        <Calendar />
      </div>
    </main>
  );
}
