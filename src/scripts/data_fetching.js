// import all required modules
import axios from "axios"

// exported function to fetch all the facts
export async function fetchFacts(factsTotal, apiKey) {
    // the config needed to request data, more could be added but not needed
    const config = {
        headers: {"X-Api-Key": apiKey}
    }

    // using axios to fetch the facts
    console.log("Fetching facts...")

    try {
        const facts = await axios.get(`https://api.api-ninjas.com/v1/facts?limit=${factsTotal}`, config)
        // destructuring the facts to just return the array of facs
        const result = await facts.data
        // returning the result
        console.log(`Done fetching facts\n ${result[0].fact.slice(0, 20)}...`)
        return result

    } catch (e) {
        if (e.response.status == 502) {
            fetchFacts(factsTotal, apiKey)
            return
        }

        if (e.response.status == 400) {
            fetchFacts(factsTotal, apiKey)
            console.log("Some Error occured. trying again")
            return
        }

    }

    

}