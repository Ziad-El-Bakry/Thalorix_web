import Link from 'next/link';

const NAV = [
	{ label: 'Home', href: '/' },
	{ label: 'Marketplace', href: '/(dashboard)/marketplace' },
	{ label: 'Community', href: '/(dashboard)/community' },
	{ label: 'AI Generator', href: '/(dashboard)/ai-generator' },
	{ label: 'Messages', href: '/(dashboard)/messages' },
	{ label: 'Profile', href: '/(dashboard)/profile' },
];

export default function Sidebar() {
	return (
		<aside className="w-64 bg-teal-900 text-white p-6 flex flex-col">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-12 h-12 rounded-full bg-teal-800 flex items-center justify-center text-xl font-bold">T</div>
				<div className="text-lg font-bold tracking-wide">THALORIX</div>
			</div>

			<nav className="flex-1">
				<ul className="space-y-1">
					{NAV.map((item) => (
						<li key={item.href}>
							<Link href={item.href} className="block px-3 py-2 rounded hover:bg-teal-800">{item.label}</Link>
						</li>
					))}
				</ul>
			</nav>

			<div className="text-xs opacity-75 mt-6">v0.1 • Built with ♥</div>
		</aside>
	);
}