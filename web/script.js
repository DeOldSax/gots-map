var map = L.map('map').setView([51.505, -0.09], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 2,
    maxZoom: 18
}).addTo(map)

map.setZoom(2.5)

let allPoints = []
let markerLayers = []
let heatmapLayer = undefined
let heatmapVisible = false

let dataset = []
let selectedData = []

let markerCluster = {}

let names = []

$.getJSON("data.json", (data) => {
    $("#companyCounter").html(`#Companies: ${data.length} / 6592`)

    for (let i = 0; i < data.length; i++) {
        const lat = data[i]["coords"]["lat"]
        const lng = data[i]["coords"]["lng"]
        names.push(data[i]["details"]["name"])
    }

    $( "#tags" ).autocomplete({
        source: names
    })

    dataset = data
    selectedData = data
})

$("option").click((event) => {
    const selectedOperations = event.target.value.replaceAll(" ", "")

    if (selectedOperations === 'all') {
        selectedData = dataset
    } else {
        selectedData = dataset.filter(company => {
            return company.details.operations.includes(selectedOperations)
        })
    }

    removeMarkers()
    addMarkers()

    removeHeatmap()
    addHeatmap()
})

$("#showcompany").click(() => {
    const value = $("#tags").val()
    const company = dataset.filter((item) => item.details.name.includes(value))[0]

    const lat = company["coords"]["lat"]
    const lng = company["coords"]["lng"]

    map.setView([lat, lng], 18)
})

$("#toggleMarker").click(() => {
    if (markerLayers.length == 0) {
        addMarkers()
    } else {
        removeMarkers()
    }
})

$("#toggleHeatmap").click(() => {
    if (!heatmapVisible) {
        addHeatmap()
    } else {
        removeHeatmap()
    }
})

function addHeatmap() {
    allPoints = []

    for (let i = 0; i < selectedData.length; i++) {
        const lat = selectedData[i]["coords"]["lat"]
        const lng = selectedData[i]["coords"]["lng"]
        allPoints.push([lat, lng])
    }

    heatmapLayer = L.heatLayer(allPoints).addTo(map)
    heatmapVisible = true
}

function removeHeatmap() {
    heatmapVisible = false
    map.removeLayer(heatmapLayer)
}

function removeMarkers() {
    for (let i = 0; i < markerLayers.length; i++) {
        map.removeLayer(markerCluster)
    }
    markerLayers = []
}

function addMarkers() {
    markerCluster = L.markerClusterGroup()

    for (let i = 0; i < selectedData.length; i++) {
        const company_id = selectedData[i]["company_id"]
        const lat = selectedData[i]["coords"]["lat"]
        const lng = selectedData[i]["coords"]["lng"]

        let text = `<b><a href=https://global-standard.org/find-suppliers-shops-and-inputs/certified-suppliers/database/search_result/${company_id}>${selectedData[i]['details']['name']}</a></b>`
        text += "<br/>" + `${selectedData[i]['details']['country']}`
        text += "<br/>" + `${selectedData[i]['details']['categories']}`
        text += "<br/>" + `${selectedData[i]['details']['operations']}`

        let marker = L.marker([lat, lng]).bindPopup(text)

        markerCluster.addLayer(marker)
        markerLayers.push(marker)
    }
    map.addLayer(markerCluster)
}
