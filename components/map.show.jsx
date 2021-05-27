import React, { useEffect } from 'react';
import L from 'leaflet';
import {} from 'mapbox-gl-leaflet';


const  MyMap= (props) => {
  const {record,property} = props;
  console.log(record.params.lat);
  console.log(record.params.lon);
  console.log(record.params.eastings)

  let mapContainer;



  useEffect(() => {
    const initialState = {
      lng: 146.677,
      lat: -6.677,
      //zoom: 16,
      container: 'map',
      zoom: 11,
      //center: [146.677,-6.677],
      pitch: 85,
      bearing: 80,

    };

    const map = new L.Map(mapContainer).setView([initialState.lat, initialState.lng], initialState.zoom,initialState.pitch,initialState.bearing);
    
    const accessToken = 'pk.eyJ1IjoiYW5hcGl0YWxhaSIsImEiOiJja25mYWh3bnMwMzV1Mm9wYXZqb3Nha2xhIn0.s1jrOgqilQO4oIx1JArlcQ';

   const gl = L.mapboxGL({
   accessToken: accessToken,
   style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
   }).addTo(map);

   


  L.marker([record.params.lat,record.params.lon]).addTo(map)
       .bindPopup(record.params.location_name)
       .openPopup();


  }, [mapContainer]);

  return (
    <div className="map-container" style={{height:"500px"}} ref={el => mapContainer = el}>

    </div>
  )
}

export default MyMap;





