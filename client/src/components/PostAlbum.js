/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import {
  NavLink,
} from "react-router-dom";
import Select from 'react-select';
import UserContext from '../UserContext'
import network from '../Network.js';
import { useStateIfMounted } from "use-state-if-mounted";

function PostAlbum(props) {
const [artists, setArtists] = useStateIfMounted([]);

const user = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      setArtists(await (await axios.get(`/api/artists`)).data);
    }; fetchData();
   }, []);
  

  const addAlbum = async (event, name, image, artist, created_at) => {
   event.preventDefault();
    const date = new Date();
  const newCreated_at = created_at.slice(0,10)

    if(!artist) {
    return document.getElementById('albumError').innerHTML = "Select an artist";
    }
    try{
    await network.post(`/api/albums`, {
    name: name, 
    ArtistId: artist.value,
    cover_img: image,
    created_at: newCreated_at,
    username: user.username,
    upload_at: date.toISOString().substring(0, 10)
    })
  window.location.reload(false);
} catch (response){
  document.getElementById('albumError').innerHTML = 'Only registered users can post new albums to the website!';
  }; 
};


function form(){
let name;
let image;
let created_at;
let artist;

      function insertName(event) {
        name = event.target.value;
      }
      function insertImage(event) {
        image = event.target.value;
      }

      function insertRelease(event) {
        created_at = event.target.value;
      }

      function insertArtist(event) {
        artist = event;
      }

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;


let selectArtist = artists.map(e => ({ value: e.id, label: e.name }))

return (
 <form id="albumForm" className="albumForm" onSubmit={(event) => addAlbum(event, name, image, artist, created_at)}>
   <div>
    <label> Name of the Album: </label><br/>
    <input id="album_name" required type="text" defaultValue={name} onChange={insertName}/> <br/><br/>
    <br/>
    <label>Artist: </label><i class='tooltip fas fa-info'> <span class="tooltiptext">You can only post albums of uploaded artists</span></i><br/>
    <Select style={{}} required maxMenuHeight={160}
    defaultValue={artist}
    onChange={insertArtist}
    options={selectArtist}>
    </Select><br/><br/>
    <label> Cover image URL </label><br/>
    <input id="album_img" required type="text" defaultValue={image} onChange={insertImage}/><br/><br/>
    <br/>
    <label> Release date: </label><br/>
   <input max={today} style={{height:"32px"}} id="album_date" required type="date" defaultValue={created_at} onChange={insertRelease}/><br/><br/>
    <br/>
    <input type='submit' className="post" value="Post Album"/>
    <NavLink style={{marginTop:'-50px'}} className="fa fa-arrow-left back" to="/Albums"></NavLink>
    </div>
    </form>

)}

  return (
<div> 
{form()}
<p id="albumError" style={{marginTop:"0px", marginLeft:"130px", fontSize:'20px', color:"red"}}></p>
</div>
  );
  }

export default PostAlbum;
