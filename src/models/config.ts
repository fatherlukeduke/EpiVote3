export let ChartOptions = {

    type: 'horizontalBar',
    data: {
        labels: ["Strongly agree", "Agree", "Neutral", "Disagree", "Stongly disagree"],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: [
                '#39a16c',
                '#bad530',
                '#feac27',
                '#ff8c33',
                '#ff696a'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontSize: 17
                }
            }]
        }
    }
}
