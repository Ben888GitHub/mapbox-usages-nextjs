import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const dynamicMapThemes = 'mapbox://styles/mapbox/navigation-day-v1';

const responsiveMapDesign =
	'lg:h-[600px] lg:w-[1000px] md:h-[600px] md:w-[1000px] h-[270px] w-[370px]';

let mapboxMap;

const ThreeDMapDynamic = ({ mapboxToken }) => {
	const mapNode = useRef(null);

	const [coords, setCoords] = useState({
		lng: -73.998,
		lat: 40.75,
		zoom: 15.23
	});

	useEffect(() => {
		const node = mapNode.current;

		// if the window object is not found, that means
		// the component is rendered on the server
		// or the dom node is not initialized, then return early
		if (typeof window === 'undefined') return;

		// otherwise, create a map instance
		mapboxMap = new mapboxgl.Map({
			container: node,
			accessToken: mapboxToken,
			style: dynamicMapThemes,
			center: [coords.lng, coords.lat],
			zoom: coords.zoom,
			pitch: 45,
			bearing: -17.6,
			antialias: true
		});

		return () => {
			mapboxMap.remove();
		};
	}, [mapboxToken]);

	const enable3DMode = () => {
		// Insert the layer beneath any symbol layer.
		const layers = mapboxMap.getStyle().layers;
		const labelLayerId = layers.find(
			(layer) => layer.type === 'symbol' && layer.layout['text-field']
		).id;

		mapboxMap.addLayer(
			{
				id: 'add-3d-buildings',
				source: 'composite',
				'source-layer': 'building',
				filter: ['==', 'extrude', 'true'],
				type: 'fill-extrusion',
				minzoom: 15,
				paint: {
					'fill-extrusion-color': '#aaa',

					// Use an 'interpolate' expression to
					// add a smooth transition effect to
					// the buildings as the user zooms in.
					'fill-extrusion-height': [
						'interpolate',
						['linear'],
						['zoom'],
						15,
						0,
						15.05,
						['get', 'height']
					],
					'fill-extrusion-base': [
						'interpolate',
						['linear'],
						['zoom'],
						15,
						0,
						15.05,
						['get', 'min_height']
					],
					'fill-extrusion-opacity': 0.6
				}
			},
			labelLayerId
		);
	};

	const disable3DMode = () => {
		if (mapboxMap.getLayer('add-3d-buildings')) {
			mapboxMap.removeLayer('add-3d-buildings');
		}
	};

	return (
		<>
			<div ref={mapNode} className={responsiveMapDesign} />
			<br />

			<div className="flex mt-5">
				<button
					onClick={enable3DMode}
					className={`bg-[#083344] p-3 rounded-md text-white mr-3`}
				>
					Show 3D Buildings
				</button>

				<button
					onClick={disable3DMode}
					className={`bg-[#083344] p-3 rounded-md text-white mr-3`}
				>
					Hide 3D Buildings
				</button>
			</div>
		</>
	);
};

export default ThreeDMapDynamic;
