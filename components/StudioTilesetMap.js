// * Manual / Hardcoded GeoJSON data is better to be uploaded to Mapbox Studio Editor to process into the ready-to-use map
// * Dynamic GeoJSON data especially from 3rd Party API should be done using codes

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// * this mapStyle is static and pre-defined (a theme that comes with the markers created in Studio Editor)
const mapStyle = 'mapbox://styles/benryan/cllnic2w3000s01r63v5v7zyv';

const responsiveMapDesign =
	'lg:h-[600px] lg:w-[1000px] md:h-[600px] md:w-[1000px] h-[270px] w-[370px]';

let mapboxMap;

const StudioTilesetMap = ({ mapboxToken }) => {
	const mapNode = useRef(null);

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
			center: [-87.661557, 41.893748],
			zoom: 10.7
		});

		// check if the user actually clicks on the icon of the map
		mapboxMap.on('click', (e) => {
			// If the user clicked on one of your markers, get its information.
			const features = mapboxMap.queryRenderedFeatures(e.point, {
				layers: ['chicago-parks'] // replace with your layer name
			});

			// * queryRenderedFeatures() returns an array of geoJSON feature objects showing features based on query parameters
			//  * https://docs.mapbox.com/mapbox-gl-js/api/map/#map#queryrenderedfeatures

			if (!features.length) {
				return;
			}

			const feature = features[0];

			console.log(feature);

			// Create new popup of information from features of chicago-parks layer
			const popup = new mapboxgl.Popup({ offset: [0, -15] })
				.setLngLat(feature.geometry.coordinates)
				.setHTML(
					`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
				)
				.addTo(mapboxMap);
		});

		return () => {
			mapboxMap.remove();
		};
	}, [mapboxToken]);

	return (
		<>
			<div ref={mapNode} className={responsiveMapDesign} />
		</>
	);
};

export default StudioTilesetMap;
