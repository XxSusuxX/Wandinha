let gData = [
  {
    lat: 51.5387,
    lng: 0.0172,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'London'
  }, {
    lat: 51.5560,
    lng: 0.2796,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Auckland'
  }, {
    lat: -36.87469632454866,
    lng: 174.74473474233,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Melbourne'
  }, {
    lat: -37.816429063174745,
    lng: 144.94749476852425,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Sydney'
  }, {
    lat: -33.8469997355469,
    lng: 151.06340276838054,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Brisbane'
  }, {
    lat: -27.46471170139598,
    lng: 153.00956338351529,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Brisbane'
  }, {
    lat: 20.68247901855458,
    lng: -103.46255966932007,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Guadalajara'
  }, {
    lat:  -12.057348943154443,
    lng: -77.08325943892392,
    color: 'rgba(246, 85, 59, 0.80)',
    label: 'Lima'
  }
]


let world

function createGlobe () {

  const pathImage = 'assets/img/globe/'
  const idDiv = 'globeViz'
// Get the element by its ID
  const element = document.getElementById(idDiv)

// // Get the height and width
  const heightRender = element.offsetHeight
  const widthRender = element.offsetWidth
  if (heightRender && widthRender) {

    world = Globe({animateIn: false})
      .globeImageUrl(pathImage + '' + 'land_ocean_ice_cloud_2048.jpg')
      .width(widthRender)
      .height(heightRender)
      .labelsData(gData)
      .labelColor(d => d.color)
      .labelSize(1.5)
      .atmosphereAltitude(0)
      .labelText((d) => d.label)
      .labelDotOrientation('bottom')
      .labelDotRadius(1.5)

      (document.getElementById(idDiv))


    // Auto-rotate
    world.controls().autoRotate = true
    world.controls().autoRotateSpeed = 2
    world.controls().enableZoom = false
    // world.controls().mouseButtons = {
    //   LEFT: '',
    //   MIDDLE: '',
    //   RIGHT: ''
    // }


    const globeMaterial = world.globeMaterial()


    const textureLoader2 = new THREE.TextureLoader()
    const backgroundImage = textureLoader2.load(pathImage + '' + '/bg-stars-large.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      globeMaterial.map = texture
      globeMaterial.color = null
    })

    world.scene().background = backgroundImage
  }

}

createGlobe()

window.addEventListener('resize', createGlobe, false)

$('.globalLike--btn')
  .click(function () {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        function (data) {
          const newPoint = {
            lat: data.coords.latitude,
            lng: data.coords.longitude,
            color: 'rgba(246, 85, 59, 0.80)'
          }
          gData = [...gData].concat(newPoint)
          if (world) {
            world.labelsData(gData)
            world.pointOfView(newPoint)
          }

          $(this)
            .prop('disabled', true) // Disable the button
        },
        function (error) {
          switch (error.code) {
            case 1:
              alert('your location is disabled please enable it')
              break
            case 2:
              alert('enable location permission in your browser')
              break
            case 3:
              alert('Permission allowed, timeout reached\'')
              break
          }
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }

  })
