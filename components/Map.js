import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import {
	generateNewMarker,
	generateGeocoderMarker
} from '@/utils/generateMarkers';

// const mapStyle = 'mapbox://styles/benryan/clkuv54ck000u01po9b59cvgr';

const dark = 'mapbox://styles/benryan/clkuv54ck000u01po9b59cvgr';

const light = 'mapbox://styles/benryan/clkuvn1k9000v01q03z8q81cr';

const responsiveMapDesign =
	'lg:h-[600px] lg:w-[1000px] md:h-[600px] md:w-[1000px] h-[270px] w-[370px]';

let geoMarker;

const Map = ({ mapboxToken }) => {
	const [mapStyle, setMapStyle] = useState(light);
	const [coords, setCoords] = useState({
		lng: -74.742935,
		lat: 40.217052,
		zoom: 9
	});

	// * this is where the map instance will be stored after initialization
	const mapNode = useRef(null);

	useEffect(() => {
		const node = mapNode.current;

		// if the window object is not found, that means
		// the component is rendered on the server
		// or the dom node is not initialized, then return early
		if (typeof window === 'undefined') return;

		// otherwise, create a map instance
		const mapboxMap = new mapboxgl.Map({
			container: node,
			accessToken: mapboxToken,
			style: mapStyle,
			center: [coords.lng, coords.lat],
			zoom: coords.zoom
		});

		const geocoder = new MapboxGeocoder({
			accessToken: mapboxToken,
			mapboxgl: mapboxgl,
			placeholder: 'Search for places',
			marker: false
		});

		mapboxMap.on('move', () => {
			setCoords((currentCoords) => ({
				...currentCoords,
				lng: mapboxMap.getCenter().lng.toFixed(4),
				lat: mapboxMap.getCenter().lat.toFixed(4),
				zoom: mapboxMap.getZoom().toFixed(2)
			}));
		});

		mapboxMap.on('load', () =>
			generateNewMarker({
				map: mapboxMap,
				...mapboxMap.getCenter(),
				mapStyle,
				light,
				mapboxgl
			})
		);

		geocoder.on('result', (e) => {
			const { result } = e;
			generateGeocoderMarker(
				result,
				mapboxMap,
				geocoder,
				geoMarker,
				mapStyle,
				light,
				mapboxgl
			);
		});

		mapboxMap.addControl(geocoder);

		return () => {
			mapboxMap.remove();
			mapboxMap.off('load', generateNewMarker);
		};

		// console.log(node);
	}, [mapboxToken, mapStyle]);

	const handleMapTheme = () => {
		setMapStyle((currentStyle) => (currentStyle === light ? dark : light));
	};

	return (
		<>
			<p className="lg:text-3xl md:text-3xl text-md mb-5">
				Longitude: {coords.lng} | Latitude: {coords.lat} | Zoom: {coords.zoom}
			</p>
			<div ref={mapNode} className={responsiveMapDesign} />
			<br />

			<button
				onClick={handleMapTheme}
				className={`bg-[#083344] p-3 rounded-md text-white`}
			>
				{' '}
				{mapStyle === light ? 'Set to Dark' : 'Set to Light'}
			</button>
		</>
	);
};

export default Map;
