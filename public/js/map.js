mapboxgl.accessToken=mapToken; 

const map = new mapboxgl.Map({
  container: 'map', // HTML element id
  style: 'mapbox://styles/mapbox/streets-v12', // Map style
  center: listing.geometry.coordinates, // Longitude, Latitude
  zoom: 8 // Initial zoom level
});

 
const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
.setPopup(
  new mapboxgl.Popup({offset:25})
  .setHTML(
    `<h5>${listing.location}</h5><p>Exact location provided after booking</p>`
  )
)
.addTo(map);