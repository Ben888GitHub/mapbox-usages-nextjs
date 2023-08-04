import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { locations } from '@/locations';
import { getRoute } from '@/utils/generateRoute';

// const mapStyle = 'mapbox://styles/benryan/clkuv54ck000u01po9b59cvgr';

const dark = 'mapbox://styles/benryan/clkuv54ck000u01po9b59cvgr';

const light = 'mapbox://styles/benryan/clkuvn1k9000v01q03z8q81cr';

const responsiveMapDesign =
	'lg:h-[600px] lg:w-[1000px] md:h-[600px] md:w-[1000px] h-[270px] w-[370px]';

let geoMarker;

let mapboxMap;

const Map = ({ mapboxToken }) => {
	// * this is where the map instance will be stored after initialization
	// const [map, setMap] = useState();

	const [mapStyle, setMapStyle] = useState(light);

	//     const [lng, setLng] = useState(-70.9);
	// const [lat, setLat] = useState(42.35);
	const [coords, setCoords] = useState({
		lng: -74.742935,
		lat: 40.217052,
		zoom: 9
	});
	// const [zoom, setZoom] = useState(9);

	const mapNode = useRef(null);

	const generateNewMarker = ({ map }) => {
		console.log(locations);

		locations.map(({ city, lng, lat }) => {
			const markerElement = document.createElement('div');
			markerElement.className = 'custom-marker text-[50px] text-center';
			markerElement.innerHTML = `🇺🇸`;
			// markerElement.style.fontSize = '35px';
			// markerElement.style.textAlign = 'center';
			const textElement = document.createElement('div');
			textElement.innerHTML = city;
			textElement.className = `${
				mapStyle === light ? 'text-black' : 'text-white'
			} text-lg font-medium text-center`;

			const markerContainer = document.createElement('div');
			markerContainer.appendChild(markerElement);
			markerContainer.appendChild(textElement);

			new mapboxgl.Marker(markerContainer)
				.setLngLat([lng, lat])
				.setPopup(
					new mapboxgl.Popup({
						closeButton: false,
						anchor: 'left'
					}).setHTML(
						` <div class="bg-white  p-2">
                       
                       <p class="text-black text-lg font-medium">You are in: ${city}</p>

                         <p class="text-black text-[14px]">Coordinate: ${lng}, ${lat}</p>
                        
                      </div>`
					)
				)
				.addTo(map);
		});
	};

	const generateGeocoderMarker = (result, mapboxMap, geocoder) => {
		const { text, center } = result;

		const [lng, lat] = center;

		// ? understand this
		if (geoMarker) {
			geoMarker.remove();

			if (mapboxMap.getLayer('route')) {
				mapboxMap.removeLayer('route');
			}
			if (mapboxMap.getSource('route')) {
				mapboxMap.removeSource('route');
			}
		}

		const markerElement = document.createElement('div');
		markerElement.className = 'custom-marker text-[50px] text-center';
		markerElement.innerHTML = `🇺🇸`;

		const textElement = document.createElement('div');
		textElement.innerHTML = text;
		textElement.className = `text-center ${
			mapStyle === light ? 'text-black' : 'text-white'
		} text-lg font-medium `;

		// Create a button element
		const buttonElement = document.createElement('button');
		buttonElement.textContent = 'Show route';
		buttonElement.className =
			'bg-blue-500 text-white px-3 py-1 rounded mx-auto';

		// Center the button horizontally using flexbox
		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'flex justify-center';
		buttonContainer.appendChild(buttonElement);

		buttonElement.addEventListener('click', () => {
			// Perform an action when the button is clicked
			// console.log(buttonElement.textContent);
			// toggleButtonText();
			getRoute(mapboxToken, mapboxMap, lng, lat, mapStyle, light);
		});

		const markerContainer = document.createElement('div');
		markerContainer.appendChild(markerElement);
		markerContainer.appendChild(textElement);
		markerContainer.appendChild(buttonContainer);

		// geoMarker = new mapboxgl.Marker(markerContainer)
		geoMarker = new mapboxgl.Marker(markerContainer)
			.setLngLat(center)
			.setPopup(
				new mapboxgl.Popup({
					closeButton: false,
					anchor: 'left'
				}).setHTML(` <div class="bg-white  p-2">
                       
                <p class="text-black text-lg font-medium">You are in: ${text}</p>

                  <p class="text-black text-[14px]">Coordinate: ${lng}, ${lat}</p>

               </div>`)
			)
			.addTo(mapboxMap);

		// Listen to the 'clear' event of the geocoder
		geocoder.on('clear', () => {
			// Remove the custom marker from the map
			if (geoMarker) {
				geoMarker.remove();
				// mapboxMap.removeLayer('route');
				// mapboxMap.removeSource('route');
				// console.log(mapboxMap.getSource('route'));
				if (mapboxMap.getLayer('route')) {
					mapboxMap.removeLayer('route');
				}
				if (mapboxMap.getSource('route')) {
					mapboxMap.removeSource('route');
				}
			}
		});
	};

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

		mapboxMap.on('load', () => {
			generateNewMarker({
				map: mapboxMap,
				...mapboxMap.getCenter()
			});

			// getRoute(mapboxToken, mapboxMap);
		});

		geocoder.on('result', (e) => {
			const { result } = e;
			generateGeocoderMarker(result, mapboxMap, geocoder);
		});

		mapboxMap.addControl(geocoder);

		// Add zoom and rotation controls to the map.
		mapboxMap.addControl(new mapboxgl.NavigationControl(), 'top-left');

		return () => {
			mapboxMap.remove();
			mapboxMap.off('load', generateNewMarker);
		};

		// console.log(node);
	}, [mapboxToken, mapStyle]);

	const handleMapTheme = () => {
		setMapStyle((currentStyle) => (currentStyle === light ? dark : light));
		console.log(mapStyle);
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
