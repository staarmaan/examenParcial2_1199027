export default function GameEmbed() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-zinc-900">
      <iframe
        src="/PengunnersJS/index.html"
        width="800"
        height="600"
        title="Love2D Game"
        allow="cross-origin-isolated"
        allowFullScreen
      />
    </div>
  )
}