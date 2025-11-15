
// src/presentation/pages/DashboardPage/DashboardPage.tsx
function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r hidden md:block">
      <nav className="p-4 space-y-2">
        <a href="/dashboard" className="block rounded-md px-3 py-2 hover:bg-gray-100">Overview</a>
        <a href="#" className="block rounded-md px-3 py-2 hover:bg-gray-100">Reports</a>
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <div className="font-semibold">Dashboard</div>
      <input placeholder="Search…" className="hidden md:block rounded-md border px-3 py-1.5"/>
    </header>
  );
}

function Card({title, value}:{title:string; value:string}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Topbar/>
        <main className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Users" value="1,248"/>
            <Card title="Sessions" value="8,931"/>
            <Card title="Conversion" value="3.4%"/>
          </div>
          <div className="rounded-xl border p-6">
            <div className="text-lg font-semibold">Recent Items</div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr><th className="py-2">Name</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {["Alpha","Beta","Gamma"].map((n,i)=>(
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{n}</td>
                      <td><span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Active</span></td>
                      <td>2025-11-11</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}