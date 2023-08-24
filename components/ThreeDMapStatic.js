import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { staticMapsThemes } from '@/utils/mapThemes';

// * this threeDMapStyle is static and pre-defined (a theme that comes with the markers created in Studio Editor)
const threeDMapStyle = 'mapbox://styles/benryan/cllnn8uen000v01r87m1cc36w';

const twoDMapStyle = 'mapbox://styles/benryan/cllnpsjz4000t01rc93x5e5uo';

const responsiveMapDesign =
	'lg:h-[600px] lg:w-[1000px] md:h-[600px] md:w-[1000px] h-[270px] w-[370px]';

let mapboxMap;

const ThreeDMapStatic = ({ mapboxToken }) => {
	const mapNode = useRef(null);

	const [mapStyle, setMapStyle] = useState(threeDMapStyle);

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
			style: mapStyle,
			center: [coords.lng, coords.lat],
			zoom: coords.zoom,
			pitch: 45,
			bearing: -17.6,
			antialias: true
		});

		mapboxMap.on('move', () => {
			setCoords((currentCoords) => ({
				...currentCoords,
				lng: mapboxMap.getCenter().lng.toFixed(4),
				lat: mapboxMap.getCenter().lat.toFixed(4),
				zoom: mapboxMap.getZoom().toFixed(2)
			}));
		});

		return () => {
			mapboxMap.remove();
		};
	}, [mapboxToken, mapStyle]);

	return (
		<>
			<p className="lg:text-3xl md:text-3xl text-md mb-5">
				2 Different Static Map Theme, enable 3D or normal mode
			</p>

			<div ref={mapNode} className={responsiveMapDesign} />
			<br />
			{staticMapsThemes.map(({ theme, styleId }, idx) => (
				<label key={idx} className="inline-flex items-center mr-4">
					<input
						type="radio"
						className="form-radio text-indigo-600"
						name="theme"
						value={theme}
						// onChange={() => handleMapThemeWithOptions(theme, layerId)}
						// defaultChecked={idx === 0}
						onChange={() =>
							setMapStyle((currentStyle) => (currentStyle = styleId))
						}
						defaultChecked={theme === '3D Theme'}
					/>
					<span className="ml-2 text-lg">{theme}</span>
				</label>
			))}
		</>
	);
};

export default ThreeDMapStatic;
