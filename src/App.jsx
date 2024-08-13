import React from 'react'
import hospital from "./assets/hospital.png"
import { Route,Routes } from 'react-router-dom';
import Hospitals from './components/Hospitals';
import Details from './components/Details';
import Container from '@mui/material/Container';



export default function App() {
    return (
        <div >
            <div style={{borderBottom:"1px solid black"}}>
                <Container>
                <div style={{display:"flex",alignItems:"center",}}>
                   <img src={hospital} alt="hospital-log"  height={50} width={50}/>
                   <h2>Med-Route</h2>
                   
                </div>
                </Container>
            </div>

            <Routes>
                <Route path='/' element={<Hospitals/>}/>
                <Route path='/details/:id' element={<Details/>}/>
            </Routes>


        </div>
    )
}
