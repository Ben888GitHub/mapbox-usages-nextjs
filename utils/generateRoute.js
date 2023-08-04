import axios from 'axios';

export const getRoute = async (
	mapboxToken,
	mapboxMap,
	lng,
	lat,
	mapStyle,
	light
) => {
	const apiEndpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/-74.742935,40.217052;${lng},${lat}?steps=true&geometries=geojson&access_token=${mapboxToken}`;

	const { data } = await axios.get(apiEndpoint);
	const result = data.routes[0];
	const route = result.geometry.coordinates;
	console.log(result);
	const geojson = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: route
		}
	};

	// if the route already exists on the map, we'll reset it using setData
	// if (mapboxMap.getSource('route')) {
	// 	mapboxMap.getSource('route').setData(geojson);
	// }

	// // otherwise, we'll make a new request
	// else {
	// 	mapboxMap.addLayer({
	// 		id: 'route',
	// 		type: 'line',
	// 		source: {
	// 			type: 'geojson',
	// 			data: geojson
	// 		},
	// 		layout: {
	// 			'line-join': 'round',
	// 			'line-cap': 'round'
	// 		},
	// 		paint: {
	// 			'line-color': mapStyle === light ? '#3887be' : '#0ea5e9',
	// 			'line-width': 8,
	// 			'line-opacity': 0.75
	// 		}
	// 	});
	// }

	mapboxMap.addLayer({
		id: 'route',
		type: 'line',
		source: {
			type: 'geojson',
			data: geojson
		},
		layout: {
			'line-join': 'round',
			'line-cap': 'round'
		},
		paint: {
			'line-color': mapStyle === light ? '#3887be' : '#0ea5e9',
			'line-width': 8,
			'line-opacity': 0.75
		}
	});
};
