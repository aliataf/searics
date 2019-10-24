import React, { Component } from 'react';
import { particlesJS } from 'particles.js';

class Particles extends Component {
    componentDidMount() {
        /* ---- particles.js config ---- */

        particlesJS("particles-js", {
            "particles": {
            "number": {
                "value": 10,
                "density": {
                "enable": true,
                "value_area": 80
                }
            },
            "color": {
                "value": "#000"
            },
            "shape": {
                "type": "circle",
                "polygon": {
                "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
            },
            "size": {
                "value": 3,
                "random": true,
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#000",
                "opacity": 0.5,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 5,
                "bounce": false,
            }
            }
        });
    }
    render() { 
        return <div id="particles-js"></div>
    }
}
 
export default Particles;
