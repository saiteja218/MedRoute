import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useLocation } from 'react-router-dom';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import "./style.css"

import axios from "axios";

function Details() {
    const apiKey = "a54b4d1ebae143539986f5f11168a7dc";
    const [userAddr, setUserAddr] = useState();
    const location = useLocation();
    const hospital = location.state;
    // console.log(hospital)
    const [latLng, setLatLng] = useState(null);
    const [routes, setroutes] = useState([]);
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setLatLng({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
        else {
            console.log("f**k")
        }
        // console.log(latLng)
    }, []);


    useEffect(() => {
        if (latLng) {
            let api2 = `https://api.geoapify.com/v1/geocode/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json&apiKey=${apiKey}`

            axios.get(api2).then(response => {
                setUserAddr(response.data.results[0].formatted)
            })


        }
    }, [latLng])
    useEffect(() => {

        if (latLng) {

            let routing_api = `https://api.geoapify.com/v1/routing?waypoints=${latLng.lat},${latLng.lng}|${hospital.lat},${hospital.lon}&mode=drive&details=instruction_details&apiKey=${apiKey}`
            axios.get(routing_api).then(resp => {
                // console.log(resp.data.features[0].properties);

                const steps = (resp.data.features[0].properties.legs[0].steps).map((step) => {


                    return (step.instruction.transition_instruction + (step.instruction.post_transition_instruction ? step.instruction.post_transition_instruction : ""));
                });
                setroutes(steps)


            })

        }
    }, [latLng])





    return (

        <div style={{ backgroundColor: "#f54337", minHeight: "91.9vh" }}>
            

            {/* <Container sx={{ m: 2 }}> */}
            <Grid container spacing={1}>
                <Grid item xs={7}>
                    <Card sx={{ width: 600, m: "2rem auto" }}  >

                        <CardContent >
                            <div style={{ borderBottom: "3px solid grey", padding: "0.5rem" }}>
                                <Typography gutterBottom variant="h5" component="div" style={{ borderBottom: "3px solid grey" }}>
                                        {hospital.name} <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ marginLeft: '0.2rem', color: 'red' ,textDecoration:"none"}}
                                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.formatted}`}
                                        >
                                            (View on Maps)
                                        </Link>
                                </Typography>
                                {latLng ? (
                                    <>
                                        <Typography variant="body2" sx={{ pt: 1 }}>
                                            {"User Latitude: " + latLng.lat}
                                        </Typography>
                                        <Typography variant="body2" sx={{ pt: 1 }}>
                                            {"User Longitude: " + latLng.lng}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2" sx={{ pt: 1 }}>
                                        {"User location not available"}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ pt: 1 }}>
                                    {"User formatted Address: " + userAddr};
                                </Typography>

                            </div>

                            <div style={{ borderBottom: "3px solid grey", padding: "0.5rem" }}>
                                <Typography variant="body2" sx={{ pt: 1 }}>
                                    {"Hospital Latitude: " + hospital.lat}
                                </Typography>
                                <Typography variant="body2" sx={{ pt: 1 }}>
                                    {"Hospital Longitude: " + hospital.lon}
                                </Typography>
                                <Typography variant="body2" sx={{ pt: 1 }}>
                                    {hospital.address_line2}
                                </Typography>


                            </div>
                            <div style={{ padding: "0.5rem" }}>



                                <Typography variant="body2" sx={{ pt: 1 }}>
                                    {"Distance from your location: " + (hospital.distance / 1000).toFixed(1) + " KM"}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>

                </Grid>
                <Grid item xs={5}>
                    <div style={{ border: "2px solid white", margin: "2rem", padding: "1rem", borderRadius: "5px" }}>
                        <h2 style={{ color: 'white' }}>Directions to Hospital</h2>
                        {
                            routes.map((step, index) => {
                                return (
                                    <Timeline key={index} style={{ height: "50px", margin: "10px" }} sx={{
                                        [`& .${timelineItemClasses.root}:before`]: {
                                            flex: 0,
                                            padding: "1rem"
                                        },
                                    }}>
                                        <TimelineItem style={{ marginTop: "0px" }} >
                                            <TimelineSeparator  >
                                                <TimelineDot sx={{ m: "5px", mt: "0" }} />
                                                {index < routes.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent sx={{ p: "0 10px", lineHeight: "1", color: "white" }}>{step}</TimelineContent>
                                        </TimelineItem>

                                    </Timeline>

                                )
                            })
                        }





                    </div>


                </Grid>
            </Grid>
            {/* </Container> */}

        </div>
    )
}

export default Details
