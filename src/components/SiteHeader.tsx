import { SOPC_LOGO_PATH, SOPC_PROGRAM_TITLE } from "@/constants/saudi";

export function SiteHeader() {
  return (
    <header className="border-b border-sopc-green/20 bg-gradient-to-r from-sopc-green via-sopc-green to-sopc-green-dark text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <img
          src={SOPC_LOGO_PATH}
          alt=""
          className="h-14 w-14 shrink-0 drop-shadow-sm sm:h-16 sm:w-16"
          width={64}
          height={64}
        />
        <h1 className="text-center text-lg font-semibold tracking-tight sm:text-2xl">
          {SOPC_PROGRAM_TITLE}
        </h1>
      </div>
    </header>
  );
}
