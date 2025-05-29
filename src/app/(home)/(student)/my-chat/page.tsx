import Button from "@/components/ui/button";

const MyChatPage = () => (
  <div>
    <h1 className="mb-2 text-2xl font-bold">My Chat</h1>
    <p className="mb-6 text-zinc-400">
      Ini adalah halaman chat minimalis dengan tampilan yang sudah diperbaiki.
    </p>

    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs">
          AI
        </div>
        <div className="flex-1 rounded-xl bg-zinc-800/70 p-4">
          <p className="text-sm text-zinc-300">Halo, bagaimana saya bisa membantu Anda hari ini?</p>
        </div>
      </div>

      <div className="flex flex-row-reverse gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs">
          You
        </div>
        <div className="flex-1 rounded-xl bg-zinc-700/70 p-4">
          <p className="text-sm text-white">
            Saya ingin bertanya tentang fitur-fitur baru dari ChillLLMs
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs">
          AI
        </div>
        <div className="flex-1 rounded-xl bg-zinc-800/70 p-4">
          <p className="text-sm text-zinc-300">
            Tentu! ChillLLMs baru saja merilis beberapa fitur baru, termasuk:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
            <li>Dukungan untuk lebih banyak model AI</li>
            <li>Antarmuka pengguna yang lebih intuitif</li>
            <li>Kemampuan untuk menyimpan dan mengekspor percakapan</li>
            <li>Integrasi dengan alat-alat produktivitas populer</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="mt-8">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="flex-1 rounded-lg border border-zinc-700/50 bg-zinc-800/70 px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600"
        />
        <Button
          type="button"
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
        >
          Kirim
        </Button>
      </div>
    </div>
  </div>
);

export default MyChatPage;
