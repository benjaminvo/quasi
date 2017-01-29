export const particlesInit = {
  methods: {
    particlesInit() {
      particlesJS("particles", {
        "particles": {
          "number": {
            "value": 60
          },
          "shape": {
            "type": "circle"
          },
          "size": {
            "value": 6,
            "random": true
          },
          "line_linked": {
            "enable": false
          },
          "color": {
            "value": "#2962FF"
          },
          "opacity": {
            "value": 1,
            "random": true,
            "anim": {
              "enable": false,
              "opacity_min": 0.2
            }
          },
          "move": {
            "enable": true,
            "speed": .5,
            "direction": "bottom",
            "straight": false
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": false
            }
          },
          "modes": {
            "push": {
              "particles_nb": 12
            }
          }
        }
      })
    }
  }
}
