// Global variable for tracking behaviour score
let behaviourScore = 0;

// Variable for the chart calculation regime
let chartCalculationRegime = 'RANDOM';

// Function to recalculate the chart regime based on the behaviour score
function recalculateRegime() {
    if (behaviourScore > 0 && behaviourScore <= 5) {
        chartCalculationRegime = 'SMALL_DECREASE';
    } else if (behaviourScore > 5 && behaviourScore <= 15) {
        chartCalculationRegime = 'MEDIUM_DECREASE';
    } else if (behaviourScore > 15) {
        chartCalculationRegime = 'BIG_DECREASE';
    } else if (behaviourScore < 0 && behaviourScore >= -5) {
        chartCalculationRegime = 'SMALL_INCREASE';
    } else if (behaviourScore < -5 && behaviourScore >= -15) {
        chartCalculationRegime = 'MEDIUM_INCREASE';
    } else if (behaviourScore < -15) {
        chartCalculationRegime = 'BIG_INCREASE';
    } else {
        chartCalculationRegime = 'RANDOM';
    }

    console.log(`Current chart calculation regime: ${chartCalculationRegime} ${behaviourScore}`);
}

function adjustBehaviourScore(min, max) {
    let randomAdjustment = Math.random() * (max - min) + min;
    behaviourScore += randomAdjustment;  // Modify the behaviour score by a random value within the range
    console.log("Behaviour score adjusted by: " + randomAdjustment + " to: " + behaviourScore);
    
    // After adjustment, recalculate the regime
    recalculateRegime();
}


const ctx = document.getElementById('myLineChart').getContext('2d');

let chartData = {
    labels: [],
    datasets: [{
        label: 'BRL to DRTC',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
    }]
};

let chartConfig = {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            y: {
                ticks: {
                    color: '#fff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        }
    }
};


function changeImage(path) {
    var img = document.getElementById('dart');

    if(img.src == path){
        return
    }
    
    // Set the initial opacity to 1 (fully visible)
    img.style.transition = "opacity 200ms ease-in-out";
    img.style.opacity = 0;  // Fade out the image
    
    // Wait for the fade-out to complete before changing the image
    setTimeout(function() {
        // Change the image source
        img.src = path;

        // Fade in the new image
        img.style.opacity = 1;
    }, 200);  // Wait for 1 second (fade-out duration)
}
const myLineChart = new Chart(ctx, chartConfig);

let lastValue = 10;  // Initial value
const currencyInfo = document.getElementById('current-value');
const emojiSpan = document.getElementById('emoji');
const photo = document.getElementById('dart')

// Function to calculate the next value based on last 10 values, the current value, timestamp, and index
function calculateNext(last10Values, currentValue, timestamp, index) {
    // Modify the behaviour score
    if(behaviourScore >= -1 && behaviourScore <= 1){
        behaviourScore = 0
    }
    if (behaviourScore > 0) {
        behaviourScore -= 0.8;  // Decrease score closer to 0
    } else if (behaviourScore < 0) {
        behaviourScore += 0.8;  // Increase score closer to 0
    }

    // Call recalculateRegime after modifying the score
    recalculateRegime();

    
    
    // Adjust the next value based on the chartCalculationRegime
    let randomChange = 0;
    let src = 'images/d1.webm'
    
    switch (chartCalculationRegime) {
        case 'SMALL_DECREASE':
            randomChange = (Math.random() * -0.5);  // Small decrease
            src = 'images/d4.webm'
            break;
        case 'MEDIUM_DECREASE':
            randomChange = (Math.random() * -1.5);  // Medium decrease
            src = 'images/d5.webm'
            break;
        case 'BIG_DECREASE':
            randomChange = (Math.random() * -3);  // Big decrease
            src = 'images/d8.webm'
            break;
        case 'SMALL_INCREASE':
            randomChange = (Math.random() * 0.5);  // Small increase
            src = 'images/d2.webm'
            break;
        case 'MEDIUM_INCREASE':
            randomChange = (Math.random() * 1.5);  // Medium increase
            src = 'images/d11.webm'
            break;
        case 'BIG_INCREASE':
            randomChange = (Math.random() * 3);  // Big increase
            src = 'images/d10.webm'
            break;
        case 'RANDOM':
        default:
            randomChange = (Math.random() * 2) - 1;  // Random increase/decrease
            src = 'images/d1.webm'
            break;
    }

    console.log(`${index} ${index%50}`)
    if(index % 10 == 0){
        console.log('updateImage')
        changeImage(src)
    }

    let nextValue = currentValue + randomChange;

    // If next value is <= 0, generate a new random value between 0.1 and 10
    if (nextValue <= 0) {
        nextValue = (Math.random() * 1) + 0.001;  // Random value between 0.1 and 10
    }

    return nextValue;
}

// Function to update the currency info (value + emoji) based on the percentage change
function updateCurrencyInfo(newValue) {
    const percentageChange = ((newValue - lastValue) / lastValue) * 100;

    let emoji = '➡️';  // Default emoji for less than 5% change
    let color = '#fff';  // Default color

    if (percentageChange > 0) {
        color = 'green';
    }
    else if (percentageChange < 0) {
        color = 'red';
    }
    else {
        color = '#fff'
    }

    if (percentageChange >= 10) {
        emoji = '⬆️';
    } else if (percentageChange <= -10) {
        emoji = '⬇️';
    } else if (percentageChange >= 5) {
        emoji = '↗️';
    } else if (percentageChange <= -5) {
        emoji = '↘️';
    }

    // Set the current value and emoji
    currencyInfo.textContent = `1 DRT$ = R$ ${newValue.toFixed(3)}`;
    emojiSpan.textContent = emoji;

    // Highlight color change for 500ms if it's an increase or decrease
    currencyInfo.style.color = color;
    setTimeout(() => {
        currencyInfo.style.color = '#e0e0e0';  // Reset color after 500ms
    }, 500);

    lastValue = newValue;  // Update last value for the next change
}

// Function to initialize and pre-fill the chart with 200 values
function preFillChart() {
    let initialValues = [];
    let currentValue = 10;  // Starting value
    let timestamp = Date.now();

    for (let i = 0; i < 200; i++) {
        const last10Values = initialValues.slice(-10);
        const nextValue = calculateNext(last10Values, currentValue, timestamp, i);
        initialValues.push(nextValue);
        currentValue = nextValue;  // Update the current value
        timestamp += 1000;  // Increase the timestamp for each step

        // Format the timestamp to hour:minute and push it to labels
        const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        chartData.labels.push(time);
    }

    chartData.datasets[0].data = initialValues;
    myLineChart.update();
    updateCurrencyInfo(currentValue);  // Set initial currency info
}

let index = 200

// Function to update the chart dynamically
function updateChart() {
    let currentValue = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];  // Last value in the data
    const last10Values = chartData.datasets[0].data.slice(-10);  // Get last 10 values
    const timestamp = Date.now();
    index += 1
    const nextValue = calculateNext(last10Values, currentValue, timestamp, index % 100000);

    // Add the new value to the chart
    chartData.datasets[0].data.push(nextValue);

    // Format the timestamp to hour:minute and add it to the labels
    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    chartData.labels.push(time);

    // Remove old values if the number of points exceeds 200
    if (chartData.datasets[0].data.length > 200) {
        chartData.datasets[0].data.shift();
        chartData.labels.shift();
    }

    myLineChart.update();

    // Update currency info with the new value
    updateCurrencyInfo(nextValue);
}

// Pre-fill the chart with 200 values
preFillChart();

// Update the chart every 1.5 seconds
setInterval(updateChart, 1200);


