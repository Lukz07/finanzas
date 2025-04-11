export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen overflow-auto w-full bg-transparent">
      {children}
    </div>
  );
} 