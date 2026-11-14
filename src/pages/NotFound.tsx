export function NotFound() {
  return <main className="mx-auto max-w-3xl px-4 py-20">
    <p className="console-label text-amber">404 / Navigation</p><h1 className="display my-4 text-4xl">Page not found</h1>
    <p className="mb-6 text-dim">This address does not lead to an IGNIS page.</p>
    <a href="/" className="text-amber underline">Return to the mission console</a>
  </main>;
}
