const { locations } = require('@/locations');

const popupHTML = (city, lng, lat) => ` <div class="bg-white  p-2">
                   
<p class="text-black text-lg font-medium">You are in: ${city}</p>

  <p class="text-black text-[14px]">Coordinate: ${lng}, ${lat}</p>
 
</div>`;

const generateNewMarker = ({ map, mapStyle, light, mapboxgl }) => {
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
				}).setHTML(popupHTML(city, lng, lat))
			)
			.addTo(map);
	});
};

const generateGeocoderMarker = (
	result,
	mapboxMap,
	geocoder,
	geoMarker,
	mapStyle,
	light,
	mapboxgl
) => {
	const { text, center } = result;

	const [lng, lat] = center;

	// ? understand this
	if (geoMarker) {
		geoMarker.remove();
	}

	const markerElement = document.createElement('div');
	markerElement.className = 'custom-marker text-[50px] text-center';
	markerElement.innerHTML = `🇺🇸`;

	const textElement = document.createElement('div');
	textElement.innerHTML = text;
	textElement.className = `text-center ${
		mapStyle === light ? 'text-black' : 'text-white'
	} text-lg font-medium `;
	// textElement.style.textAlign = 'center';

	const markerContainer = document.createElement('div');
	markerContainer.appendChild(markerElement);
	markerContainer.appendChild(textElement);

	geoMarker = new mapboxgl.Marker(markerContainer)
		.setLngLat(center)
		.setPopup(
			new mapboxgl.Popup({
				closeButton: false,
				anchor: 'left'
			}).setHTML(popupHTML(text, lng, lat))
		)
		.addTo(mapboxMap);

	// Listen to the 'clear' event of the geocoder
	geocoder.on('clear', () => {
		// Remove the custom marker from the map
		if (geoMarker) {
			geoMarker.remove();
		}
	});
};

export { generateNewMarker, generateGeocoderMarker };
