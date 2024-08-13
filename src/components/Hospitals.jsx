import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

function Hospitals() {

  const apiKey = "a54b4d1ebae143539986f5f11168a7dc";
  const [latLng, setLatLng] = useState(null);
  const [features, setFeatures] = useState([])
  const navigate=useNavigate();
 

   useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setLatLng({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  useEffect(() => {
    if (latLng) {
    let api = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${latLng.lng},${latLng.lat},50000&bias=proximity:${latLng.lng},${latLng.lat}&limit=25&apiKey=${apiKey}`;
      axios.get(api).then(response => {
        let arrFeature = response.data.features;
        let list = []
        arrFeature.map(ele => {
          // setFeatures([...features,ele.properties]);
          if (ele.properties.name)
            list.push(ele.properties)
        })
        setFeatures(list);
        console.log(list)
        // console.log(features)
        // console.log(arrFeature[1].properties)
      }).catch(error => {
        console.error("Error fetching data: ", error);
      });
    }

  }, [latLng, apiKey])



  return (
    <div style={{ backgroundColor: "#f54337" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "center" }}>
        {
          features.map((hospital, index) => {
            return (
              <div key={index} style={{ margin: "1rem" }} onClick={()=>{navigate("/details/"+hospital.place_id, {state:hospital},{state2:latLng}) }} >
                <Card sx={{ width: 550 }}  >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ borderBottom: "3px solid grey" }}>
                      {hospital.name}
                    </Typography>
                    <Typography variant="body2" >
                      {hospital.address_line2}
                    </Typography>
                    <Typography variant="body2" >
                      {(hospital.distance / 1000).toFixed(1) + " KM"}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default Hospitals
