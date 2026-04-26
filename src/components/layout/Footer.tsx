export default function Footer() {
	return (
		<footer className="w-full bg-white border-t p-6 text-sm text-gray-600">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				<span>© {new Date().getFullYear()} Thalorix</span>
				<div className="flex gap-4">
					<a href="/terms" className="hover:underline">Terms</a>
					<a href="/privacy" className="hover:underline">Privacy</a>
				</div>
			</div>
		</footer>
	);
}