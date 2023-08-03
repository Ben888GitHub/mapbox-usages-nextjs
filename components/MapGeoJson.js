import { useEffect, useState, useRef } from 'react';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import locations from '../locations.json';

const dark = 'mapbox://styles/benryan/clkuv54ck000u01po9b59cvgr';

const light = 'mapbox://styles/benryan/clkuvn1k9000v01q03z8q81cr';

const responsiveMapDesign =
	'lg:h-[600px] lg:w-[1000px] md:h-[600px] md:w-[1000px] h-[270px] w-[370px]';

const MapGeoJson = ({ mapboxToken }) => {
	// * this is where the map instance will be stored after initialization
	const [map, setMap] = useState();

	const [mapStyle, setMapStyle] = useState(light);

	//     const [lng, setLng] = useState(-70.9);
	// const [lat, setLat] = useState(42.35);
	const [coords, setCoords] = useState({
		lng: -74.742935,
		lat: 40.217052,
		zoom: 9
	});
	const [zoom, setZoom] = useState(9);

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
		// console.log(mapboxMap.getCenter().lng.toFixed(4));
		mapboxMap.on('move', () => {
			setCoords((currentCoords) => ({
				...currentCoords,
				lng: mapboxMap.getCenter().lng.toFixed(4),
				lat: mapboxMap.getCenter().lat.toFixed(4),
				zoom: mapboxMap.getZoom().toFixed(2)
			}));
		});

		mapboxMap.on('load', () => {
			// Add an image to use as a custom marker
			mapboxMap.loadImage(
				'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
				(error, image) => {
					if (error) throw error;
					mapboxMap.addImage('custom-marker', image);
					// Add a GeoJSON source with 2 points
					mapboxMap.addSource('points', locations);

					// Add a symbol layer
					mapboxMap.addLayer({
						id: 'points',
						type: 'symbol',
						source: 'points',
						layout: {
							'icon-image': 'custom-marker',
							// get the title name from the source's "title" property
							'text-field': ['get', 'title'],
							'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
							'text-offset': [0, 1.25],
							'text-anchor': 'top'
							// 'text-color': '#000'
						},
						paint: {
							'text-color': mapStyle === light ? '#000' : '#fff'
						}
					});
				}
			);
		});

		// save the map object to useState
		setMap(mapboxMap);

		return () => {
			mapboxMap.remove();
			// mapboxMap.off('load', generateNewMarker);
		};

		// console.log(node);
	}, [mapboxToken, mapStyle]);

	const handleMapTheme = () => {
		setMapStyle((currentStyle) => (currentStyle === light ? dark : light));
	};

	// console.log(locations);
	return (
		<>
			<p className="lg:text-3xl md:text-3xl text-xl mb-5">
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

export default MapGeoJson;
