import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="w-full bg-white border-b">
			<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<Link href="/" className="font-bold text-lg">Thalorix</Link>
				<div className="flex items-center gap-3">
					<Link href="/login" className="text-sm text-teal-800 hover:underline">Login</Link>
					<Link href="/register" className="text-sm bg-teal-800 text-white px-3 py-1 rounded">Sign up</Link>
				</div>
			</div>
		</nav>
	);
}