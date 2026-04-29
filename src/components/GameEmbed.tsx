export default function GameEmbed() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/PengunnersJS/index.html"
        style={{
          width: 'min(1200px, 95vw)',
          height: 'min(600px, 47.5vw)',
          border: 'none',
        }}
        title="Love2D Game"
        allow="cross-origin-isolated"
        allowFullScreen
      />
    </div>
  )
}