export default function SkeletonBooks() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6 animated-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-80 rounded-xl"></div>
      ))}
    </div>
  )
}