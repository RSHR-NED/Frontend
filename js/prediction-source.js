window.onload = function () {

    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedResults = urlParams.get('results');

    // Decode and parse the JSON data
    const decodedResults = decodeURIComponent(encodedResults);
    const results = JSON.parse(decodedResults);

    console.log("results: ", results);

    const testing_div = document.getElementById("testing");
    // show the results
    for (let i = 0; i < results.length; i++) {
        console.log("Results i: " +  results[i]);
        // show results as string, serialized
        testing_div.innerHTML += JSON.stringify(results[i]) + "<br>";
        }
}

