import Image from 'next/image';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

// import Map from '@/components/Map';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

const StudioTilesetMap = dynamic(
	() => import('@/components/StudioTilesetMap'),
	{ ssr: false }
);

const ThreeDMapStatic = dynamic(() => import('@/components/ThreeDMapStatic'), {
	ssr: false
});

const ThreeDMapDynamic = dynamic(
	() => import('@/components/ThreeDMapDynamic'),
	{
		ssr: false
	}
);

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
			<br />
			<StudioTilesetMap mapboxToken={mapboxToken} />
			<br />
			<br />
			<ThreeDMapStatic mapboxToken={mapboxToken} />
			<br />
			<br />
			<ThreeDMapDynamic mapboxToken={mapboxToken} />
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
