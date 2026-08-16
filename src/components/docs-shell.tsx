import { SideNav } from "@/components/side-nav";

export function DocsShell({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border/80 py-8 pr-4 pl-6 lg:block">
        <SideNav pathname={pathname} />
      </aside>
      <div className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-10">{children}</div>
    </div>
  );
}
