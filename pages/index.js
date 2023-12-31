import Image from 'next/image';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

// import Map from '@/components/Map';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// const MapGeoJson = dynamic(() => import('@/components/MapGeoJson'), {
// 	ssr: false
// });

const inter = Inter({ subsets: ['latin'] });

export default function Home({ mapboxToken }) {
	return (
		<main
			className={`flex flex-col items-center justify-between p-16 ${inter.className}`}
		>
			<p className="lg:text-5xl md:text-5xl text-3xl mb-5">
				Mapbox with NextJS
			</p>
			<Map mapboxToken={mapboxToken} />
			{/* <br />
			<MapGeoJson mapboxToken={mapboxToken} /> */}
		</main>
	);
}

export const getStaticProps = async () => {
	const mapboxToken = process.env.NEXT_MAPBOX_TOKEN;

	return {
		props: {
			mapboxToken
		}
	};
};
